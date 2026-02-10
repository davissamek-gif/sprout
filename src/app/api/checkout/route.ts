import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "czk",
            product_data: {
              name: "Sprout 🌱 — měsíční předplatné",
              description:
                "Plný přístup ke Sprout: plánování, deník, mapy a statistiky.",
            },
            unit_amount: 6900, // 69 Kč
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],

      success_url: "http://localhost:3000/dashboard",
      cancel_url: "http://localhost:3000/paywall",
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("STRIPE CHECKOUT ERROR:", error);
    return NextResponse.json(
      { error: "Stripe checkout failed" },
      { status: 500 }
    );
  }
}
