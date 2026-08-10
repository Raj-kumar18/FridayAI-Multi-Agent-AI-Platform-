import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "New Chat"
    },
    userId: {
        type: String
    }
}, { timestamps: true })

export const Conversation = mongoose.model("Conversation", conversationSchema)