// graph/agents/calendar.agnet.js
//
// Ye LangGraph node hai jo "router" se calendar-category prompt receive karta
// hai, LLM se usme se structured intent (schedule/get/update/delete) aur
// params nikalwata hai, phir calendar.service.js ke sahi function ko call
// karke result ko Hinglish response me convert karta hai.

import { getLLMModel } from "../../config/llmModel.js";
import {
    scheduleMeeting,
    getMeetings,
    updateMeeting,
    deleteMeeting
} from "../../service/Calendar.service.js";

export const calendarAgent = async (state) => {
    const llm = await getLLMModel("calendar");

    // ------------------------------------------------------------------
    // Step 1: LLM se structured JSON nikalwana — ye pura logic ka core hai.
    // Hum LLM ko ek "extraction" role de rahe hain, chat response nahi.
    // ------------------------------------------------------------------
    const today = new Date();
    const extractionPrompt = `You are a calendar intent extractor. Today's date and time is ${today.toISOString()}.

    From the user's message, extract a JSON object ONLY (no markdown, no explanation) in this exact shape:

    {
        "action": "schedule" | "get" | "update" | "delete",
        "title": string | null,
        "description": string | null,
        "startTime": ISO-8601 string | null,
        "endTime": ISO-8601 string | null,
        "attendees": array of email strings,
        "eventId": string | null,
        "timeMin": ISO-8601 string | null,
        "timeMax": ISO-8601 string | null
    }

    Rules:
    - "schedule" needs title, startTime, endTime.
    - "update" and "delete" need eventId if user mentioned which meeting (otherwise null, we'll ask).
    - "get" is for listing/checking meetings, use timeMin/timeMax if user specified a range.
    - If a field isn't mentioned, use null (or empty array for attendees).

    Hinglish Date & Time rules for "startTime" and "endTime":
    - "aaj" means Today (${today.toISOString().split('T')[0]}).
    - "kl" or "kal" means Tomorrow (next day: ${new Date(today.getTime() + 24*60*60*1000).toISOString().split('T')[0]}).
    - "parso" means Day after tomorrow.
    - "title" is the main activity or meeting topic. If the user mentions an activity they want to do (e.g. "toxic dekhna" or "plan to do X"), extract that activity as the "title".
    - If the user specifies a day (e.g. "kl" or "kal" or "aaj") but does not specify a specific time (hours/minutes), default the "startTime" to 10:00 AM of that day in user's timezone (e.g. "YYYY-MM-DDT10:00:00+05:30") and "endTime" to 11:00 AM of that day (e.g. "YYYY-MM-DDT11:00:00+05:30"). Use the Asia/Kolkata timezone (+05:30 offset).

    User message:
    "${state.prompt}"
    `;

    const result = await llm.invoke(extractionPrompt);

    let parsed;
    try {
        // LLM kabhi-kabhi ```json ke saath wrap kar deta hai, usse clean karo
        const cleaned = result.content.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(cleaned);
    } catch (err) {
        return {
            ...state,
            aiResponse: "Maaf karna, meeting details samajh nahi paaya. Please date, time aur title clearly bata do."
        };
    }

    // ------------------------------------------------------------------
    // Step 2: Extracted intent ke hisaab se sahi service function call karo
    // ------------------------------------------------------------------
    try {
        let responseText = "";
        let data;

        switch (parsed.action) {
            case "schedule":
                if (!parsed.startTime || !parsed.endTime) {
                    responseText = "Meeting kab schedule karni hai? Please clear date aur time batao.";
                    break;
                }
                if (!parsed.title && !parsed.description) {
                    responseText = "Meeting ka title kya hona chahiye? Please batao.";
                    break;
                }
                if (!parsed.title && parsed.description) {
                    parsed.title = parsed.description;
                }
                data = await scheduleMeeting(state.userId, parsed);
                responseText = `✅ Meeting "${data.summary}" schedule ho gayi hai.\n📅 ${new Date(data.start.dateTime).toLocaleString("en-IN")}\n🔗 ${data.hangoutLink || data.htmlLink}`;
                break;

            case "get":
                data = await getMeetings(state.userId, parsed);
                if (Array.isArray(data)) {
                    responseText = data.length
                        ? data.map(e => `• ${e.summary} — ${new Date(e.start.dateTime || e.start.date).toLocaleString("en-IN")}`).join("\n")
                        : "Koi upcoming meeting nahi mili.";
                } else {
                    responseText = `📅 ${data.summary} — ${new Date(data.start.dateTime).toLocaleString("en-IN")}`;
                }
                break;

            case "update":
                if (!parsed.eventId) {
                    responseText = "Kaunsi meeting update karni hai, please event ID ya us meeting ka naam confirm karo (pehle 'get' karke dikhata hoon).";
                    break;
                }
                data = await updateMeeting(state.userId, parsed.eventId, parsed);
                responseText = `✏️ Meeting update ho gayi: "${data.summary}"`;
                break;

            case "delete":
                if (!parsed.eventId) {
                    responseText = "Kaunsi meeting cancel karni hai, please confirm karo.";
                    break;
                }
                await deleteMeeting(state.userId, parsed.eventId);
                responseText = "🗑️ Meeting cancel/delete ho gayi hai.";
                break;

            default:
                responseText = "Samajh nahi paaya aapko kya karna hai — schedule, dekhna, update ya delete?";
        }

        return { ...state, aiResponse: responseText };

    } catch (err) {
        console.error("Calendar agent error:", err.message);
        return {
            ...state,
            aiResponse: err.message.includes("not connected")
                ? "Pehle apna Google Calendar connect karo settings me."
                : "Meeting process karne me error aaya, dobara try karo."
        };
    }
};