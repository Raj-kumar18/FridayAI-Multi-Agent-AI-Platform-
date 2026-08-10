import axios from "axios";
import { graph } from "../graph/graph.js"

export const agent = async (req, res) => {
    try {
        const { prompt, conversationId } = req.body

        await axios.post(`${process.env.CHAT_SERVICE_URL}/api/chat/saveMessage`, {
            conversationId: conversationId,
            role: "user",
            content: prompt
        })

        const result = await graph.invoke({
            prompt: prompt,
            conversationId: conversationId
        })

        // await axios.post(`${process.env.CHAT_SERVICE_URL}/api/chat/saveMessage`, {
        //     conversationId: conversationId,
        //     role: "ai",
        //     content: result.aiResponse
        // })

        return res.status(200).json({
            success: true,
            message: "Agent response received",
            data: result.aiResponse
        })

    } catch (error) {

        console.error("Agent error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get agent response"
        })
    }
}