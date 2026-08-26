import { google } from "googleapis"
import { User } from "../models/user.models.js"
import dotenv from "dotenv"
dotenv.config()

const OAuth2Client = () => {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    )
}

export const getCalendarClient = async (userId) => {
    const user = await User.findById(userId).select("+googleCalendar.refreshToken +googleCalendar.accessToken");

    if (!user?.googleCalendar?.refreshToken) {
        throw new Error("Google Calendar not connected for this user");
    }
    const oauth2Client = OAuth2Client()

    oauth2Client.setCredentials({
        access_token: user.googleCalendar.accessToken,
        refresh_token: user.googleCalendar.refreshToken
    });

    oauth2Client.on("tokens", async (tokens) => {
        if (tokens.access_token) {
            await User.findByIdAndUpdate(userId, {
                "googleCalendar.accessToken": tokens.access_token
            });
        }
    });

    return google.calendar({ version: "v3", auth: oauth2Client })
}


// 1 new meeting/event create krena 

export const scheduleMeeting = async (userId, { title, description, startTime, endTime, attendees = [], timeZone = "Asia/Kolkata" }) => {
    try {
        const calendar = await getCalendarClient(userId)
        const event = {
            summary: title,
            description,
            start: { dateTime: startTime, timeZone },
            end: { dateTime: endTime, timeZone },
            attendees: Array.isArray(attendees) ? attendees.map(email => ({ email })) : [],
            conferenceData: {
                createRequest: { requestId: `${Date.now()}` } // Google Meet link auto-generate
            }
        }
        const response = await calendar.events.insert({
            calendarId: "primary",
            resource: event,
            conferenceDataVersion: 1,
            sendUpdates: "all" // attendees ko email invite jayega
        });

        return response.data;
    } catch (error) {
        throw error
    }
}






// ---------------------------------------------------------------------
// 2. GET — meetings fetch karna (single event ya list)
// ---------------------------------------------------------------------
export const getMeetings = async (
    userId,
    { eventId, timeMin, timeMax, maxResults = 10 } = {}
) => {
    const calendar = await getCalendarClient(userId);

    if (eventId) {
        const response = await calendar.events.get({ calendarId: "primary", eventId });
        return response.data;
    }

    const response = await calendar.events.list({
        calendarId: "primary",
        timeMin: timeMin || new Date().toISOString(),
        timeMax: timeMax || undefined,
        maxResults,
        singleEvents: true,
        orderBy: "startTime"
    });

    return response.data.items;
};

// ---------------------------------------------------------------------
// 3. UPDATE — existing meeting modify karna
// ---------------------------------------------------------------------
export const updateMeeting = async (userId, eventId, updates) => {
    const calendar = await getCalendarClient(userId);

    // pehle existing event laao, phir sirf diye gaye fields patch karo
    // (partial update ke liye safe approach — baaki fields untouched rehte hain)
    const existing = await calendar.events.get({ calendarId: "primary", eventId });

    const updatedEvent = {
        ...existing.data,
        summary: updates.title ?? existing.data.summary,
        description: updates.description ?? existing.data.description,
        start: updates.startTime
            ? { dateTime: updates.startTime, timeZone: updates.timeZone || "Asia/Kolkata" }
            : existing.data.start,
        end: updates.endTime
            ? { dateTime: updates.endTime, timeZone: updates.timeZone || "Asia/Kolkata" }
            : existing.data.end
    };

    const response = await calendar.events.update({
        calendarId: "primary",
        eventId,
        resource: updatedEvent,
        sendUpdates: "all"
    });

    return response.data;
};

// ---------------------------------------------------------------------
// 4. DELETE — meeting cancel karna
// ---------------------------------------------------------------------
export const deleteMeeting = async (userId, eventId) => {
    const calendar = await getCalendarClient(userId);

    await calendar.events.delete({
        calendarId: "primary",
        eventId,
        sendUpdates: "all"
    });

    return { deleted: true, eventId };
};
