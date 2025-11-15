'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

type ApiGenerateResponse = {
  reply: string;
};

export default function AvisPage() {
  const { data: session, status } = useSession();

  const [avis, setAvis] = useState('');
  const [reponse, setReponse] = useState('');
  const [chargement, setChargement] = useState(false);
  const [copied, setCopied] = useState(false);

  const [freeTryUsed, setFreeTryUsed] = useState(false);
  const [abonnementActif, setAbonnementActif] = useState<boolean | null>(null);
  const [checkingSub, setCheckingSub] = useState(true);
  const [isRedirectingStripe, setIsRedirectingStripe] = useState(false);

  // 🔍 Vérifie en base si l'utilisateur a un abonnement actif
  useEffect(() => {
    const checkAbonnement = async () => {
      if (status !== 'authenticated') {
        setAbonnementActif(null);
        setCheckingSub(false);
        return;
      }

      try {
        const res = await fetch('/api/me');
        const data = await res.json();

        if (res.ok) {
          setAbonnementActif(!!data.abonnement);
        } else {
          console.error('Erreur abonnement:', data);
          setAbonnementActif(false);
        }
      } catch (e) {
        console.error('Erreur réseau abonnement:', e);
        setAbonnementActif(false);
      } finally {
        setCheckingSub(false);
      }
    };

    checkAbonnement();
  }, [status]);

  // 🧪 Gestion de l'essai gratuit (1 seule fois par navigateur)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!session) {
      try {
        const flag = window.localStorage.getItem('reputia_free_try');
        setFreeTryUsed(flag === 'used');
      } catch (e) {
        console.error('Erreur lecture localStorage', e);
        setFreeTryUsed(false);
      }
    } else {
      // Utilisateur connecté → on se fiche du localStorage
      setFreeTryUsed(false);
    }
  }, [session]);

  // ✍️ Soumission du formulaire (génération de réponse)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setReponse('');
    setCopied(false);

    // Cas non connecté : essai gratuit unique
    if (!session && freeTryUsed) {
      setReponse(
        "⚠️ Vous avez déjà utilisé votre essai gratuit. Créez un compte et souscrivez à l’abonnement pour continuer à générer des réponses."
      );
      return;
    }

    // Cas connecté mais pas d'abonnement
    if (session && !abonnementActif) {
      setReponse(
        "🔒 Votre essai gratuit est terminé. Souscrivez à l’abonnement ReputIA pour continuer à utiliser le générateur."
      );
      return;
    }

    if (!avis.trim()) {
      setReponse("Merci de coller un avis avant de générer une réponse.");
      return;
    }

    setChargement(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: avis }),
      });

      const data: ApiGenerateResponse = await res.json();

      if (!res.ok) {
        setReponse(data.reply || "❌ Une erreur est survenue.");
      } else {
        setReponse(data.reply || "❌ Une erreur est survenue.");

        // Si c'est un utilisateur non connecté → on marque l'essai comme utilisé
        if (!session && !freeTryUsed) {
          try {
            window.localStorage.setItem('reputia_free_try', 'used');
            setFreeTryUsed(true);
          } catch (e) {
            console.error('Erreur écriture localStorage', e);
          }
        }
      }
    } catch (e) {
      console.error(e);
      setReponse('❌ Erreur lors de la requête.');
    } finally {
      setChargement(false);
    }
  };

  const copyToClipboard = () => {
    if (!reponse) return;
    navigator.clipboard.writeText(reponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 🔐 Lancement du checkout Stripe (abonnement 9,99€)
  const handleStripeCheckout = async () => {
    try {
      setIsRedirectingStripe(true);

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Erreur lors de la redirection vers le paiement.");
      }
    } catch (e) {
      console.error(e);
      alert("Erreur réseau lors de l'appel à Stripe.");
    } finally {
      setIsRedirectingStripe(false);
    }
  };

  // État de chargement global
  if (status === 'loading' || checkingSub) {
    return (
      <div className="bg-[#1a1a1a] text-white min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen px-6 py-12 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-[#202020] p-8 rounded-3xl shadow-xl border border-[#333] mt-4">
        {/* HEADER / TITRE */}
        <div className="mb-6 flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold text-[#FFD700] mb-2">
            Générateur de réponses aux avis
          </h1>
          <p className="text-gray-300 text-sm">
            Collez un avis laissé par un client (Google, Facebook, etc.) et laissez Reput
            <span className="text-[#FFD700]">IA</span> rédiger une réponse professionnelle.
          </p>
        </div>

        {/* INFOS COMPTE / ABONNEMENT */}
        <div className="mb-6 text-xs text-gray-400 text-center">
          {session ? (
            <>
              Connecté en tant que{' '}
              <span className="text-[#FFD700]">{session.user?.email}</span> — Abonnement :{' '}
              <span className="font-semibold">
                {abonnementActif ? '✅ Actif (illimité)' : '❌ Inactif'}
              </span>
            </>
          ) : (
            <>Vous n’êtes pas connecté. 1 essai gratuit est disponible sur cet appareil.</>
          )}
        </div>

        {/* FORMULAIRE DE GÉNÉRATION */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            placeholder="Copiez ici l’avis du client…"
            value={avis}
            onChange={(e) => setAvis(e.target.value)}
            className="w-full p-4 rounded-md bg-black text-white border border-gray-700 resize-none h-40"
          />

          <button
            type="submit"
            disabled={chargement}
            className="w-full bg-[#FFD700] hover:bg-yellow-400 text-black font-semibold py-3 rounded-lg transition disabled:opacity-70"
          >
            {chargement ? '⏳ Génération en cours...' : 'Générer une réponse'}
          </button>
        </form>

        {/* RÉSULTAT */}
        {reponse && (
          <div className="bg-[#1e1e1e] p-4 rounded-xl border border-gray-600 relative mt-6">
            <h3 className="font-bold mb-2 text-[#FFD700]">Réponse générée :</h3>
            <p className="text-sm whitespace-pre-line">{reponse}</p>
            <button
              type="button"
              onClick={copyToClipboard}
              className="absolute top-4 right-4 text-xs bg-[#FFD700] text-black px-3 py-1 rounded hover:bg-yellow-400 transition"
            >
              {copied ? '✅ Copié !' : '📋 Copier'}
            </button>
          </div>
        )}

        {/* PAYWALL / ABONNEMENT */}
        <div className="mt-8 space-y-4">
          {/* Cas non connecté + essai utilisé */}
          {!session && freeTryUsed && (
            <div className="bg-[#1e1e1e] p-4 rounded-xl border border-[#444] text-sm text-center">
              <p className="text-yellow-400 font-semibold mb-2">
                ⚠️ Essai gratuit utilisé sur cet appareil.
              </p>
              <p className="text-gray-300 mb-3">
                Créez un compte pour souscrire à l’abonnement et continuer à utiliser Reput
                <span className="text-[#FFD700]">IA</span>.
              </p>
              <div className="flex flex-col md:flex-row gap-3 justify-center">
                <Link
                  href="/inscription"
                  className="bg-[#FFD700] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition"
                >
                  Créer un compte
                </Link>
                <Link
                  href="/connexion"
                  className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          )}

          {/* Cas connecté mais AUCUN abonnement */}
          {session && !abonnementActif && (
            <div className="text-center bg-[#1e1e1e] p-6 rounded-xl shadow-md border border-[#444]">
              <p className="text-yellow-400 mb-4 font-semibold text-lg">
                🔒 Votre essai est terminé.
              </p>
              <p className="text-gray-300 text-sm mb-4">
                Pour continuer à générer des réponses illimitées, souscrivez à l’abonnement mensuel
                Reput<span className="text-[#FFD700]">IA</span>.
              </p>

              <button
                type="button"
                onClick={handleStripeCheckout}
                disabled={isRedirectingStripe}
                className="bg-[#FFD700] text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition w-full md:w-auto disabled:opacity-70"
              >
                {isRedirectingStripe
                  ? 'Redirection vers le paiement...'
                  : '🔐 Souscrire – 9,99€ TTC / mois'}
              </button>

              <p className="text-gray-400 text-xs mt-3">
                Paiement sécurisé via Stripe. Résiliable à tout moment.
              </p>
            </div>
          )}

          {/* Cas connecté + abonnement actif → petit rappel commercial */}
          {session && abonnementActif && (
            <div className="text-center bg-[#111] p-4 rounded-xl border border-[#333] text-xs text-gray-400">
              ✅ Votre abonnement Reput
              <span className="text-[#FFD700]">IA</span> est actif. Vous pouvez générer autant de
              réponses que nécessaire.
            </div>
          )}
        </div>

        {/* Lien retour */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-[#FFD700] hover:underline">
            ← Retour à Reput<span className="text-[#FFD700]">IA</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
