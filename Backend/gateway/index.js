import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import proxy from "express-http-proxy"
import cookieParser from "cookie-parser"
import protect from "./middleware/auth.middleware.js"
import getCurrentUser from "./controller/user.controller.js"
import proxyWithHeader from "./utils/proxyWithHeader.js"
import morgan from "morgan"
dotenv.config()

const port = process.env.PORT || 8000
const app = express()

app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())
app.use(morgan("dev"))
app.get("/api/auth/me", protect, getCurrentUser)
app.use("/api/auth", proxy(process.env.AUTH_SERVICE))
app.use("/api/chat", protect, proxyWithHeader(process.env.CHAT_SERVICE))
app.use("/api/agent", protect, proxyWithHeader(process.env.AGENT_SERVICE))


app.listen(port, () => {
    console.log(`Gateway is running on port ${port}`)
})