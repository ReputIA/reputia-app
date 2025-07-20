'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <div className="bg-[#1a1a1a] text-white font-sans min-h-screen flex flex-col">
      {/* Contenu principal */}
      <div className="px-6 py-16 text-center pb-32">
        {/* Top right */}
        <div className="absolute top-6 right-6 flex gap-3 items-center">
          {status === 'authenticated' ? (
            <>
              <span className="text-sm text-gray-300">👋 Bienvenue, {session?.user?.name || 'utilisateur'} !</span>
              <Link
                href="/dashboard"
                className="bg-[#FFD700] text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-yellow-400 transition"
              >
                Accéder au dashboard
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

        {/* Logo + accroche */}
        <div className="w-36 mx-auto mb-6">
          <Image
            src="/images/logo-reputia.png"
            alt="Logo ReputIA"
            width={144}
            height={144}
            priority
          />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#FFD700]">
          L’assistant qui gère vos avis Google comme un pro
        </h1>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-gray-300">
          Une fiche Google bien gérée peut vous apporter des dizaines de clients chaque mois. Et ça commence par des avis... bien traités.
          <br /><br />
          ReputIA répond automatiquement à chaque avis reçu, 24h/24, avec un ton humain, professionnel et rassurant. Vous économisez un temps précieux tout en renvoyant une image exemplaire.
        </p>

        {/* Exemples de réponses générées */}
        <h2 className="text-3xl font-bold text-[#FFD700] mb-8 mt-20">
          🤖 Voici des exemples de réponse d’avis Google générées par ReputIA :
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 max-w-6xl mx-auto">
          {["Claire G.", "Marc D.", "Nathalie B.", "Kevin S.", "Laura J.", "Bruno T."].map((nom, i) => {
            const avis = [
              'Une équipe au top, service impeccable et rapide. Je recommande sans hésiter !',
              'Toujours aussi satisfait. Accueil chaleureux et service au rendez-vous.',
              'Très bonne première expérience. Facile, rapide, et super efficace.',
              'Ma commande est arrivée avec 2 jours de retard, un peu déçu.',
              'L’accueil était un peu froid, mais le travail a été bien fait.',
              'Bonne qualité mais attente un peu longue sur place.'
            ];
            const reponses = [
              'Merci beaucoup pour votre recommandation Claire ! C’est un plaisir de vous accompagner. À très bientôt 😊',
              'Un grand merci Marc pour votre fidélité et votre retour positif. À très bientôt dans notre établissement !',
              'Merci Nathalie ! Nous sommes ravis que votre première visite se soit bien passée. Nous restons à votre écoute !',
              'Bonjour Kevin, nous sommes désolés pour ce retard. Nous faisons le nécessaire pour éviter que cela ne se reproduise. Merci pour votre compréhension.',
              'Bonjour Laura, merci pour votre retour. Nous allons sensibiliser notre équipe pour améliorer cet aspect. Heureux que la prestation vous ait plu malgré tout !',
              'Merci Bruno pour votre retour. Nous allons optimiser notre organisation pour mieux gérer l’attente. À bientôt !'
            ];
            const stars = ['⭐️⭐️⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️⭐️', '⭐️⭐️⭐️⭐️⭐️', '⭐️⭐️', '⭐️⭐️⭐️', '⭐️⭐️⭐️'];
            return (
              <div key={i} className="bg-[#2a2a2a] p-6 rounded-2xl shadow text-left">
                <p className="text-sm text-gray-400 mb-1">{stars[i]}</p>
                <p className="text-sm text-yellow-300 mb-2">— {nom}</p>
                <p className="mb-2 text-white">🗣️ <span className="text-gray-300">{avis[i]}</span></p>
                <p className="text-sm text-green-400">💬 ReputIA : {reponses[i]}</p>
              </div>
            );
          })}
        </div>

        {/* Offre + explication */}
        <div className="bg-[#2a2a2a] p-8 rounded-3xl shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row gap-8 text-left md:text-center">
          <div className="flex-1">
            <p className="text-xl font-semibold mb-2">100 premiers seulement : profitez de l’offre à vie avant qu’il ne soit trop tard ! </p>
            <p className="text-4xl font-bold text-[#FFD700] mb-4">20€ HT / mois</p>
            <p className="text-gray-300 mb-6">
              24€ TTC / mois - 1 jour gratuit - Sans engagement – accès immédiat au générateur ReputIA.
            </p>
            <a
              href="/inscription"
              className="inline-block bg-[#FFD700] text-black font-semibold px-6 py-3 rounded-xl hover:bg-yellow-400 transition"
            >
              Souscrire à l’offre
            </a>
            <p className="text-gray-400 text-sm mt-4">
              🤖 ReputIA, c’est votre assistant Google dédié : plus de 10 heures économisées par mois sur la gestion de vos avis.
              <br />
              Concentrez-vous sur votre activité, on s’occupe de votre réputation.
            </p>
          </div>
          <div className="flex-1 text-gray-300 text-sm md:text-base">
            <h3 className="text-xl font-semibold mb-4 text-[#FFD700]">Votre réputation, notre intelligence.</h3>
            <p className="mb-4">
              87% des consommateurs lisent les réponses aux avis avant de choisir un professionnel. Une absence de réponse peut laisser une mauvaise impression, même avec 5 étoiles.
              <br /><br />
              ReputIA vous permet d’automatiser intelligemment ces réponses, sans perdre en qualité humaine. C’est l’outil parfait pour renforcer votre crédibilité, votre référencement local, et la confiance de vos futurs clients.
            </p>
            <a
              href="/inscription"
              className="inline-block bg-[#FFD700] text-black font-semibold px-5 py-2 rounded-xl hover:bg-yellow-400 transition"
            >
              Essai gratuit 24h
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#111] text-gray-400 text-sm py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          <div>
            <h3 className="text-white font-bold mb-2">📧 Contact</h3>
            <p>support@reputia.fr</p>
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
                <a href="https://instagram.com/reputia_a" target="_blank" rel="noopener noreferrer" className="hover:text-white">
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
      </footer>
    </div>
  );
}
