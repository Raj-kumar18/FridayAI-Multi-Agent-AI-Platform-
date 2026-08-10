import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firebaseUid: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },

}, { timestamps: true })

export const User = mongoose.model("User", userSchema)