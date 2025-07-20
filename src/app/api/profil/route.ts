import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const user = await prisma.utilisateur.findUnique({ where: { email } });

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await req.json();

  const updated = await prisma.utilisateur.update({
    where: { email },
    data: {
      nom: body.nom,
      prenom: body.prenom,
      entreprise: body.entreprise,
      siret: body.siret,
      adresse: body.adresse,
      codePostal: body.codePostal,
      ville: body.ville,
    },
  });

  return NextResponse.json(updated);
}
