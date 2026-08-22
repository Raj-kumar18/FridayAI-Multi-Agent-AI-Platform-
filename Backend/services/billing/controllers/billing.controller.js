import axios from "axios"
import { PLANS } from "../config/plan.js"
import razorpay from "../config/razorpay.js"
import Payment from "../models/payment.models.js"

export const createOrder = async (req, res) => {
    try {
        const { plan } = req.body
        const userId = req.headers["x-user-id"]

        const selectedPlan = PLANS[plan]
        if (selectedPlan) {
            return res.status(404).json({
                success: "false",
                message: "Plan not found"
            })
        }

        const order = await razorpay.orders.create({
            amount: selectedPlan.amount * 100,
            currency: "INR",
            receipt: `order_rcpt_${Date.now()}`
        })


        await Payment.create({
            userId,
            orderId: order.id,
            amount: selectedPlan.amount,
            credits: selectedPlan.credits,
            plan: selectedPlan.id,
            currency: order.currency,
            status: "created"
        })

        return res.status(200).json({
            success: "true",
            message: "Order created successfully",
            order,
            plan: selectedPlan
        })


    } catch (error) {
        console.error("Order creation error:", error.message);
        return res.status(500).json({
            success: "false",
            message: "Failed to create order"
        });

    }
}


export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const generatSignature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
        generatSignature.update(`${razorpay_order_id}|${razorpay_payment_id}`)
        const digitalSignature = generatSignature.digest("hex")

        if (digitalSignature != razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed !"
            })
        }


        //update payment status

        const payment = Payment.findOne({ orderId: razorpay_order_id })
        if (!payment) {
            return res.status(400).json({
                success: false,
                message: "Payment not found !"
            })
        }

        payment.status = "paid"
        payment.paymentId = razorpay_payment_id
        await payment.save()


        axios.post(`${process.env.AUTH_SERVICE}/update-plan`, {
            userId: payment.userId,
            plan: payment.plan,
            credits: payment.credits
        })


        return res.status(200).json({
            success: true,
            message: "payemnt verified"
        })



    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "payemnt verification failed ! "
        })
    }
}