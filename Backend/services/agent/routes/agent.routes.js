import { Router } from "express"
import { agent } from "../controllers/agent.controller.js"

const agentRouter = Router()

agentRouter.post("/chat", agent)

export default agentRouter