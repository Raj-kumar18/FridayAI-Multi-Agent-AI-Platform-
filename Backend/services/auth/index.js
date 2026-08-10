import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import authRouter from "./routes/auth.routes.js"

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/", authRouter)

app.listen(process.env.PORT, () => {
    console.log(`Auth service is running on port ${process.env.PORT}`)
    connectDB()
})