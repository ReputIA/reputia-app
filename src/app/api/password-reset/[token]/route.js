import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  try {
    const { password } = await req.json();
    const { token } = params;

    if (!password || !token) {
      return NextResponse.json({ error: 'Mot de passe et token requis' }, { status: 400 });
    }

    // Vérifier si le token est valide et non expiré
    const tokenRecord = await prisma.password_reset_token.findUnique({
      where: { token },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 400 });
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Mettre à jour l'utilisateur avec le nouveau mot de passe
    await prisma.utilisateur.update({
      where: { email: tokenRecord.email },
      data: { password: hashedPassword },
    });

    // Supprimer le token après utilisation
    await prisma.password_reset_token.delete({
      where: { token },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur réinitialisation mot de passe :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
