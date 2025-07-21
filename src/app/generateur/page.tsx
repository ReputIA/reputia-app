'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Generateur() {
  const { data: session, status } = useSession();
  const [abonnementActif, setAbonnementActif] = useState(false);
  const [avis, setAvis] = useState('');
  const [reponse, setReponse] = useState('');
  const [chargement, setChargement] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const verifierAbonnement = async () => {
      if (session?.user?.email === 'support@reputia.fr') {
        setAbonnementActif(true);
        return;
      }

      const res = await fetch('/api/abonnement');
      const data = await res.json();
      setAbonnementActif(data.abonnement);
    };

    verifierAbonnement();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setChargement(true);
    setReponse('');
    setCopied(false);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: avis }),
      });

      const data = await res.json();
      setReponse(data.reply || '❌ Une erreur est survenue.');
    } catch {
      setReponse('❌ Erreur lors de la requête.');
    } finally {
      setChargement(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === 'loading') {
    return <p className="text-white p-6">Chargement...</p>;
  }

  if (!session) {
    return (
      <div className="bg-[#1a1a1a] text-white min-h-screen flex items-center justify-center px-6">
        <p className="text-lg">🔒 Veuillez vous connecter pour accéder au générateur.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen px-6 py-12 font-sans flex flex-col items-center">
      <div className="w-full max-w-2xl bg-[#2a2a2a] p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-[#FFD700] text-center">🎯 Générateur d’avis</h1>

        {abonnementActif ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <textarea
              placeholder="Copiez ici l’avis du client…"
              value={avis}
              onChange={(e) => setAvis(e.target.value)}
              className="w-full p-4 rounded-md bg-black text-white border border-gray-700 resize-none h-40"
              required
            />

            <button
              type="submit"
              disabled={chargement}
              className="w-full bg-[#FFD700] hover:bg-yellow-400 text-black font-semibold py-3 rounded-lg transition"
            >
              {chargement ? '⏳ Génération en cours...' : 'Générer une réponse'}
            </button>

            {reponse && (
              <div className="bg-[#1e1e1e] p-4 rounded-xl border border-gray-600 relative">
                <h3 className="font-bold mb-2 text-[#FFD700]">Réponse générée :</h3>
                <p className="text-sm whitespace-pre-line">{reponse}</p>
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="absolute top-4 right-4 text-sm bg-[#FFD700] text-black px-3 py-1 rounded hover:bg-yellow-400 transition"
                >
                  {copied ? '✅ Copié !' : '📋 Copier'}
                </button>
              </div>
            )}
          </form>
        ) : (
          <div className="text-center bg-[#1e1e1e] p-6 rounded-xl shadow-md">
            <p className="text-yellow-400 mb-4 font-semibold text-lg">
              ⚠️ Pour accéder au générateur, veuillez souscrire à notre abonnement mensuel.
            </p>
            <a
              href="https://buy.stripe.com/6oU5kDbTcdbD3jJ07IdfG00"
              className="bg-[#FFD700] text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
            >
              🔐 Souscrire à l’abonnement 24€ TTC/mois
            </a>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/dashboard" className="text-sm text-[#FFD700] hover:underline">
            ← Retour au Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
