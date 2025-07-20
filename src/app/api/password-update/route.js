import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    const resetToken = await prisma.password_reset_token.findUnique({ where: { token } });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token invalide ou expiré' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.utilisateur.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    });

    await prisma.password_reset_token.delete({ where: { token } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur mise à jour mot de passe :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
