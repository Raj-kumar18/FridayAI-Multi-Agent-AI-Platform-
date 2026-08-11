import axios from "axios";
import { graph } from "../graph/graph.js"
import dotenv from "dotenv"
dotenv.config()

export const agent = async (req, res) => {
    try {
        const { prompt, conversationId } = req.body
        await axios.post(
            `${process.env.CHAT_SERVICE_URL}/saveMessage`,
            {
                conversationId,
                role: "user",
                content: prompt
            }
        )

        const result = await graph.invoke({
            prompt,
            conversationId
        })
        await axios.post(
            `${process.env.CHAT_SERVICE_URL}/saveMessage`,
            {
                conversationId,
                role: "assistant",
                content: result.aiResponse
            }
        )

        console.log("================================")
        console.log(result.aiResponse)
        console.log("================================")
        console.log(result)
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

        console.error("========== AGENT ERROR ==========");

        console.error("Message:", error.message);

        console.error("Response:", error.response?.data);

        console.error("Status:", error.response?.status);

        console.error("Stack:", error.stack);

        console.error("==================================");

        return res.status(500).json({
            success: false,
            message: "Failed to get agent response"
        });
    }
}