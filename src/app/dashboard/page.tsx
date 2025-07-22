'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AbonnementStatus from '@/components/AbonnementStatus';

interface MessageSupport {
  contenu: string;
  reponse: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [supportMessage, setSupportMessage] = useState<MessageSupport | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/connexion');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchReponse = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch(`/api/support/reponse?email=${session.user.email}`);
          if (!res.ok) return;
          const data = await res.json();

          if (data?.message) {
            setSupportMessage(data.message);
          }
        } catch (error) {
          console.error('Erreur chargement réponse support :', error);
        }
      }
    };

    fetchReponse();
  }, [session]);

  if (status === 'loading') {
    return <div className="text-white text-center mt-20">Chargement...</div>;
  }

  if (status === 'unauthenticated') return null;

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = session?.user?.email;

    if (!email || !message.trim()) return;

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, contenu: message }),
      });

      const data = await res.json();

      if (data.success) {
        setConfirmation('✅ Message envoyé avec succès');
        setMessage('');
      } else {
        setConfirmation('❌ Erreur lors de l’envoi');
      }
    } catch (error) {
      console.error('Erreur lors de l’envoi du message au support :', error);
      setConfirmation('❌ Erreur serveur');
    }
  };

  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen flex flex-col font-sans">
      <div className="flex-grow px-6 py-12">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-[#FFD700] mb-2">Bienvenue dans le Dashboard de ReputIA</h1>
          <p className="text-gray-300 text-lg">✨ Votre réputation, notre intelligence.</p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link href="/dashboard/profil">
            <div className="bg-[#2a2a2a] hover:bg-[#333] p-6 rounded-xl text-center transition cursor-pointer shadow">
              <h2 className="text-xl font-semibold text-[#FFD700] mb-2">👤 Profil</h2>
              <p className="text-sm text-gray-400">Gérez vos informations personnelles</p>
            </div>
          </Link>

          <Link href="/dashboard/abonnement">
            <div className="bg-[#2a2a2a] hover:bg-[#333] p-6 rounded-xl text-center transition cursor-pointer shadow">
              <h2 className="text-xl font-semibold text-[#FFD700] mb-2">💳 Abonnement</h2>
              <p className="text-sm text-gray-400">Voir ou modifier votre abonnement</p>
            </div>
          </Link>

          <Link href="/generateur">
            <div className="bg-[#FFD700] hover:bg-yellow-400 text-black p-6 rounded-xl cursor-pointer transition shadow text-center font-semibold">
              <h2 className="text-xl mb-1">🎯 Générateur d’avis</h2>
              <p className="text-sm">Cliquez pour générer une réponse</p>
            </div>
          </Link>
        </div>

        <div className="text-center mb-10">
          {session?.user?.email === 'support@reputia.fr' ? (
            <div className="text-green-500 text-sm font-medium">
              ✅ Compte administrateur – accès illimité au générateur
            </div>
          ) : (
            <Suspense fallback={<div className="text-white">Chargement de l’abonnement...</div>}>
              <AbonnementStatus />
            </Suspense>
          )}
        </div>

        <div className="max-w-4xl mx-auto bg-[#2a2a2a] p-6 rounded-xl shadow mb-8">
          <h2 className="text-2xl font-semibold text-[#FFD700] mb-2">🎯 Objectif du mois</h2>
          <p className="text-gray-300 text-sm">
            Collecter au moins 10 nouveaux avis positifs sur votre fiche Google Business avant la fin du mois.
            Pensez à relancer vos clients satisfaits !
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-[#2a2a2a] p-6 rounded-xl shadow mb-8">
          <h2 className="text-2xl font-semibold text-[#FFD700] mb-4">📌 Nos conseils pour optimiser votre page Google :</h2>
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 flex-1">
              <li>Répondez à tous les avis, même les négatifs.</li>
              <li>Ajoutez des photos récentes de vos produits ou services.</li>
              <li>Mettez à jour régulièrement vos horaires et infos pratiques.</li>
              <li>Utilisez des mots-clés locaux dans votre description.</li>
              <li>Demandez à vos clients de vous noter après leur passage.</li>
            </ul>
            <div className="bg-[#1e1e1e] border border-gray-700 p-4 rounded-md text-sm text-gray-300 w-full lg:w-[45%]">
              <p className="mb-3">
                🎯 Vous manquez de temps pour tout faire ? Nous pouvons optimiser votre fiche Google My Business pour vous !
              </p>
              <a
                href="https://boost-reputia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#FFD700] text-black font-semibold py-2 px-4 rounded hover:bg-yellow-400 transition"
              >
                🚀 Découvrez notre offre
              </a>
            </div>
          </div>
        </div>

        <div className="bg-[#2a2a2a] p-6 rounded-xl mt-10 max-w-2xl mx-auto w-full">
          <h2 className="text-xl font-semibold text-[#FFD700] mb-4">📩 Contacter le support</h2>

          {!confirmation && (
            <p className="text-sm text-yellow-400 mb-4 italic">
              ⏱️ Nous répondons à toutes les demandes sous 24h. Une fois traitée, la réponse s’affichera ici automatiquement.
            </p>
          )}

          <form onSubmit={handleSupportSubmit} className="space-y-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Décrivez votre problème ou posez votre question..."
              className="w-full bg-black text-white border border-gray-600 rounded-md p-4 resize-none h-40"
              required
            />
            <button
              type="submit"
              className="bg-[#FFD700] text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 transition"
            >
              Envoyer le message
            </button>
          </form>

          {confirmation && (
            <div className="text-center mt-4 space-y-2">
              <p className="text-sm text-green-400">{confirmation}</p>
              <p className="text-sm text-gray-400 italic">
                🎧 Votre demande a bien été reçue. Nous vous répondrons dans les prochaines 24 heures.
              </p>
            </div>
          )}

          {supportMessage && (
            <div className="mt-6 bg-[#1e1e1e] border border-gray-700 p-4 rounded-md">
              <h3 className="text-sm font-semibold text-[#FFD700] mb-2">📬 Dernier échange avec le support :</h3>
              <p className="text-gray-400 text-sm mb-2">📝 Vous : {supportMessage.contenu}</p>
              <p className="text-green-400 text-sm">🟢 Support : {supportMessage.reponse}</p>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-[#111] text-gray-400 text-sm py-8 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          <div>
            <h3 className="text-white font-bold mb-2">📧 Contact</h3>
            <p>support@reputia.fr</p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-2">🔗 Liens utiles</h3>
            <ul className="space-y-1">
              <li><a href="/mentions-legales" className="hover:text-white">Mentions légales</a></li>
              <li><a href="/conditions-utilisation" className="hover:text-white">Conditions d’utilisation</a></li>
              <li><a href="/confidentialite" className="hover:text-white">Politique de confidentialité</a></li>
              <li><a href="/faq" className="hover:text-white">FAQ</a></li>
              <li><a href="/blog" className="hover:text-white">Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-2">📱 Réseaux sociaux</h3>
            <ul className="space-y-1">
              <li>
                <a href="https://instagram.com/reputia_a" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-2">🏢 ReputIA</h3>
            <p>Entreprise basée en France 🇫🇷</p>
            <p>© 2025 ReputIA</p>
          </div>
        </div>
        {/* Bouton flottant WhatsApp */}
<a
  href="https://wa.me/message/LMFWWC3XW7GEK1"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg p-4 z-50 transition transform hover:scale-105"
  aria-label="Contactez-nous sur WhatsApp"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    className="w-6 h-6"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967s-.47-.149-.668.149-.767.967-.94 1.168-.347.223-.644.075c-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.019-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.1-.198.05-.372-.025-.521s-.668-1.611-.916-2.214c-.242-.58-.487-.5-.668-.51l-.571-.01c-.198 0-.52.075-.793.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.412.248-.694.248-1.29.173-1.412-.074-.123-.272-.198-.57-.347z" />
    <path d="M12.003 2.002C6.478 2.002 2 6.48 2 12.005c0 1.999.522 3.881 1.515 5.558L2 22l4.583-1.487a9.967 9.967 0 0 0 5.42 1.489c5.523 0 10.002-4.478 10.002-10.002S17.526 2.002 12.003 2.002zm0 18.202c-1.636 0-3.237-.445-4.627-1.288l-.331-.197-2.72.883.897-2.648-.217-.342A8.198 8.198 0 0 1 3.803 12c0-4.526 3.674-8.2 8.2-8.2s8.2 3.674 8.2 8.2-3.674 8.204-8.2 8.204z" />
  </svg>
</a>


      </footer>
    </div>
  );
}
