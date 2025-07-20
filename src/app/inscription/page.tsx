'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Inscription() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [entreprise, setEntreprise] = useState('');
  const [siret, setSiret] = useState('');
  const [adresse, setAdresse] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [ville, setVille] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/utilisateur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          nom,
          prenom,
          entreprise,
          siret,
          adresse,
          codePostal,
          ville,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Erreur serveur');
      }

      setMessage('✅ Compte créé avec succès ! Redirection...');
      setTimeout(() => {
        router.push('/dashboard/abonnement');
      }, 1500);
    } catch (err) {
      if (err instanceof Error) {
        setMessage(`❌ Erreur : ${err.message}`);
      } else {
        setMessage('❌ Une erreur inconnue est survenue.');
      }
    }
  };

  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#2a2a2a] p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Créer un compte</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" placeholder="exemple@reputia.fr" />
          </div>

          <div>
            <label className="block mb-2 text-sm">Mot de passe</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" placeholder="••••••••" />
          </div>

          <div>
            <label className="block mb-2 text-sm">Prénom</label>
            <input type="text" required value={prenom} onChange={(e) => setPrenom(e.target.value)} className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" placeholder="Prénom" />
          </div>

          <div>
            <label className="block mb-2 text-sm">Nom</label>
            <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)} className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" placeholder="Nom" />
          </div>

          <div>
            <label className="block mb-2 text-sm">Nom de l’entreprise</label>
            <input type="text" required value={entreprise} onChange={(e) => setEntreprise(e.target.value)} className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" placeholder="Entreprise" />
          </div>

          <div>
            <label className="block mb-2 text-sm">Numéro de SIRET (facultatif)</label>
            <input type="text" value={siret} onChange={(e) => setSiret(e.target.value)} className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" placeholder="SIRET" />
          </div>

          <div>
            <label className="block mb-2 text-sm">Adresse postale</label>
            <input type="text" required value={adresse} onChange={(e) => setAdresse(e.target.value)} className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" placeholder="Adresse" />
          </div>

          <div>
            <label className="block mb-2 text-sm">Code postal</label>
            <input type="text" required value={codePostal} onChange={(e) => setCodePostal(e.target.value)} className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" placeholder="75001" />
          </div>

          <div>
            <label className="block mb-2 text-sm">Ville</label>
            <input type="text" required value={ville} onChange={(e) => setVille(e.target.value)} className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white" placeholder="Paris" />
          </div>

          <button type="submit" className="w-full bg-[#FFD700] text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition">
            Créer mon compte
          </button>

          {message && <p className="text-center text-sm mt-4">{message}</p>}
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Vous avez déjà un compte ?{' '}
          <a href="/connexion" className="text-[#FFD700] hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  );
}
