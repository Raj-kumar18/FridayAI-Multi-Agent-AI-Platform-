import { Conversation } from "../models/conversation.models.js";
import { Message } from "../models/message.models.js";

export const createConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];

        const conversation = await Conversation.create({
            userId: userId
        })

        return res.status(201).json({
            success: true,
            message: "Conversation created successfully",
            data: conversation
        })
    } catch (error) {
        console.error("Conversation creation error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create conversation",
        });
    }
}


export const getConversation = async (req, res) => {
    try {
        const userId = req.headers["x-user-id"];

        const conversations = await Conversation.find({
            userId: userId
        }).sort({ updatedAt: -1 })

        return res.status(200).json({
            success: true,
            message: "Conversations fetched successfully",
            data: conversations
        })
    } catch (error) {
        console.error("Conversation fetching error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch conversations",
        });
    }
}


export const saveMessage = async (req, res) => {
    try {
        const { conversationId, role, content, images, artifacts } = req.body

        const message = await Message.create({
            conversationId: conversationId,
            role: role,
            content: content,
            images: images,
            artifacts: artifacts
        })

        return res.status(201).json({
            success: true,
            message: "Message saved successfully",
            data: message
        })
    } catch (error) {
        console.error("Message saving error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save message",
        });
    }
}


export const getMessage = async (req, res) => {

    try {
        const { conversationId } = req.params

        const messages = await Message.find({
            conversationId: conversationId
        })

        return res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            data: messages
        })
    } catch (error) {
        console.error("Message fetching error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
        });
    }

}



export const getConversationById = async (req, res) => {
    try {
        const { id } = req.params

        const conversation = await Conversation.findById(id)

        return res.status(200).json({
            success: true,
            message: "Conversation fetched successfully",
            data: conversation
        })
    } catch (error) {
        console.error("Conversation fetching error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch conversation",
        });
    }
}


export const updateConversation = async (req, res) => {
    try {
        const { id } = req.params
        const { title } = req.body

        const conversation = await Conversation.findByIdAndUpdate(id, {
            title: title
        })

        return res.status(200).json({
            success: true,
            message: "Conversation updated successfully",
            data: conversation
        })
    } catch (error) {
        console.error("Conversation updating error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update conversation",
        });
    }
}


export const deleteConversation = async (req, res) => {
    try {
        const { id } = req.params

        await Conversation.findByIdAndDelete(id)

        return res.status(200).json({
            success: true,
            message: "Conversation deleted successfully"
        })
    } catch (error) {
        console.error("Conversation deletion error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete conversation",
        });
    }
}