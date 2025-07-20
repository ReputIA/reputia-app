'use client';

import React from 'react';

export default function ConditionsUtilisation() {
  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen px-6 py-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#FFD700] mb-8 text-center">
          Conditions Générales d’Utilisation
        </h1>

        <p className="text-sm text-gray-400 mb-8 text-center">
          Dernière mise à jour : 13 avril 2025
        </p>

        <div className="space-y-6 text-base text-gray-200 leading-relaxed">

          <p>
            Bienvenue sur le site ReputIA (https://reputia.fr), propriété de <strong>ReputIA SASU</strong>, dont le siège social est situé à [adresse à compléter], immatriculée au RCS sous le numéro [SIRET à compléter].
          </p>

          <p>
            L’accès et l’utilisation du site impliquent l’acceptation pleine et entière des présentes conditions générales d’utilisation (CGU). En cas de désaccord avec l’une de ces dispositions, l’utilisateur est invité à ne pas utiliser le site.
          </p>

          <h2 className="text-xl font-semibold text-[#FFD700]">1. Objet du site</h2>
          <p>
            ReputIA est une plateforme permettant aux professionnels de générer automatiquement des réponses aux avis clients en ligne, à l’aide de l’intelligence artificielle. Ce service est accessible uniquement après inscription et souscription à un abonnement.
          </p>

          <h2 className="text-xl font-semibold text-[#FFD700]">2. Accès au site</h2>
          <p>
            L’accès au site est gratuit, à l’exception des services réservés aux utilisateurs disposant d’un abonnement actif. L’utilisateur s’engage à fournir des informations exactes lors de son inscription.
          </p>

          <h2 className="text-xl font-semibold text-[#FFD700]">3. Propriété intellectuelle</h2>
          <p>
            Tous les éléments présents sur le site (textes, images, logos, marques, interface, etc.) sont protégés par le droit de la propriété intellectuelle. Toute reproduction, totale ou partielle, sans autorisation écrite est strictement interdite.
          </p>

          <h2 className="text-xl font-semibold text-[#FFD700]">4. Données personnelles</h2>
          <p>
            Les informations recueillies lors de l’inscription sont nécessaires à la gestion du service et à la facturation. ReputIA s’engage à respecter la réglementation en vigueur, notamment le RGPD. Pour plus d’informations, consulte notre <a href="/confidentialite" className="text-[#FFD700] underline">politique de confidentialité</a>.
          </p>

          <h2 className="text-xl font-semibold text-[#FFD700]">5. Responsabilités</h2>
          <p>
            ReputIA met tout en œuvre pour garantir l’exactitude des informations diffusées, mais ne peut être tenue pour responsable d’éventuelles erreurs, interruptions ou indisponibilités du service. L’utilisateur est seul responsable des réponses générées via la plateforme.
          </p>

          <h2 className="text-xl font-semibold text-[#FFD700]">6. Abonnement et résiliation</h2>
          <p>
            L’abonnement est mensuel, sans engagement. L’utilisateur peut le résilier à tout moment depuis son espace personnel. Aucun remboursement ne sera effectué pour un mois en cours déjà payé.
          </p>

          <h2 className="text-xl font-semibold text-[#FFD700]">7. Modifications des CGU</h2>
          <p>
            ReputIA se réserve le droit de modifier les présentes conditions à tout moment. Les nouvelles CGU entreront en vigueur dès leur mise en ligne.
          </p>

          <h2 className="text-xl font-semibold text-[#FFD700]">8. Droit applicable</h2>
          <p>
            Les présentes CGU sont soumises au droit français. En cas de litige, une solution amiable sera privilégiée. À défaut, les tribunaux français seront seuls compétents.
          </p>
        </div>
      </div>
    </div>
  );
}
