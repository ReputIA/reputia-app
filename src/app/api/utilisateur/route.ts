import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      password,
      nom,
      prenom,
      entreprise,
      siret,
      adresse,
      codePostal,
      ville,
    } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email ou mot de passe manquant' }, { status: 400 });
    }

    const existing = await prisma.utilisateur.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const utilisateur = await prisma.utilisateur.create({
      data: {
        email,
        password: hashedPassword,
        nom,
        prenom,
        entreprise,
        siret: siret || null,
        adresse,
        codePostal,
        ville,
      },
    });

    return NextResponse.json({ success: true, utilisateur });
  } catch (error) {
    console.error('❌ Erreur API utilisateur :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
