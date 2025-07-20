import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ abonnement: false });
  }

  const user = await prisma.utilisateur.findUnique({
    where: { email: session.user.email },
  });

  return NextResponse.json({ abonnement: user?.abonnement ?? false });
}
