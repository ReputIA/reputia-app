import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
});

const prisma = new PrismaClient();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// ✅ Fonction pour activer l’abonnement
async function activateAbonnement(email: string, source: string) {
  try {
    const updated = await prisma.utilisateur.updateMany({
      where: { email: email.toLowerCase() },
      data: { abonnement: true },
    });
    console.log(`✅ [${source}] Abonnement activé pour ${email}`, updated);
  } catch (error) {
    console.error(`❌ [${source}] Erreur activation :`, error);
  }
}

// ❌ Fonction pour désactiver l’abonnement
async function desactiverAbonnement(email: string, source: string) {
  try {
    const updated = await prisma.utilisateur.updateMany({
      where: { email: email.toLowerCase() },
      data: { abonnement: false },
    });
    console.log(`❌ [${source}] Abonnement désactivé pour ${email}`, updated);
  } catch (error) {
    console.error(`❌ [${source}] Erreur désactivation :`, error);
  }
}

// 🎯 Récupération email via ID client Stripe
async function getEmailFromCustomer(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return typeof customer === 'object' && 'email' in customer ? customer.email ?? null : null;
  } catch (err) {
    console.error(`❌ Erreur récupération email client ${customerId} :`, err);
    return null;
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!signature) {
      return new NextResponse("❌ Signature manquante", { status: 400 });
    }

    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    return new NextResponse(`❌ Erreur webhook : ${message}`, { status: 400 });
  }

  const logPrefix = `🔔 [${event.type}]`;

  // ✅ Paiement validé via Checkout
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email =
      session.customer_email ||
      (session.customer_details && session.customer_details.email) ||
      null;

    if (email) {
      await activateAbonnement(email, "checkout.session.completed");
    } else {
      console.warn(`${logPrefix} ⚠️ Aucun email trouvé dans la session Stripe`);
    }
  }

  // ✅ Abonnement créé ou mis à jour (trial ou actif)
  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer;

    if (subscription.status === "trialing" || subscription.status === "active") {
      const email = await getEmailFromCustomer(customerId as string);
      if (email) {
        await activateAbonnement(email, event.type);
      }
    }
  }

  // ✅ Paiement validé (recurrent)
  if (event.type === "invoice.paid" || event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer;
    const email = await getEmailFromCustomer(customerId as string);
    if (email) {
      await activateAbonnement(email, event.type);
    }
  }

  // ❌ Abonnement annulé (résiliation)
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer;
    const email = await getEmailFromCustomer(customerId as string);
    if (email) {
      await desactiverAbonnement(email, event.type);
    } else {
      console.warn(`${logPrefix} ⚠️ Email introuvable pour désactivation`);
    }
  }

  return new NextResponse("✅ Webhook traité avec succès", { status: 200 });
}
