import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Stripe from "stripe";
import Transaction from "@/models/Transaction";

export async function POST(request: Request) {
  const body = await request.arrayBuffer();
  const signature = (await headers()).get("Stripe-Signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(body),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log(`Webhook verified : ${event.type}`);
  } catch (err: any) {
    return NextResponse.json({ err: `Webhook Error: ${err.message}` });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const creditsAmount = parseInt(session.metadata?.creditsAmount || "0");
    const packageId = session.metadata?.packageId;

    console.log(`Processing Checkout Session: ${session.id}`);

    if (userId && creditsAmount > 0) {
      await connectToDatabase();

      const existingTransaction = await Transaction.findOne({
        stripeSessionId: session.id,
      });
      if (existingTransaction) {
        console.log(
          `Transaction ${session.id} already processed. Skipping.`
        );
        return NextResponse.json({
          received: true,
          message: "Already processed",
        });
      }

      console.log(`Incrementing credits for user ${userId}...`);
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $inc: { credits: creditsAmount },
          $set: {
            plan: packageId === "enterprise" ? "enterprise" : "pro",
          },
        },
        { new: true }
      );

      if (!updatedUser) {
        console.error(
          `User ${userId} not found during webhook processing`
        );
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      console.log(
        `Credits added: ${creditsAmount}. New balance: ${updatedUser.credits}`
      );

      await Transaction.create({
        userId,
        stripeSessionId: session.id,
        amount: session.amount_total,
        currency: session.currency,
        creditsGranted: creditsAmount,
        status: "completed",
        metadata: session.metadata,
      });
      console.log(`Transaction stored: ${session.id}`);
    } else {
      console.warn("Missing userId or creditsAmount in session metadata");
    }
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}