'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function PasswordReset() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage('❌ Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const res = await fetch(`/api/password-reset/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Mot de passe réinitialisé avec succès. Redirection...');
        setTimeout(() => {
          router.push('/connexion');
        }, 1500);
      } else {
        setMessage(`❌ ${data.error || 'Erreur lors de la réinitialisation du mot de passe.'}`);
      }
    } catch (error) {
      console.error("Erreur lors de la réinitialisation :", error);
      setMessage('❌ Erreur serveur. Veuillez réessayer plus tard.');
    }
  };

  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#2a2a2a] p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Réinitialiser votre mot de passe</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="new-password" className="block mb-2 text-sm">Nouveau mot de passe</label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block mb-2 text-sm">Confirmez le mot de passe</label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white"
            />
          </div>

          {message && (
            <p className="text-sm text-center -mt-2">{message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#FFD700] text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition"
          >
            Réinitialiser le mot de passe
          </button>
        </form>
      </div>
    </div>
  );
}
