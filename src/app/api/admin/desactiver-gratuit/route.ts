import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user?.email !== 'support@reputia.fr') {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
  }

  const body = await req.json()
  const { id } = body

  try {
    await prisma.utilisateur.update({
      where: { id },
      data: { abonnement: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('🔥 ERREUR PRISMA', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
