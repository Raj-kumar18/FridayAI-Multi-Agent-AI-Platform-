import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import dotenv from "dotenv"

dotenv.config()

export const chatGroqModel = new ChatGroq({
    model: "openai/gpt-oss-120b",


})

export const chatGoogleGenerativeAIModel = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash",
})


export const getLLMModel = async (agent) => {
    switch (agent) {
        case "chat":
            return chatGroqModel;
        case "search":
            return chatGroqModel;
        case "pdf":
            return chatGroqModel;
        case "ppt":
            return chatGroqModel;
        case "coding":
            return chatGoogleGenerativeAIModel;
        case "vision":
            return chatGoogleGenerativeAIModel;
        default:
            return chatGroqModel;
    }
}