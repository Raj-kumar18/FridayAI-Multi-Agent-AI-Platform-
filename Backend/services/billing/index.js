import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import billingRouter from "./routes/billing.routes.js"

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//routes
app.use("/", billingRouter)

app.listen(process.env.PORT, () => {
    console.log(`Billing service is running on port ${process.env.PORT}`)
    connectDB()
})