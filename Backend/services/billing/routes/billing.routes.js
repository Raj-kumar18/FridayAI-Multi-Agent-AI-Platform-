import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/billing.controller.js";

const billingRouter = Router()

billingRouter.post("/create-order", createOrder)
billingRouter.post("/verify-payment", verifyPayment)


export default billingRouter