'use client';

import './globals.css';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Analytics } from '@vercel/analytics/react';

function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="bg-[#1a1a1a] text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Logo + ReputIA à gauche, sur toutes les pages sauf la Home */}
      {!isHomePage && (
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <Image
              src="/images/logo-reputia.png"
              alt="ReputIA"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-semibold tracking-wide">
            Reput<span className="text-[#FFD700]">IA</span>
          </span>
        </Link>
      )}

      {/* Zone compte à droite si connecté */}
      {status === 'authenticated' && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">{session.user?.email}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-[#FFD700] text-black px-3 py-2 rounded-md text-sm hover:bg-yellow-400 transition"
          >
            Déconnexion
          </button>
        </div>
      )}
    </header>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <title>ReputIA – Outils IA pour les professionnels</title>
        <meta
          name="description"
          content="ReputIA est une société française qui développe des outils IA simples et puissants pour les professionnels : réponses aux avis, audits cybersécurité, descriptions produits et autres services."
        />
      </head>
      <body className="bg-[#1a1a1a] text-white">
        <SessionProvider>
          <Header />
          <main>{children}</main>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}