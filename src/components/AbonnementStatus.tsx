"use client";

import { useEffect, useState } from "react";

const AbonnementStatus = () => {
  const [isPaid, setIsPaid] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/profil/abonnement");
        const data = await res.json();
        setIsPaid(data.abonnement);
      } catch (error) {
        console.error("Erreur vérification abonnement :", error);
        setIsPaid(false);
      }
    };

    fetchStatus();
  }, []);

  if (isPaid === null) {
    return (
      <div className="text-gray-500 text-center font-semibold mt-4">
        Chargement du statut d’abonnement...
      </div>
    );
  }

  if (isPaid) {
    return (
      <div className="text-green-500 text-center font-semibold mt-4">
        ✅ Abonnement actif – Merci pour votre confiance !
      </div>
    );
  }

  return (
    <div className="text-red-500 text-center font-semibold mt-4">
      ❌ Abonnement inactif – Activez-le pour utiliser le générateur.
    </div>
  );
};

export default AbonnementStatus;
