import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import CreditTransaction from "@/models/CreditTransaction";

interface DeductCreditsParams {
    userId: string;
    amount: number;
    reason: string;
    referenceType: "flow" | "node" | "execution";
    referenceId: string;
    metadata?: any;
}

export async function deductCredits({
    userId,
    amount,
    reason,
    referenceType,
    referenceId,
    metadata
}: DeductCreditsParams) {
    if (amount < 0) {
        throw new Error("Deduction amount must be positive")
    }
    await connectToDatabase();
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const user = await User.findById(userId).session(session)
        if (!user) {
            throw new Error("User not found")
        }

        if (user.credits < amount) {
            throw new Error("Insufficient credits")
        }

        user.credits -= amount;
        user.creditsUsed = (user.creditsUsed || 0) + amount;
        await user.save({ session })

        await CreditTransaction.create(
            [
                {
                    userId,
                    amount: -amount,
                    reason,
                    referenceType,
                    referenceId,
                    metadata
                },
            ],
            { session }
        );
        await session.commitTransaction();
        console.log(`deducted ${amount} credits from user ${userId} for ${reason}`)
        return { success: true, newBalance: user.credits }
    } catch (error: any) {
        if (session.inTransaction())
            await session.abortTransaction();
        console.log(`credit deduction failed: ${error.message}`)
        return { success: false, error: error.message }
    } finally {
        session.endSession()
    }
}