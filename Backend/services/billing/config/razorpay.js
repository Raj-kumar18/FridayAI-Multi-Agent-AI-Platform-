import Razorpay from "razorpay"
import dotenv from "dotenv"

dotenv.config()
console.log("RAZORPAY KEY:", process.env.RAZORPAY_KEY_ID);
console.log(
    "RAZORPAY SECRET EXISTS:",
    Boolean(process.env.RAZORPAY_KEY_SECRET)
);
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

export default razorpay