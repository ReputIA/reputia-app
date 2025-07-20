import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const utilisateurs = await prisma.utilisateur.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(utilisateurs);
  } catch (error) {
    console.error('❌ Erreur récupération utilisateurs :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
