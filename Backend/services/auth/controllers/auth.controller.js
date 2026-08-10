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

        // 5. Store session in Redis
        await redis.set(
            `session:${sessionId}`,
            JSON.stringify({
                userId: user._id.toString(),
                name: user.name,
                email: user.email,
                avatar: user.avatar,
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
        console.log(sessionId)

        if (sessionId) {
            await redis.del(`session:${sessionId}`);
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