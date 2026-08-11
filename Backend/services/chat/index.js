import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import chatRouter from "./route/chat.routes.js"

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/", chatRouter)
app.listen(process.env.PORT, () => {
    console.log(`Chat service is running on port ${process.env.PORT}`)
    connectDB()
})