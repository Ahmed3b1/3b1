import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { packageId } = await request.json();
    let priceData: any;
    let credits = 0;

    switch (packageId) {
      case "starter":
        credits = 50;
        priceData = {
          currency: "usd",
          product_data: {
            name: "Starter Pack - 50 Credits",
            description: "50 AI Automation Credits",
          },
          unit_amount: 1000,
        };
        break;

      case "pro":
        credits = 100;
        priceData = {
          currency: "usd",
          product_data: {
            name: "Pro Plan - 100 Credits",
            description: "100 AI Automation Credits",
          },
          unit_amount: 2000, // $20.00
        };
        break;

      case "enterprise":
        credits = 1000;
        priceData = {
          currency: "usd",
          product_data: {
            name: "Enterprise Plan - 1000 Credits",
            description: "1000 AI Automation Credits",
          },
          unit_amount: 10000, // $100.00
        };
        break;

      default:
        return NextResponse.json(
          { error: "Invalid package" },
          { status: 400 }
        );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: priceData,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
      metadata: {
        userId: session.user.id || "",
        creditsAmount: credits.toString(),
        packageId: packageId,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}