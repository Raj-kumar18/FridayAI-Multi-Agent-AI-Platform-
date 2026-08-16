import { ChatGroq } from "@langchain/groq"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatOpenRouter } from "@langchain/openrouter"
import dotenv from "dotenv"

dotenv.config()

export const chatGroqModel = new ChatGroq({
    model: "openai/gpt-oss-120b",


})

export const chatGoogleGenerativeAIModel = new ChatGoogleGenerativeAI({
    model: "gemini-3.5-flash",
})
export const chatOpenRouterModel = new ChatOpenRouter({
    model: "deepseek/deepseek-chat",
    temperature: 0,
    maxTokens: 2500,
});
console.log(
    "OpenRouter key loaded:",
    Boolean(process.env.OPENROUTER_API_KEY)
);


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
            return chatGroqModel;
        case "vision":
            return chatGoogleGenerativeAIModel;
        default:
            return chatGroqModel;
    }
}