import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const priceAbo = process.env.STRIPE_PRICE_ABO;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

// Petit log serveur au cas où une var manque
if (!stripeSecretKey || !priceAbo || !appUrl) {
  console.error("❌ Configuration Stripe incomplète côté serveur :", {
    hasSecret: !!stripeSecretKey,
    hasPrice: !!priceAbo,
    hasAppUrl: !!appUrl,
  });
}

// On laisse Stripe choisir sa propre apiVersion (on ne force plus)
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Utilisateur non authentifié" },
      { status: 401 }
    );
  }

  if (!stripe || !priceAbo || !appUrl) {
    return NextResponse.json(
      { error: "Configuration Stripe incomplète" },
      { status: 500 }
    );
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceAbo,
          quantity: 1,
        },
      ],
      customer_email: session.user.email.toLowerCase(),
      success_url: `${appUrl}/avis?success=1`,
      cancel_url: `${appUrl}/avis?canceled=1`,
    });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Impossible de créer la session de paiement." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: unknown) {
    console.error("❌ Erreur création session Stripe :", error);

    let message = "Erreur côté serveur Stripe";

    if (typeof error === "object" && error !== null && "message" in error) {
      const e = error as { message?: unknown };
      message = String(e.message ?? "Erreur côté serveur Stripe");
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
