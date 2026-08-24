import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import agentRouter from "./routes/agent.routes.js"

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/", agentRouter)
app.use((err, req, res, next) => {
    console.log(err)
    if (err.status) {
        return res.status(err.status).json(err.data)
    }
    return res.status(500).json({ message: `agent error ${error}` })
})

app.listen(process.env.PORT, () => {
    console.log(`Agent service is running on port ${process.env.PORT}`)
    connectDB()
})