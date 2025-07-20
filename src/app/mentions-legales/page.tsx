'use client';

import React from 'react';

export default function MentionsLegales() {
  return (
    <div className="bg-[#1a1a1a] text-white min-h-screen px-6 py-12 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#FFD700] mb-8 text-center">
          Mentions légales
        </h1>

        <h2 className="text-xl font-semibold text-[#FFD700] mt-6 mb-2">
          Éditeur du site
        </h2>
        <p className="text-gray-300">
          Le site ReputIA est édité par :  
          <br />
          <strong>ReputIA</strong>, SASU au capital de 1000 €  
          <br />
          SIRET : [TON SIRET ICI]  
          <br />
          Siège social : [TON ADRESSE POSTALE ICI]  
          <br />
          Email : contact@reputia.fr
        </p>

        <h2 className="text-xl font-semibold text-[#FFD700] mt-6 mb-2">
          Directeur de la publication
        </h2>
        <p className="text-gray-300">
          [Ton Nom] – Fondateur de ReputIA
        </p>

        <h2 className="text-xl font-semibold text-[#FFD700] mt-6 mb-2">
          Hébergement
        </h2>
        <p className="text-gray-300">
          Le site est hébergé par :  
          <br />
          <strong>Netlify, Inc.</strong>  
          <br />
          2325 3rd Street, Suite 296, San Francisco, California 94107  
          <br />
          Site web : <a href="https://www.netlify.com/" className="text-[#FFD700] hover:underline">https://www.netlify.com</a>
        </p>

        <h2 className="text-xl font-semibold text-[#FFD700] mt-6 mb-2">
          Propriété intellectuelle
        </h2>
        <p className="text-gray-300">
          L’ensemble du contenu du site ReputIA (textes, images, logo, etc.) est protégé par le droit d’auteur. Toute reproduction, totale ou partielle, sans autorisation préalable est interdite.
        </p>

        <h2 className="text-xl font-semibold text-[#FFD700] mt-6 mb-2">
          Données personnelles
        </h2>
        <p className="text-gray-300">
          ReputIA s’engage à respecter la confidentialité des données personnelles collectées sur ce site. Pour en savoir plus, veuillez consulter notre{" "}
          <a href="/confidentialite" className="text-[#FFD700] hover:underline">Politique de confidentialité</a>.
        </p>

        <h2 className="text-xl font-semibold text-[#FFD700] mt-6 mb-2">
          Cookies
        </h2>
        <p className="text-gray-300">
          Le site peut utiliser des cookies à des fins statistiques et pour améliorer l’expérience utilisateur. Vous pouvez configurer votre navigateur pour refuser les cookies.
        </p>

        <h2 className="text-xl font-semibold text-[#FFD700] mt-6 mb-2">
          Loi applicable
        </h2>
        <p className="text-gray-300">
          Les présentes mentions légales sont régies par la loi française. En cas de litige, les tribunaux français seront seuls compétents.
        </p>
      </div>
    </div>
  );
}
