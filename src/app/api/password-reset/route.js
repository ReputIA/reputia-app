import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe
    const user = await prisma.utilisateur.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Générer un token sécurisé
    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    // Enregistrer le token en base de données
    await prisma.password_reset_token.create({
      data: {
        token,
        email,
        expiresAt: expiration,
      },
    });

    // Créer le lien de réinitialisation
    const resetLink = `${process.env.NEXT_PUBLIC_URL}/password-reset/${token}`;

    // Configuration du transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true', // true pour 465, false pour les autres
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Envoyer l'e-mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🔐 Réinitialisation de mot de passe - ReputIA',
      text: `Cliquez sur le lien suivant pour réinitialiser votre mot de passe : ${resetLink}`,
      html: `
        <p>Bonjour,</p>
        <p>Cliquez sur le lien suivant pour réinitialiser votre mot de passe :</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Ce lien expirera dans 1 heure.</p>
        <p>Cordialement,<br>L'équipe ReputIA</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur envoi email :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
