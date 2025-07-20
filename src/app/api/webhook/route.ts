import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
});

const prisma = new PrismaClient();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!signature) {
      console.error("Signature manquante.");
      return new NextResponse("Signature manquante", { status: 400 });
    }

    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error("Erreur webhook :", message);
    return new NextResponse(`Erreur webhook : ${message}`, { status: 400 });
  }

  // 🎯 Cas : paiement réussi via checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email;

    if (email) {
      try {
        const updated = await prisma.utilisateur.updateMany({
          where: { email },
          data: { abonnement: true },
        });

        console.log(`✅ Abonnement activé pour ${email}`, updated);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        console.error("Erreur lors de la mise à jour de l’abonnement :", message);
      }
    } else {
      console.warn("⚠️ Aucun email trouvé dans la session Stripe");
    }
  }

  return new NextResponse("✅ Webhook traité avec succès", { status: 200 });
}
