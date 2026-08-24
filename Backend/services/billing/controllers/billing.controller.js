import axios from "axios";
import { PLANS } from "../config/plan.js";
import razorpay from "../config/razorpay.js";
import Payment from "../models/payment.models.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();


export const createOrder = async (req, res) => {
    try {
        const { plan } = req.body;
        const userId = req.headers["x-user-id"];

        console.log("Requested plan:", plan);
        console.log("User ID:", userId);

        const selectedPlan = PLANS[plan];

        console.log("Selected plan:", selectedPlan);

        // IMPORTANT: check NOT found
        if (!selectedPlan) {
            return res.status(404).json({
                success: false,
                message: "Plan not found",
            });
        }

        const order = await razorpay.orders.create({
            amount: selectedPlan.amount * 100,
            currency: "INR",
            receipt: `order_rcpt_${Date.now()}`,
        });

        console.log("Razorpay order:", order);

        const payment = await Payment.create({
            userId,
            orderId: order.id,
            amount: selectedPlan.amount,
            credits: selectedPlan.credits,
            plan: selectedPlan.id,
            currency: order.currency,
            status: "created",
        });

        console.log("Payment created:", payment._id);

        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            order,
            plan: selectedPlan,
        });

    } catch (error) {

        console.error("========== ORDER CREATION ERROR ==========");
        console.error(error);
        console.error("==========================================");

        return res.status(500).json({
            success: false,
            message: "Failed to create order",
            error: error.message,
        });
    }
};


export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        // ============================================
        // Generate signature
        // ============================================

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");

        // ============================================
        // Verify signature
        // ============================================

        if (generatedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed!",
            });
        }

        // ============================================
        // Find payment
        // ============================================

        const payment = await Payment.findOne({
            orderId: razorpay_order_id,
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found!",
            });
        }

        // ============================================
        // Prevent duplicate verification
        // ============================================

        if (payment.status === "paid") {
            return res.status(400).json({
                success: false,
                message: "Payment already verified",
            });
        }

        // ============================================
        // Update payment
        // ============================================

        payment.status = "paid";
        payment.paymentId = razorpay_payment_id;

        await payment.save();

        // ============================================
        // Update user plan
        // ============================================

        await axios.post(
            `${process.env.AUTH_SERVICE}/update-plan`,
            {
                userId: payment.userId,
                plan: payment.plan,
                credits: payment.credits,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
        });

    } catch (error) {

        console.error("========== PAYMENT VERIFICATION ERROR ==========");
        console.error(error);
        console.error("================================================");

        return res.status(500).json({
            success: false,
            message: "Payment verification failed!",
        });
    }
};