'use client';

import React from 'react';

export default function Blog() {
  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#FFD700] mb-12 text-center">
          Blog ReputIA 🧠
        </h1>

        {/* Article 1 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-4">
            📢 Pourquoi répondre aux avis clients est essentiel pour votre entreprise ?
          </h2>
          <p className="text-gray-300 mb-4">
            Aujourd’hui, 9 consommateurs sur 10 consultent les avis avant de choisir une entreprise. Mais saviez-vous que les <strong>réponses</strong> jouent un rôle tout aussi important ?
          </p>
          <p className="text-gray-300 mb-4">
            Répondre à un avis, qu’il soit positif ou négatif, montre que vous êtes à l’écoute de vos clients. Cela humanise votre entreprise et instaure une relation de confiance.
          </p>
          <p className="text-gray-300 mb-4">
            De plus, Google valorise les fiches actives : répondre améliore votre <strong>référencement local</strong> et vous rend plus visible dans les recherches.
          </p>
          <p className="text-gray-300">
            Grâce à ReputIA, automatisez ce processus tout en gardant un ton professionnel et humain.
          </p>
        </section>

        {/* Article 2 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-4">
            ❌ Les erreurs à éviter quand on répond à un avis négatif
          </h2>
          <p className="text-gray-300 mb-4">
            Un avis négatif n’est pas une fatalité. C’est une opportunité de montrer votre professionnalisme… à condition de bien y répondre.
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-4">
            <li>⚠️ Répondre trop vite, sous l’émotion.</li>
            <li>⚠️ Utiliser un ton sec ou robotique.</li>
            <li>⚠️ Accuser le client ou nier son ressenti.</li>
            <li>⚠️ Ignorer les avis négatifs par peur d’y faire face.</li>
          </ul>
          <p className="text-gray-300">
            ReputIA vous aide à répondre avec calme, empathie et intelligence, en transformant chaque critique en opportunité.
          </p>
        </section>

        {/* Article 3 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#FFD700] mb-4">
            🌟 Comment inciter vos clients à laisser un avis positif ?
          </h2>
          <p className="text-gray-300 mb-4">
            Plus vous avez d’avis, plus vous êtes visible. Mais comment faire pour que vos clients prennent le temps de vous laisser un avis 5 étoiles ?
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-4">
            <li>✅ Demandez au bon moment, juste après l’achat.</li>
            <li>✅ Expliquez pourquoi leur avis compte pour vous.</li>
            <li>✅ Utilisez un lien ou une carte NFC pour simplifier l’action.</li>
            <li>✅ Remerciez toujours, même sans retour immédiat.</li>
          </ul>
          <p className="text-gray-300">
            Avec les bons outils, comme ReputIA, collecter des avis devient simple, naturel… et puissant pour votre image.
          </p>
        </section>
      </div>
    </div>
  );
}
