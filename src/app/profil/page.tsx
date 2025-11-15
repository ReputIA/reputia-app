'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type ProfilData = {
  email: string;
  prenom: string;
  nom: string;
  entreprise: string;
  siret?: string | null;
  adresse: string;
  codePostal: string;
  ville: string;
  telephone?: string | null;
  abonnement?: boolean;
};

export default function ProfilPage() {
  const { data: session, status } = useSession();
  const [profil, setProfil] = useState<ProfilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const fetchProfil = async () => {
      try {
        const res = await fetch('/api/me');
        const data = await res.json();
        if (res.ok) {
          setProfil(data);
        } else {
          setError(data.error || 'Erreur lors du chargement du profil.');
        }
      } catch {
        setError('Erreur réseau lors du chargement du profil.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfil();
  }, [status]);

  const handleChange = (field: keyof ProfilData, value: string) => {
    if (!profil) return;
    setProfil({ ...profil, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profil) return;

    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch('/api/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profil),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erreur lors de la sauvegarde.');
      } else {
        setProfil(data);
        setMessage('✅ Informations mises à jour avec succès.');
      }
    } catch {
      setError('Erreur réseau lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="bg-[#1a1a1a] text-white min-h-screen flex items-center justify-center">
        Chargement de votre profil...
      </div>
    );
  }

  if (!session || !profil) {
    return (
      <div className="bg-[#1a1a1a] text-white min-h-screen flex flex-col items-center justify-center px-6">
        <p className="mb-4 text-center">
          Vous devez être connecté pour accéder à votre profil.
        </p>
        <div className="flex gap-3">
          <Link
            href="/connexion"
            className="bg-[#FFD700] text-black px-5 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition"
          >
            Se connecter
          </Link>
          <Link
            href="/inscription"
            className="bg-white text-black px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
          >
            Créer un compte
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen px-6 py-12 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-[#202020] p-8 rounded-3xl shadow-xl border border-[#333] mt-4">
        <h1 className="text-3xl font-bold mb-6 text-[#FFD700] text-center">
          Mon compte
        </h1>

        <p className="text-center text-gray-400 text-sm mb-6">
          Ces informations servent à personnaliser vos factures et votre compte Reput
          <span className="text-[#FFD700]">IA</span>.
        </p>

        {message && (
          <p className="mb-4 text-sm text-green-400 text-center">{message}</p>
        )}
        {error && (
          <p className="mb-4 text-sm text-red-400 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-gray-400 mb-1">Email (non modifiable)</label>
            <input
              type="email"
              value={profil.email}
              disabled
              className="w-full px-3 py-2 rounded-lg bg-[#111] border border-[#333] text-gray-400 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1">Prénom *</label>
              <input
                type="text"
                value={profil.prenom || ''}
                onChange={(e) => handleChange('prenom', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#111] border border-[#333] text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Nom *</label>
              <input
                type="text"
                value={profil.nom || ''}
                onChange={(e) => handleChange('nom', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#111] border border-[#333] text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Nom de l’entreprise *</label>
            <input
              type="text"
              value={profil.entreprise || ''}
              onChange={(e) => handleChange('entreprise', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#111] border border-[#333] text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Numéro de SIRET (facultatif)</label>
            <input
              type="text"
              value={profil.siret || ''}
              onChange={(e) => handleChange('siret', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#111] border border-[#333] text-white"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Téléphone *</label>
            <input
              type="tel"
              value={profil.telephone || ''}
              onChange={(e) => handleChange('telephone', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#111] border border-[#333] text-white"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Adresse postale *</label>
            <input
              type="text"
              value={profil.adresse || ''}
              onChange={(e) => handleChange('adresse', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#111] border border-[#333] text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1">Code postal *</label>
              <input
                type="text"
                value={profil.codePostal || ''}
                onChange={(e) => handleChange('codePostal', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#111] border border-[#333] text-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Ville *</label>
              <input
                type="text"
                value={profil.ville || ''}
                onChange={(e) => handleChange('ville', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#111] border border-[#333] text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-4 w-full bg-[#FFD700] text-black px-4 py-3 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition disabled:opacity-60"
          >
            {saving ? '💾 Sauvegarde en cours...' : 'Enregistrer mes informations'}
          </button>
        </form>

        {/* Bloc "Gérer mes abonnements" */}
<div className="mt-8 p-4 rounded-xl bg-[#111] border border-[#444] text-sm">
  <h2 className="text-base font-semibold mb-2 text-[#FFD700]">
    Gérer mes abonnements
  </h2>
  <p className="text-gray-300 mb-3">
    Statut actuel :{" "}
    <span className="font-semibold">
      {profil.abonnement ? "✅ Abonnement ReputIA actif" : "❌ Aucun abonnement actif"}
    </span>
  </p>
  <p className="text-gray-400 mb-3">
    Gérez votre abonnement (résiliation, factures, moyen de paiement) via notre portail sécurisé Stripe.
  </p>

  <button
    type="button"
    onClick={async () => {
      try {
        const res = await fetch('/api/stripe/portal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();

        if (res.ok && data.url) {
          window.location.href = data.url;
        } else {
          alert(data.error || "Impossible d'ouvrir le portail de gestion.");
        }
      } catch (e) {
        console.error(e);
        alert("Erreur réseau lors de l'accès au portail.");
      }
    }}
    disabled={!profil.abonnement}
    className="w-full bg-[#FFD700] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {profil.abonnement
      ? "Ouvrir le portail de gestion"
      : "Aucun abonnement actif"}
          </button>
          </div>

      </div>
    </div>
  );
}
