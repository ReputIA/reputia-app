'use client';

import React from 'react';
import Link from 'next/link';

export default function Abonnement() {
  // À remplacer par un check dynamique plus tard
  const abonnementActif = false;

  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen px-4 py-12 flex flex-col items-center">
      <div className="w-full max-w-xl bg-[#2a2a2a] p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-[#FFD700] mb-6">💳 Mon abonnement</h1>

        <p className="text-center text-gray-300 mb-6">
          Abonnement ReputIA : <strong>24€ TTC / mois</strong><br />
          Accès illimité au générateur de réponses aux avis.
        </p>

        {abonnementActif ? (
          <div className="text-center space-y-4">
            <p className="text-green-400 font-semibold">🟢 Abonnement actif</p>
            <button
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
              onClick={() => alert('🔧 Résiliation à intégrer via Stripe Portal')}
            >
              Résilier l’abonnement
            </button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-yellow-400 font-semibold">⚠️ Aucun abonnement actif</p>
            <a
              href="https://buy.stripe.com/6oU5kDbTcdbD3jJ07IdfG00"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#FFD700] hover:bg-yellow-400 text-black font-semibold py-3 rounded-lg transition text-center"
            >
              🔓 Souscrire à l’abonnement
            </a>
          </div>
        )}

        {/* 🔙 Bouton retour dans la carte */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="text-sm text-[#FFD700] hover:underline"
          >
            ← Retour au Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
