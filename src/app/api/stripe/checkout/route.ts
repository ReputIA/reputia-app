import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const priceAbo = process.env.STRIPE_PRICE_ABO;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

if (!stripeSecretKey || !priceAbo || !appUrl) {
  console.error("❌ Variables d'environnement Stripe manquantes.");
}

const stripe = new Stripe(stripeSecretKey as string);

export async function POST(_req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Non authentifié" },
      { status: 401 }
    );
  }

  if (!stripeSecretKey || !priceAbo || !appUrl) {
    return NextResponse.json(
      { error: "Configuration Stripe incomplète" },
      { status: 500 }
    );
  }

  const email = session.user.email.toLowerCase();

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      // 🟡 On se contente de l'email, Stripe créera un customer
      customer_email: email,
      line_items: [
        {
          price: priceAbo,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/avis?payment=success`,
      cancel_url: `${appUrl}/avis?payment=cancel`,
      metadata: {
        appUserEmail: email,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("❌ Erreur création session Stripe :", error);
    return NextResponse.json(
      { error: "Erreur côté serveur Stripe" },
      { status: 500 }
    );
  }
}
