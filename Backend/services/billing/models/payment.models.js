import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    paymentId: {
        type: String
    },
    amount: {
        type: Number
    },
    currency: {
        type: String,
        default: "INR"
    },
    credits: {
        type: Number
    },
    plan: {
        type: String
    },
    status: {
        type: String,
        enum: ["created", "paid", "failed", "pending", "refunded"],
        default: "created"
    }
})

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;