// routes/googleCalendar.route.js
//
// OAuth2 flow ke liye 4 routes:
//   GET  /google/connect     -> user ko Google consent screen pe bhejta hai
//   GET  /google/callback    -> Google se code aata hai, token exchange hota hai
//   GET  /google/status      -> frontend check karta hai connected hai ya nahi
//   POST /google/disconnect  -> connection remove karna
//
// .env me ye chahiye:
//   GOOGLE_CLIENT_ID=xxxx
//   GOOGLE_CLIENT_SECRET=xxxx
//   GOOGLE_REDIRECT_URI=http://localhost:5000/api/calendar/google/callback
//   FRONTEND_URL=http://localhost:3000
//
// NOTE: GOOGLE_REDIRECT_URI Google Cloud Console -> OAuth Client ->
// "Authorized redirect URIs" me EXACT match hona chahiye, warna
// redirect_uri_mismatch error aayega.

import express from "express";
import { google } from "googleapis";
import { User } from "../models/user.models.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const getOAuthClient = () => new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// ---------------------------------------------------------------------
// STEP 1: Frontend "Connect" button is URL pe redirect karega
// ---------------------------------------------------------------------
router.get("/google/connect", (req, res) => {
    const userId = req.headers["x-user-id"];
    const oauth2Client = getOAuthClient();

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/calendar.events"
        ],
        state: userId // callback me pata chalega kaunsa user connect kar raha hai
    });

    res.redirect(authUrl);
});

// ---------------------------------------------------------------------
// STEP 2: Google is URL pe wapas bhejega ?code=...&state=userId ke saath
// ---------------------------------------------------------------------
router.get(["/google/callback", "/oauth/callback"], async (req, res) => {
    try {
        const { code, state: userId } = req.query;
        const oauth2Client = getOAuthClient();

        const { tokens } = await oauth2Client.getToken(code);
        // tokens = { access_token, refresh_token, expiry_date, ... }

        const user = await User.findById(userId).select("+googleCalendar.refreshToken");
        const refreshToken = tokens.refresh_token || user?.googleCalendar?.refreshToken;

        if (!refreshToken) {
            // Ye tab hota hai jab user pehle se consent de chuka ho aur
            // prompt:"consent" force na kiya gaya ho aur koi existing token bhi database me na ho
            return res.redirect(`${process.env.FRONTEND_URL}/settings?calendar=already_connected_or_error`);
        }

        await User.findByIdAndUpdate(
            userId,
            {
                googleCalendar: {
                    refreshToken: refreshToken,
                    accessToken: tokens.access_token,
                    connected: true,
                    connectedAt: new Date()
                }
            }
        );

        res.redirect(`${process.env.FRONTEND_URL}/settings?calendar=connected`);

    } catch (err) {
        console.error("Google Calendar OAuth error:", err.message);
        res.redirect(`${process.env.FRONTEND_URL}/settings?calendar=error`);
    }
});

// ---------------------------------------------------------------------
// Status check — frontend ye poochega connected hai ya nahi
// ---------------------------------------------------------------------
router.get("/google/status", async (req, res) => {
    const userId = req.headers["x-user-id"];
    const user = await User.findById(userId);
    res.json({ connected: user?.googleCalendar?.connected || false });
});

// ---------------------------------------------------------------------
// Disconnect
// ---------------------------------------------------------------------
router.post("/google/disconnect", async (req, res) => {
    const userId = req.headers["x-user-id"];
    await User.findByIdAndUpdate(
        userId,
        {
            googleCalendar: {
                refreshToken: null,
                accessToken: null,
                connected: false,
                connectedAt: null
            }
        }
    );
    res.json({ success: true });
});

export default router;