'use client';

import React from 'react';

export default function FAQ() {
  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen px-6 py-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#FFD700] mb-10 text-center">❓ Foire Aux Questions</h1>

        <div className="space-y-8 text-sm md:text-base">
          <div>
            <h2 className="text-[#FFD700] font-semibold mb-2">📌 ReputIA répond-il seulement aux avis Google ?</h2>
            <p>
              Non ! Notre IA est conçue pour répondre à tous types d&apos;avis clients, quelle que soit la plateforme (Google, Facebook, Trustpilot, PagesJaunes, etc.).
            </p>
          </div>

          <div>
            <h2 className="text-[#FFD700] font-semibold mb-2">🧠 Comment fonctionne l’IA de ReputIA ?</h2>
            <p>
              Nous utilisons l’intelligence artificielle pour générer des réponses personnalisées, humaines et professionnelles en quelques secondes.
            </p>
          </div>

          <div>
            <h2 className="text-[#FFD700] font-semibold mb-2">💬 Est-ce que je peux modifier la réponse générée ?</h2>
            <p>
              Bien sûr ! Une fois la réponse générée, vous pouvez la copier, modifier, adapter puis la coller sur votre plateforme d&apos;avis.
            </p>
          </div>

          <div>
            <h2 className="text-[#FFD700] font-semibold mb-2">💸 L’abonnement est-il sans engagement ?</h2>
            <p>
              Oui, vous pouvez résilier à tout moment depuis la page abonnement. Vous conservez l’accès au générateur jusqu’à la fin de la période payée.
            </p>
          </div>

          <div>
            <h2 className="text-[#FFD700] font-semibold mb-2">🆓 Y a-t-il une période d’essai ?</h2>
            <p>
              Oui ! Vous bénéficiez de 24h d’essai gratuit pour tester la puissance de ReputIA sans engagement.
            </p>
          </div>

          <div>
            <h2 className="text-[#FFD700] font-semibold mb-2">🛠️ Est-ce adapté aux particuliers et aux pros ?</h2>
            <p>
              Oui ! Que vous soyez une entreprise, un indépendant ou un particulier avec des avis à gérer, ReputIA vous simplifie la vie.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
