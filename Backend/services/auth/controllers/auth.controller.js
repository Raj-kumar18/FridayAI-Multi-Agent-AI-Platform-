import crypto from "node:crypto";
import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import { User } from "../models/user.models.js";
import redis from "../../../shared/redis/redis.js";

const SESSION_TTL = 7 * 24 * 60 * 60;

export const login = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Firebase token is required",
            });
        }

        // 1. Verify Firebase ID Token
        const decoded = await getAuth(app).verifyIdToken(token);

        // 2. Find user
        let user = await User.findOne({
            firebaseUid: decoded.uid,
        });

        // 3. Create user if doesn't exist
        if (!user) {
            user = await User.create({
                firebaseUid: decoded.uid,
                email: decoded.email,
                name: decoded.name,
                avatar: decoded.picture,
            });
        }

        // 4. Generate session ID
        const sessionId = crypto.randomUUID();
        await redis.set(`user-session-${user?._id.toString()}`, sessionId, "EX", SESSION_TTL)

        // 5. Store session in Redis
        await redis.set(
            `session:${sessionId}`,
            JSON.stringify({
                userId: user._id.toString(),
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                plan: user.plan,
                credits: user.credits,
                totalCredits: user.totalCredits,
                planExpiresAt: user.planExpiresAt

            }),
            "EX",
            SESSION_TTL
        );

        // 6. Store session ID in HTTP-only cookie
        res.cookie("session", sessionId, {
            httpOnly: true,
            secure: false, // true in HTTPS production
            sameSite: "strict",
            maxAge: SESSION_TTL * 1000,
        });

        // 7. Response
        return res.status(200).json({
            success: true,
            message: "Login successful",
            user,
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(401).json({
            success: false,
            message: "Login failed",
        });
    }
};

export const logout = async (req, res) => {
    try {

        const sessionId = req.cookies?.session;

        if (sessionId) {

            const sessionKey = `session:${sessionId}`;

            const sessionData = await redis.get(sessionKey);

            if (sessionData) {

                const session = JSON.parse(sessionData);

                await redis.del(
                    `user-session-${session.userId}`
                );
            }

            await redis.del(sessionKey);
        }

        res.clearCookie("session", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });

    } catch (error) {

        console.error("Logout error:", error);

        return res.status(500).json({
            success: false,
            message: "User logout failed",
        });
    }
};


export const updateUserPayment = async (req, res) => {
    try {
        const { plan, credits, userId } = req.body;

        if (!userId || !plan || credits == null) {
            return res.status(400).json({
                success: false,
                message: "userId, plan and credits are required",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Update database
        user.plan = plan;
        user.credits += credits;
        user.totalCredits += credits;

        user.planExpiresAt = new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
        );

        await user.save();

        // Get current session
        const sessionId = await redis.get(
            `user-session-${user._id.toString()}`
        );

        if (sessionId) {

            const sessionData = {
                userId: user._id.toString(),
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                plan: user.plan,
                credits: user.credits,
                totalCredits: user.totalCredits,
                planExpiresAt: user.planExpiresAt,
            };

            // IMPORTANT: same key format as login
            await redis.set(
                `session:${sessionId}`,
                JSON.stringify(sessionData),
                "EX",
                SESSION_TTL
            );
        }

        return res.status(200).json({
            success: true,
            message: "User payment updated successfully",
            user: {
                id: user._id,
                plan: user.plan,
                credits: user.credits,
                totalCredits: user.totalCredits,
                planExpiresAt: user.planExpiresAt,
            },
        });

    } catch (error) {

        console.error("Update payment error:", error);

        return res.status(500).json({
            success: false,
            message: "User payment failed!",
        });
    }
};


export const deductCredist = async (req, res) => {
    try {
        const { userId, agent } = req.body
        if (!userId || !agent) {
            return res.status(400).json({
                success: false,
                message: "userId and agent are required",
            });
        }

        const COST = {
            chat: 1,
            search: 5,
            coding: 10,
            pdf: 10,
            ppt: 10,
            vision: 10,
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const cost = COST[agent]
        if (!cost) {
            return res.status(400).json({
                success: false,
                message: "Invalid agent",
            });
        }

        if (user.credits < cost) {
            return res.status(400).json({
                success: false,
                message: "Insufficient credits",
            });
        }

        user.credits -= cost

        await user.save()

        const sessionId = await redis.get(
            `user-session-${user._id.toString()}`
        );

        if (sessionId) {

            const sessionData = {
                userId: user._id.toString(),
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                plan: user.plan,
                credits: user.credits,
                totalCredits: user.totalCredits,
                planExpiresAt: user.planExpiresAt,
            };

            // IMPORTANT: same key format as login
            await redis.set(
                `session:${sessionId}`,
                JSON.stringify(sessionData),
                "EX",
                SESSION_TTL
            );
        }

        return res.status(200).json({
            success: true,
            message: "Credits deducted successfully",
            userId: user._id,
            credits: user.credits,
            agent,
            cost,
            timestamp: new Date(),
        });

    } catch (error) {
        console.error("Deduct credits error:", error);
        return res.status(500).json({
            success: false,
            message: "Deduct credits failed!",
        });
    }
}