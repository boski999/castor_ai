'use client';

import React, { useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderSuccess() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const bookId = params.id as string;
  const format = searchParams.get('format') || 'pdf';

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Commande réussie !</h1>
        
        {format === 'pdf' ? (
          <>
            <p className="text-gray-600 mb-8">
              Votre livre au format PDF est prêt à être téléchargé. Vous pouvez le télécharger immédiatement ou y accéder plus tard depuis votre espace personnel.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                onClick={() => {
                  // Simuler un téléchargement
                  alert('Téléchargement du PDF démarré...');
                }}
              >
                Télécharger maintenant
              </button>
              
              <Link
                href="/books"
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Voir mes livres
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-8">
              Votre commande de livre {format === 'hardcover' ? 'à couverture rigide' : 'à couverture souple'} a été enregistrée avec succès. Vous recevrez un email de confirmation avec les détails de livraison.
            </p>
            
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-8">
              <h2 className="font-semibold text-indigo-800 mb-2">Informations de livraison</h2>
              <p className="text-indigo-700">
                Délai de livraison estimé : 5 à 10 jours ouvrés
              </p>
            </div>
            
            <Link
              href="/books"
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Retour à mes livres
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
