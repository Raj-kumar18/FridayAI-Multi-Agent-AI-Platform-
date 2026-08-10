import { Router } from "express"
import {
    createConversation,
    deleteConversation,
    getConversation,
    getConversationById,
    getMessage,
    saveMessage,
    updateConversation
} from "../controller/chat.controller.js"

const chatRouter = Router()

chatRouter.get("/createConversation", createConversation)
chatRouter.get("/getConversation", getConversation)
chatRouter.post("/saveMessage", saveMessage)
chatRouter.get("/getMessage/:conversationId", getMessage)
chatRouter.get("/getConversationById/:id", getConversationById)
chatRouter.put("/updateConversation/:id", updateConversation)
chatRouter.delete("/deleteConversation/:id", deleteConversation)

export default chatRouter
