import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email manquant' }, { status: 400 });
    }

    const dernierMessage = await prisma.message_support.findFirst({
      where: {
        email,
        NOT: { reponse: null }, // ou `reponse` selon ton champ réel
      },
      orderBy: { createdAt: 'desc' },
    });

    // Toujours renvoyer un objet JSON, même s’il est vide
    return NextResponse.json({
      message: dernierMessage
        ? {
            contenu: dernierMessage.contenu,
            reponse: dernierMessage.reponse, // ou `reponse`
          }
        : null,
    });
  } catch (error) {
    console.error('❌ Erreur API support/reponse :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
