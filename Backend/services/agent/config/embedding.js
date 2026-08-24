import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv"
dotenv.config()

export const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001"
})