import axios from "axios";
import { graph } from "../graph/graph.js"
import dotenv from "dotenv"
import { addMessage } from "../config/memory.js";
dotenv.config()

export const agent = async (req, res) => {
    try {
        const { prompt, conversationId, agent } = req.body
        const userId = req.headers["x-user-id"]


        await axios.post(
            `${process.env.CHAT_SERVICE_URL}/saveMessage`,
            {
                conversationId,
                role: "user",
                content: prompt
            }
        )
        await addMessage(conversationId, "user", prompt)
        const result = await graph.invoke({
            prompt,
            conversationId,
            agent,
            userId
        })

        console.log("🔥 GRAPH RESULT:", result)
        console.log("🔥 AI RESPONSE:", result.aiResponse)
        if (!result.aiResponse) {
            throw new Error(
                `Agent "${result.agent}" did not return aiResponse`
            );
        }

        await addMessage(conversationId, "assistant", result.aiResponse)
        await axios.post(
            `${process.env.CHAT_SERVICE_URL}/saveMessage`,
            {
                conversationId,
                role: "assistant",
                content: result?.aiResponse,
                images: result?.images,
                artifacts: result?.artifacts
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
            data: {
                answer: result.aiResponse,
                images: result.images,
                artifacts: result.artifacts
            }
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