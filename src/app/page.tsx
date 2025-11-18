'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="bg-[#1a1a1a] text-white font-sans min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-6 pt-6 flex items-center justify-between">
        {/* Logo + nom */}
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14">
            <Image
              src="/images/logo-reputia.png"
              alt="Logo ReputIA"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-xl font-semibold tracking-wide">
            Reput<span className="text-[#FFD700]">IA</span>
          </span>
        </div>

        {/* Boutons connexion */}
        <div className="flex gap-3 items-center">
          {status === 'authenticated' ? (
            <>
              <span className="text-sm text-gray-300">
                👋 {session?.user?.name || 'Utilisateur'}
              </span>
              <Link
                href="/profil"
                className="bg-[#FFD700] text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-yellow-400 transition"
              >
                Mon compte
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/connexion"
                className="bg-[#FFD700] text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-yellow-400 transition"
              >
                Se connecter
              </Link>
              <Link
                href="/inscription"
                className="bg-white text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
              >
                Créer un compte
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Contenu principal */}
      <main className="px-6 pt-10 pb-32">
        {/* Accroche centrale */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[#FFD700]">
            Suite d’outils IA pour les professionnels
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            ReputIA, société française indépendante, développe des outils IA fiables et accessibles
            pour aider les professionnels à optimiser leur image et leurs tâches essentielles.
          </p>
        </div>

        {/* Cartes d’outils */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Carte Avis Google */}
          <Link
            href="/avis"
            className="group bg-[#2a2a2a] rounded-3xl p-8 shadow-xl border border-transparent 
                       hover:border-[#FFD700] hover:-translate-y-1 transition transform 
                       cursor-pointer flex flex-col justify-between no-underline text-white"
          >
            <div>
              {/* Bandeau essai gratuit */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700] text-black text-xs font-semibold">
                  ⭐ Essai gratuit – Cliquez ici pour tester
                </span>
              </div>

              <h2 className="text-2xl font-bold mb-3 text-[#FFD700] flex items-center gap-2">
                📝 Générateur de réponses aux avis
              </h2>
              <p className="text-gray-300 mb-4">
                Collez un avis Google, Airbnb, Booking, Trustpilot… et obtenez une réponse
                professionnelle, humaine et rassurante en quelques secondes.
              </p>
              <ul className="text-sm text-gray-400 space-y-1 mb-6">
                <li>• Gagnez du temps sur la gestion de vos avis</li>
                <li>• Renforcez votre image auprès de vos clients</li>
                <li>• Idéal pour restaurants, garages, salons, commerces locaux…</li>
              </ul>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  1er essai gratuit, puis illimité pour 9,99€ / mois
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Outil disponible</span>
                <span className="inline-flex items-center gap-2 bg-[#FFD700] text-black px-4 py-2 rounded-xl text-sm font-semibold group-hover:bg-yellow-400 transition">
                  Essayer gratuitement →
                </span>
              </div>
            </div>
          </Link>

          {/* Carte ScanSecure (bientôt) */}
          <div className="bg-[#202020] rounded-3xl p-8 shadow-xl border border-dashed border-gray-600 flex flex-col justify-between opacity-85">
            <div>
              <h2 className="text-2xl font-bold mb-3 text-[#66d9ff] flex items-center gap-2">
                🛡️ ScanSecure
              </h2>
              <p className="text-gray-300 mb-4">
                Analyse automatique de votre site web pour détecter les failles les plus courantes
                et générer un rapport clair, exploitable par vous ou votre agence.
              </p>
              <ul className="text-sm text-gray-400 space-y-1 mb-6">
                <li>• Détection des vulnérabilités principales</li>
                <li>• Priorisation des risques</li>
                <li>• Pensé pour freelances, agences et PME</li>
              </ul>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                En cours de développement
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-gray-700 text-gray-300">
                Prochainement sur Reput
                <span className="text-[#FFD700]">IA</span>
              </span>
            </div>
          </div>

          {/* Carte Description produit (bientôt) */}
          <div className="bg-[#202020] rounded-3xl p-8 shadow-xl border border-dashed border-gray-600 flex flex-col justify-between opacity-85">
            <div>
              <h2 className="text-2xl font-bold mb-3 text-[#a86bff] flex items-center gap-2">
                🛒 Descriptions produits
              </h2>
              <p className="text-gray-300 mb-4">
                Collez la photo d’un produit et indiquez son utilisation. ReputIA vous génèrera
                une description optimisée pour la vente en ligne (marketplaces, e-commerce, etc.).
              </p>
              <ul className="text-sm text-gray-400 space-y-1 mb-6">
                <li>• Textes clairs et accrocheurs</li>
                <li>• Pensé pour Vinted, Leboncoin, Shopify, etc.</li>
                <li>• Idéal pour booster vos annonces</li>
              </ul>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                En cours de développement
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-gray-700 text-gray-300">
                Prochainement sur Reput
                <span className="text-[#FFD700]">IA</span>
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#111] text-gray-400 text-sm py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          <div>
            <h3 className="text-white font-bold mb-2">📧 Contact</h3>
            <p>support@reputia.fr</p>
            <a
              href="https://wa.me/message/LMFWWC3XW7GEK1"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-2 text-green-400 hover:text-green-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967s-.47-.149-.668.149-.767.967-.94 1.168-.347.223-.644.075c-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.1-.198.05-.372-.025-.521s-.668-1.611-.916-2.214c-.242-.58-.487-.5-.668-.51l-.571-.01c-.198 0-.52.075-.793.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.412.248-.694.248-1.29.173-1.412-.074-.123-.272-.198-.57-.347z" />
                <path d="M12.003 2.002C6.478 2.002 2 6.48 2 12.005c0 1.999.522 3.881 1.515 5.558L2 22l4.583-1.487a9.967 9.967 0 0 0 5.42 1.489c5.523 0 10.002-4.478 10.002-10.002S17.526 2.002 12.003 2.002zm0 18.202c-1.636 0-3.237-.445-4.627-1.288l-.331-.197-2.72.883.897-2.648-.217-.342A8.198 8.198 0 0 1 3.803 12c0-4.526 3.674-8.2 8.2-8.2s8.2 3.674 8.2 8.2-3.674 8.204-8.2 8.204z" />
              </svg>
              Écrire sur WhatsApp
            </a>
          </div>

          <div>
            <h3 className="text-white font-bold mb-2">🔗 Liens utiles</h3>
            <ul className="space-y-1">
              <li><a href="/mentions-legales" className="hover:text-white">Mentions légales</a></li>
              <li><a href="/conditions-utilisation" className="hover:text-white">Conditions d’utilisation</a></li>
              <li><a href="/confidentialite" className="hover:text-white">Politique de confidentialité</a></li>
              <li><a href="/faq" className="hover:text-white">FAQ</a></li>
              <li><a href="/blog" className="hover:text-white">Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-2">📱 Réseaux sociaux</h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="https://instagram.com/reputia_a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-2">🏢 ReputIA</h3>
            <p>Entreprise basée en France 🇫🇷</p>
            <p>© 2025 ReputIA</p>
          </div>
        </div>

        {/* Bouton flottant WhatsApp */}
        <a
          href="https://wa.me/message/LMFWWC3XW7GEK1"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-4 z-50 transition transform hover:scale-105"
          aria-label="Contactez-nous sur WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-6 h-6"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967s-.47-.149-.668.149-.767.967-.94 1.168-.347.223-.644.075c-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.1-.198.05-.372-.025-.521s-.668-1.611-.916-2.214c-.242-.58-.487-.5-.668-.51l-.571-.01c-.198 0-.52.075-.793.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.412.248-.694.248-1.29.173-1.412-.074-.123-.272-.198-.57-.347z" />
            <path d="M12.003 2.002C6.478 2.002 2 6.48 2 12.005c0 1.999.522 3.881 1.515 5.558L2 22l4.583-1.487a9.967 9.967 0 0 0 5.42 1.489c5.523 0 10.002-4.478 10.002-10.002S17.526 2.002 12.003 2.002zm0 18.202c-1.636 0-3.237-.445-4.627-1.288l-.331-.197-2.72.883.897-2.648-.217-.342A8.198 8.198 0 0 1 3.803 12c0-4.526 3.674-8.2 8.2-8.2s8.2 3.674 8.2 8.2-3.674 8.204-8.2 8.204z" />
          </svg>
        </a>
      </footer>
    </div>
  );
}
