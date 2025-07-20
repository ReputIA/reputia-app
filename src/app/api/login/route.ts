import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Champs requis' }, { status: 400 });
  }

  const user = await prisma.utilisateur.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 401 });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.prenom || user.nom || user.entreprise || '',
    email: user.email,
  });
}
