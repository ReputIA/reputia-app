import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey || !webhookSecret) {
  console.error("❌ Clés Stripe manquantes pour le webhook.");
}

const stripe = new Stripe(stripeSecretKey as string);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig || !webhookSecret) {
    console.error("❌ Signature Stripe ou secret manquant.");
    return new NextResponse("Bad Request", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

    try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("❌ Erreur vérification webhook Stripe :", err.message);
      return new NextResponse(`Webhook error: ${err.message}`, { status: 400 });
    }

    console.error("❌ Erreur vérification webhook Stripe (inconnue) :", err);
    return new NextResponse("Webhook error: unknown error", { status: 400 });
  }


  try {
    // ✅ Quand un paiement d'abonnement est terminé
    if (event.type === "checkout.session.completed") {
      const sessionObj = event.data.object as Stripe.Checkout.Session;

      const customerEmail =
        (sessionObj.customer_details?.email ||
          (sessionObj.customer_email as string | null) ||
          null)?.toLowerCase() || null;

      const customerId = typeof sessionObj.customer === "string"
        ? sessionObj.customer
        : null;

      if (!customerEmail) {
        console.warn("⚠️ Session Stripe complétée sans email client.");
      } else {
        await prisma.utilisateur.updateMany({
          where: { email: customerEmail },
          data: {
            abonnement: true,
            stripeCustomerId: customerId || undefined,
          },
        });

        console.log(`✅ Abonnement activé pour ${customerEmail} (customer=${customerId})`);
      }
    }

    // ❌ Quand l'abonnement est résilié côté Stripe
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = typeof subscription.customer === "string"
        ? subscription.customer
        : null;

      if (customerId) {
        await prisma.utilisateur.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            abonnement: false,
          },
        });

        console.log(`🛑 Abonnement résilié pour customer=${customerId}`);
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("❌ Erreur traitement webhook :", error);
    return new NextResponse("Erreur serveur webhook", { status: 500 });
  }
}

export const dynamic = "force-dynamic";
