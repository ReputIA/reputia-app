'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Utilisateur {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  entreprise: string;
  siret?: string;
  adresse: string;
  codePostal: string;
  ville: string;
  createdAt: string;
}

interface MessageSupport {
  id: number;
  email: string;
  contenu: string;
  reponse?: string;
  createdAt: string;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState<'messages' | 'utilisateurs'>('messages');
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [messages, setMessages] = useState<MessageSupport[]>([]);
  const [reponses, setReponses] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email !== 'support@reputia.fr') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMessages, resUsers] = await Promise.all([
          fetch('/api/admin/messages'),
          fetch('/api/admin/utilisateurs'),
        ]);

        const messagesData = await resMessages.json();
        const utilisateursData = await resUsers.json();

        if (Array.isArray(messagesData)) setMessages(messagesData);
        if (Array.isArray(utilisateursData)) setUtilisateurs(utilisateursData);
      } catch (err) {
        console.error('❌ Erreur chargement admin :', err);
      }
    };

    if (session?.user?.email === 'support@reputia.fr') {
      fetchData();
    }
  }, [session]);

  const handleRepondre = async (id: number) => {
    const reponse = reponses[id];
    if (!reponse) return;

    try {
      await fetch('/api/support/repondre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, reponse }),
      });

      alert('✅ Réponse enregistrée !');

      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, reponse } : msg))
      );

      setReponses((prev) => ({ ...prev, [id]: '' }));
    } catch (error) {
      console.error('❌ Erreur envoi réponse :', error);
      alert('❌ Erreur lors de l’envoi');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce message ?')) return;

    try {
      const res = await fetch('/api/admin/supprimer-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      }
    } catch (err) {
      console.error('❌ Erreur suppression message :', err);
      alert('❌ Erreur lors de la suppression');
    }
  };

  if (status === 'loading') return <p className="text-white text-center py-10">Chargement...</p>;
  if (session?.user?.email !== 'support@reputia.fr') return null;

  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen p-8 font-sans">
      <h1 className="text-3xl font-bold text-[#FFD700] mb-6">🔐 Panneau d’administration</h1>

      {/* Onglets */}
      <div className="flex gap-4 mb-8">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            tab === 'messages'
              ? 'bg-[#FFD700] text-black'
              : 'bg-[#2a2a2a] hover:bg-[#333] text-white'
          }`}
          onClick={() => setTab('messages')}
        >
          📨 Messages
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            tab === 'utilisateurs'
              ? 'bg-[#FFD700] text-black'
              : 'bg-[#2a2a2a] hover:bg-[#333] text-white'
          }`}
          onClick={() => setTab('utilisateurs')}
        >
          👥 Utilisateurs
        </button>
      </div>

      {/* Onglet MESSAGES */}
      {tab === 'messages' && (
        <>
          {messages.length === 0 ? (
            <p className="text-gray-400">Aucun message reçu.</p>
          ) : (
            <div className="space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-[#2a2a2a] p-6 rounded-xl border border-gray-700 relative">
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="absolute top-3 right-4 text-red-500 hover:text-red-700 text-lg"
                    title="Supprimer"
                  >
                    ✖
                  </button>
                  <p className="text-sm mb-2 text-gray-300">
                    📧 <strong>{msg.email}</strong> – {new Date(msg.createdAt).toLocaleString()}
                  </p>
                  <p className="text-white mb-3">📝 {msg.contenu}</p>

                  {msg.reponse ? (
                    <p className="text-green-400">✅ Réponse : {msg.reponse}</p>
                  ) : (
                    <>
                      <textarea
                        className="w-full bg-black border border-gray-600 rounded-lg p-3 text-sm text-white mb-3"
                        placeholder="Votre réponse ici..."
                        value={reponses[msg.id] || ''}
                        onChange={(e) =>
                          setReponses((prev) => ({ ...prev, [msg.id]: e.target.value }))
                        }
                      />
                      <button
                        className="bg-[#FFD700] hover:bg-yellow-400 text-black px-4 py-2 rounded font-semibold"
                        onClick={() => handleRepondre(msg.id)}
                      >
                        ✉️ Enregistrer la réponse
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Onglet UTILISATEURS */}
      {tab === 'utilisateurs' && (
        <>
          <h2 className="text-xl font-semibold text-[#FFD700] mb-4">Liste des utilisateurs</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-700 rounded-xl text-sm">
              <thead className="bg-[#333]">
                <tr>
                  <th className="p-3 text-left">Nom</th>
                  <th className="p-3 text-left">Prénom</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Entreprise</th>
                  <th className="p-3 text-left">Adresse</th>
                  <th className="p-3 text-left">Ville</th>
                  <th className="p-3 text-left">Créé le</th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.map((u) => (
                  <tr key={u.id} className="border-t border-gray-700">
                    <td className="p-2">{u.nom}</td>
                    <td className="p-2">{u.prenom}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.entreprise}</td>
                    <td className="p-2">{u.adresse}</td>
                    <td className="p-2">{u.ville}</td>
                    <td className="p-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
