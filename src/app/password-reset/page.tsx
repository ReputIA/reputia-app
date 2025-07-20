'use client';

import React, { useState } from 'react';

export default function PasswordResetRequest() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Un e-mail de réinitialisation a été envoyé.');
      } else {
        setMessage(`❌ Erreur : ${data.error || 'Erreur serveur'}`);
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi du mail de réinitialisation :", err);
      setMessage('❌ Erreur serveur, veuillez réessayer.');
    }
  };

  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#2a2a2a] p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#FFD700]">🔑 Mot de passe oublié</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm">Adresse e-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="exemple@reputia.fr"
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white"
            />
          </div>

          <button type="submit" className="w-full bg-[#FFD700] text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition">
            Envoyer le lien de réinitialisation
          </button>

          {message && <p className="text-center text-sm mt-4">{message}</p>}
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Vous vous souvenez de votre mot de passe ?{" "}
          <a href="/connexion" className="text-[#FFD700] hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  );
}
