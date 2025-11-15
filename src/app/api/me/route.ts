import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const email = session.user.email.toLowerCase();

  const user = await prisma.utilisateur.findUnique({
    where: { email },
    select: {
      email: true,
      prenom: true,
      nom: true,
      entreprise: true,
      siret: true,
      adresse: true,
      codePostal: true,
      ville: true,
      telephone: true,
      abonnement: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const email = session.user.email.toLowerCase();
  const body = await req.json();

  const {
    prenom,
    nom,
    entreprise,
    siret,
    adresse,
    codePostal,
    ville,
    telephone,
  } = body;

  if (!prenom || !nom || !entreprise || !adresse || !codePostal || !ville || !telephone) {
    return NextResponse.json(
      { error: "Merci de remplir tous les champs obligatoires." },
      { status: 400 }
    );
  }

  const user = await prisma.utilisateur.update({
    where: { email },
    data: {
      prenom,
      nom,
      entreprise,
      siret: siret || null,
      adresse,
      codePostal,
      ville,
      telephone,
      // ⚠️ On ne touche PAS à "abonnement" ici :
      // ça sera géré uniquement via Stripe plus tard.
    },
    select: {
      email: true,
      prenom: true,
      nom: true,
      entreprise: true,
      siret: true,
      adresse: true,
      codePostal: true,
      ville: true,
      telephone: true,
      abonnement: true,
    },
  });

  return NextResponse.json(user);
}
