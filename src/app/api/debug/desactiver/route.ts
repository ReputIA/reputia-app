import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const email = "ruizanth31600@gmail.com";
  await prisma.utilisateur.updateMany({
    where: { email: email.toLowerCase() },
    data: { abonnement: false },
  });
  return NextResponse.json({ message: "Abonnement désactivé manuellement." });
}
