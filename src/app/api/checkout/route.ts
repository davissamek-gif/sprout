// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function baseUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url) throw new Error("NEXT_PUBLIC_APP_URL missing");
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export async function POST() {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;

    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY missing");
    }

    if (!priceId) {
      throw new Error("STRIPE_PRICE_ID missing");
    }

    // ⚠️ ABSOLUTNĚ KRITICKÉ:
    // API version MUSÍ odpovídat tomu, co Stripe SDK očekává
    const stripe = new Stripe(secretKey, {
      apiVersion: "2026-01-28.clover",
    });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 3,
      },
      success_url: `${baseUrl()}/dashboard?checkout=success`,
      cancel_url: `${baseUrl()}/paywall?checkout=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("CHECKOUT ERROR:", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
