import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const appUrlEnv = process.env.NEXT_PUBLIC_APP_URL;
const appUrl = appUrlEnv ? appUrlEnv.trim() : null;

const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Utilisateur non authentifié" },
      { status: 401 }
    );
  }

  if (!stripe || !appUrl) {
    console.error("❌ Stripe ou appUrl non configurés pour le portail :", {
      hasStripe: !!stripe,
      hasAppUrl: !!appUrl,
    });

    return NextResponse.json(
      { error: "Configuration Stripe incomplète pour le portail client." },
      { status: 500 }
    );
  }

  const email = session.user.email.toLowerCase();

  const user = await prisma.utilisateur.findUnique({
    where: { email },
  });

  if (!user || !("stripeCustomerId" in user) || !user.stripeCustomerId) {
    // IMPORTANT : ici, il faut que ton modèle Prisma utilisateur
    // ait bien un champ : stripeCustomerId String?
    return NextResponse.json(
      { error: "Aucun abonnement Stripe lié à ce compte." },
      { status: 400 }
    );
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/profil`,
    });

    if (!portalSession.url) {
      return NextResponse.json(
        { error: "Impossible de créer le portail client Stripe." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: portalSession.url });
  } catch (error: unknown) {
    console.error("❌ Erreur création portail Stripe :", error);

    let message = "Erreur lors de la création du portail client.";

    if (typeof error === "object" && error !== null && "message" in error) {
      const e = error as { message?: unknown };
      message = String(e.message ?? message);
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
