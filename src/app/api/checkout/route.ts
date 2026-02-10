import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    // ✅ Tohle NESMÍ shodit build – jen vrátí chybu při runtime volání /api/checkout
    if (!secretKey) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY (not available in this environment)." },
        { status: 500 }
      );
    }
    if (!priceId) {
      return NextResponse.json(
        { error: "Missing STRIPE_PRICE_ID." },
        { status: 500 }
      );
    }
    if (!appUrl) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_APP_URL." },
        { status: 500 }
      );
    }

    // ✅ Stripe klient vytvoříme až tady (uvnitř POST)
    const stripe = new Stripe(secretKey, { apiVersion: "2024-04-10" });

    // Tady si můžeš posílat třeba uid/email z frontendu (teď necháme simple)
    const body = await req.json().catch(() => ({}));
    const uid = body?.uid ?? null;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?checkout=success`,
      cancel_url: `${appUrl}/paywall?checkout=cancel`,
      // volitelné:
      client_reference_id: uid ?? undefined,
      // customer_email: body?.email ?? undefined,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("CHECKOUT ERROR:", err?.message || err);
    return NextResponse.json(
      { error: err?.message || "Checkout failed" },
      { status: 500 }
    );
  }
}
