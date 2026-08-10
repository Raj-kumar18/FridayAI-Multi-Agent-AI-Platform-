import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import agentRouter from "./routes/agent.routes.js"

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/", agentRouter)

app.listen(process.env.PORT, () => {
    console.log(`Agent service is running on port ${process.env.PORT}`)
    connectDB()
})