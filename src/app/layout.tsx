'use client';

import './globals.css';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Analytics } from '@vercel/analytics/react'; // 👈 Ajout ici

function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="bg-[#1a1a1a] text-white px-6 py-4 flex justify-between items-center shadow-md">
      {!isHomePage && (
        <Link href="/" className="block h-16 w-auto relative">
          <Image
            src="/images/logo-reputia.png"
            alt="ReputIA"
            width={128}
            height={64}
            priority
          />
        </Link>
      )}
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
        <title>ReputIA – Automatisez vos réponses aux avis</title>
        <meta
          name="description"
          content="ReputIA répond automatiquement à vos avis en ligne. Gagnez du temps, soignez votre image."
        />
      </head>
      <body className="bg-[#1a1a1a] text-white">
        <SessionProvider>
          <Header />
          <main>{children}</main>
        </SessionProvider>
        <Analytics /> {/* 👈 Intégré ici */}
      </body>
    </html>
  );
}
