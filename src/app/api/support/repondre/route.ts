import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, reponse } = body;

    if (!id || !reponse) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    await prisma.message_support.update({
      where: { id },
      data: { reponse },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('❌ Erreur mise à jour message support :', err);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
