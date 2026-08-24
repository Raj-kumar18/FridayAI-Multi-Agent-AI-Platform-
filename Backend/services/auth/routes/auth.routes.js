import { Router } from "express"
import { deductCredist, login, logout, updateUserPayment } from "../controllers/auth.controller.js"

const authRouter = Router()

authRouter.post("/login", login)
authRouter.get("/logout", logout)
authRouter.post("/update-plan", updateUserPayment)
authRouter.post("/deduct-credits", deductCredist)

export default authRouter