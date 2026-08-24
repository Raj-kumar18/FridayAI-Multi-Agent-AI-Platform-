import { Router } from "express"
import { agent } from "../controllers/agent.controller.js"
import upload from "../config/multer.js"

const agentRouter = Router()

agentRouter.post("/chat", upload.single("file"), agent)

export default agentRouter