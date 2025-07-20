import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const messages = await prisma.message_support.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(messages);
  } catch (err) {
    console.error('❌ Erreur récupération messages :', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
