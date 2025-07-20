import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, contenu } = body;

    if (!email || !contenu) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    await prisma.message_support.create({
      data: { email, contenu },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur enregistrement message support :', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
