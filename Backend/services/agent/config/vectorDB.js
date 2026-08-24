import { QdrantVectorStore } from "@langchain/qdrant"
import { embeddings } from "./embedding.js"
import dotenv from "dotenv"
dotenv.config()
export const vectorStore = async (docs, collectionName) => {
    return await QdrantVectorStore.fromDocuments(docs, embeddings, {
        url: process.env.QDRANT_URL,
        collectionName,
    });
}