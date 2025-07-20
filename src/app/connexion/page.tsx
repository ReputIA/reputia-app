'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

const Connexion: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/dashboard',
    });

    if (result?.error) {
      setErrorMsg('❌ Identifiants incorrects. Veuillez réessayer.');
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#2a2a2a] p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Se connecter à ReputIA</h1>

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

          <div>
            <label htmlFor="password" className="block mb-2 text-sm">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white"
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-400 text-center -mt-2">{errorMsg}</p>
          )}

          <button
            type="submit"
            className="w-full bg-[#FFD700] text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition"
          >
            Connexion
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Vous n&apos;avez pas encore de compte ?{' '}
          <a href="/inscription" className="text-[#FFD700] hover:underline">Créer un compte</a>
        </p>

        <p className="text-sm text-gray-400 mt-3 text-center">
          <Link href="/password-reset" className="text-[#FFD700] hover:underline">
            Mot de passe oublié ?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Connexion;
