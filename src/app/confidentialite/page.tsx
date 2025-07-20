'use client';

import React from 'react';

export default function PolitiqueConfidentialite() {
  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen px-6 py-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#FFD700] mb-6">Politique de confidentialité</h1>

        <p className="mb-6">
          Chez ReputIA, nous attachons une grande importance à la protection de vos données personnelles. Cette politique explique comment nous les collectons, les utilisons et les protégeons.
        </p>

        <h2 className="text-2xl font-semibold text-[#FFD700] mt-8 mb-4">1. Données collectées</h2>
        <p>Nous collectons les données suivantes :</p>
        <ul className="list-disc list-inside mb-6 mt-2">
          <li>Nom et prénom</li>
          <li>Adresse e-mail</li>
          <li>Adresse postale</li>
          <li>Numéro de téléphone</li>
          <li>Nom de l’entreprise et numéro de SIRET (facultatif)</li>
        </ul>

        <h2 className="text-2xl font-semibold text-[#FFD700] mt-8 mb-4">2. Utilisation des données</h2>
        <p className="mb-6">
          Vos données sont utilisées uniquement dans le cadre de la gestion de votre compte, de votre abonnement et de la facturation mensuelle. Nous ne partageons jamais vos données avec des tiers non autorisés.
        </p>

        <h2 className="text-2xl font-semibold text-[#FFD700] mt-8 mb-4">3. Durée de conservation</h2>
        <p className="mb-6">
          Vos données sont conservées aussi longtemps que votre compte est actif, et jusqu’à 3 ans après sa suppression, à des fins légales ou fiscales.
        </p>

        <h2 className="text-2xl font-semibold text-[#FFD700] mt-8 mb-4">4. Sécurité</h2>
        <p className="mb-6">
          Nous mettons en œuvre toutes les mesures techniques et organisationnelles nécessaires pour protéger vos données contre l’accès non autorisé, la perte ou la destruction.
        </p>

        <h2 className="text-2xl font-semibold text-[#FFD700] mt-8 mb-4">5. Vos droits</h2>
        <p className="mb-2">Conformément à la réglementation, vous disposez des droits suivants :</p>
        <ul className="list-disc list-inside mb-6 mt-2">
          <li>Droit d’accès, de rectification et de suppression de vos données</li>
          <li>Droit à la limitation du traitement</li>
          <li>Droit d’opposition</li>
          <li>Droit à la portabilité</li>
        </ul>

        <p className="mb-6">
          Pour exercer ces droits, vous pouvez nous contacter à tout moment à l’adresse suivante : <strong>support@reputia.fr</strong>
        </p>

        <h2 className="text-2xl font-semibold text-[#FFD700] mt-8 mb-4">6. Contact</h2>
        <p>
          Si vous avez des questions concernant cette politique de confidentialité, n’hésitez pas à nous contacter à <strong>support@reputia.fr</strong>.
        </p>
      </div>
    </div>
  );
}
