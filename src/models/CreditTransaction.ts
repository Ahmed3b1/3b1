import mongoose, { Schema, model, models } from "mongoose";

const CreditTransactionSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        referenceType: {
            type: String,
            enum: ["flow", "node", "execution", "purchase"],
            required: true,
        },
        referenceId: {
            type: String,
            required: true,
        },
        metadata: {
            type: Schema.Types.Mixed,
        },
    },
    { timestamps: true }
)

const CreditTransaction = models.CreditTransaction || model("CreditTransaction", CreditTransactionSchema)

export default CreditTransaction