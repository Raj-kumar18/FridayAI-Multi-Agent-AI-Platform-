import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    role: {
        type: String,
        eunm: ["user", "assistant"]
    },
    content: {
        type: String,
        required: true
    },
}, { timestamps: true })


export const Message = mongoose.model("Message", messageSchema)


