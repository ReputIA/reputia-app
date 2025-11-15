import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

if (!stripeSecretKey || !appUrl) {
  console.error("❌ Variables Stripe manquantes pour le portail.");
}

const stripe = new Stripe(stripeSecretKey as string);

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const email = session.user.email.toLowerCase();

  const user = await prisma.utilisateur.findUnique({
    where: { email },
  });

  if (!user || !user.stripeCustomerId) {
    return NextResponse.json(
      { error: "Aucun abonnement Stripe lié à ce compte." },
      { status: 400 }
    );
  }

  if (!stripeSecretKey || !appUrl) {
    return NextResponse.json(
      { error: "Configuration Stripe incomplète." },
      { status: 500 }
    );
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/profil`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("❌ Erreur création portail Stripe :", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du portail client." },
      { status: 500 }
    );
  }
}
