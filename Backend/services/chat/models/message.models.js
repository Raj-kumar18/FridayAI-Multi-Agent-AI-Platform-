import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    name: String,
    content: String
}, { _id: false })


const artifactSchema = new mongoose.Schema({
    id: Number,
    type: String,
    title: String,
    files: [fileSchema]
}, { _id: false });

const messageSchema = new mongoose.Schema({
    conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation"
    },
    role: {
        type: String,
        eunm: ["user", "assistant"]
    },
    content: {
        type: String,
        required: true
    },
    images: [String],
    artifacts: [artifactSchema]
}, { timestamps: true })


export const Message = mongoose.model("Message", messageSchema)


