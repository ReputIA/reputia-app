'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Profil() {
  const [form, setForm] = useState({
    nom: '', prenom: '', entreprise: '', siret: '', adresse: '', codePostal: '', ville: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfil = async () => {
      const res = await fetch('/api/profil');
      const data = await res.json();
      if (data) {
        setForm({
          nom: data.nom || '',
          prenom: data.prenom || '',
          entreprise: data.entreprise || '',
          siret: data.siret || '',
          adresse: data.adresse || '',
          codePostal: data.codePostal || '',
          ville: data.ville || '',
        });
      }
    };
    fetchProfil();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/profil', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setMessage('✅ Profil mis à jour avec succès !');
    } else {
      setMessage('❌ Erreur lors de la mise à jour du profil');
    }
  };

  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen flex justify-center items-center px-4 py-10">
      <div className="w-full max-w-lg bg-[#2a2a2a] p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-1 text-[#FFD700]">👤 Mon profil</h1>
        <p className="text-sm text-center text-gray-400 mb-6">Modifiez vos informations personnelles</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {Object.entries(form).map(([key, value]) => (
            <div key={key}>
              <label className="block mb-1 text-sm capitalize">{key}</label>
              <input
                type="text"
                name={key}
                value={value}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black border border-gray-700 rounded-lg"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-[#FFD700] text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition"
          >
            Enregistrer les modifications
          </button>

          {message && <p className="text-center text-sm mt-4">{message}</p>}
        </form>

        {/* 🔙 Bouton retour */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="text-[#FFD700] text-sm hover:underline"
          >
            ← Retour au Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
