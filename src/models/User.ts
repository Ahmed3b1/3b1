import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        select: false,
    },
    images: {
        type: String,
    },
    credits: {
        type: Number,
        default: 20,
    },
        creditsUsed: {
        type: Number,
        default: 0,
    },
    plan: {
        type: String,
        enum: ["free", "pro", "enterprise"],
        default: "free",
    },
}, { timestamps: true })

const User = models.User || model("User", UserSchema)
export default User