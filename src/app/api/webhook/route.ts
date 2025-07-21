import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10' as Stripe.LatestApiVersion,
});

const prisma = new PrismaClient();
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// ✅ Activer abonnement
async function activateAbonnement(email: string, source: string) {
  try {
    const updated = await prisma.utilisateur.updateMany({
      where: { email: email.toLowerCase() },
      data: { abonnement: true },
    });
    console.log(`✅ [${source}] Abonnement ACTIVÉ pour ${email}`, updated);
  } catch (error) {
    console.error(`❌ [${source}] Erreur activation abonnement :`, error);
  }
}

// ❌ Désactiver abonnement
async function desactiverAbonnement(email: string, source: string) {
  try {
    const updated = await prisma.utilisateur.updateMany({
      where: { email: email.toLowerCase() },
      data: { abonnement: false },
    });
    console.log(`❌ [${source}] Abonnement DÉSACTIVÉ pour ${email}`, updated);
  } catch (error) {
    console.error(`❌ [${source}] Erreur désactivation abonnement :`, error);
  }
}

// 🔍 Récupérer email à partir de l'ID client Stripe
async function getEmailFromCustomer(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    const email = typeof customer === 'object' && 'email' in customer ? customer.email ?? null : null;
    console.log(`📧 Email récupéré depuis Stripe (customerId=${customerId}):`, email);
    return email;
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
  console.log(`${logPrefix} Reçu`);

  // ✅ Paiement validé
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

  // ✅ Abonnement créé ou mis à jour
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

  // ✅ Paiement récurrent
  if (event.type === "invoice.paid" || event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    const customerId = invoice.customer;
    const email = await getEmailFromCustomer(customerId as string);
    if (email) {
      await activateAbonnement(email, event.type);
    }
  }

  // ❌ Abonnement annulé
  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer;

    console.log(`🔔 [customer.subscription.deleted] ID client : ${customerId}`);

    const email = await getEmailFromCustomer(customerId as string);
    if (email) {
      console.log(`🛑 Désactivation de l’abonnement pour ${email}`);
      await desactiverAbonnement(email, event.type);
    } else {
      console.warn(`${logPrefix} ⚠️ Email introuvable pour désactivation`);
    }
  }

  return new NextResponse("✅ Webhook traité avec succès", { status: 200 });
}
