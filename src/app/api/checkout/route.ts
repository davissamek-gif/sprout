// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutBody = {
  email?: string;
  uid?: string;
};

function getBaseUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url) return "";
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as CheckoutBody;

    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_PRICE_ID;
    const baseUrl = getBaseUrl();

    // Tyhle 3 musí být nastavené v App Hosting "Secrets/Environment"
    if (!secretKey) {
      return NextResponse.json(
        {
          error:
            "Missing STRIPE_SECRET_KEY. Add it in Firebase App Hosting environment/secrets (prod).",
        },
        { status: 500 }
      );
    }

    if (!priceId) {
      return NextResponse.json(
        {
          error:
            "Missing STRIPE_PRICE_ID. Add it in Firebase App Hosting environment/secrets (prod).",
        },
        { status: 500 }
      );
    }

    if (!baseUrl) {
      return NextResponse.json(
        {
          error:
            "Missing NEXT_PUBLIC_APP_URL. Add it in Firebase App Hosting environment/secrets (prod).",
        },
        { status: 500 }
      );
    }

    // IMPORTANT: Stripe instance až uvnitř handleru (ne při importu) -> build nespadne
    const stripe = new Stripe(secretKey);

    // URL po úspěchu / zrušení
    const successUrl = `${baseUrl}/dashboard?checkout=success`;
    const cancelUrl = `${baseUrl}/paywall?checkout=cancel`;

    // Tady vytváříme subscription checkout
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],

      // 3 dny free trial (Stripe trial period)
      subscription_data: {
        trial_period_days: 3,
        metadata: {
          uid: body.uid ?? "",
        },
      },

      // Pomůže ti to později propojit uživatele
      client_reference_id: body.uid ?? undefined,

      // když pošleš email, předvyplní se v Checkoutu
      customer_email: body.email ?? undefined,

      success_url: successUrl,
      cancel_url: cancelUrl,

      // volitelné (můžeš kdykoliv upravit)
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("CHECKOUT ERROR:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
