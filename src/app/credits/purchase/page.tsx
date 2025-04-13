'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

export default function CreditsPage() {
  const router = useRouter();
  const { credits, purchaseCredits } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const creditPackages = [
    { amount: 3, price: 4.99, popular: false },
    { amount: 5, price: 7.99, popular: true },
    { amount: 10, price: 14.99, popular: false }
  ];

  const handlePurchase = async (amount: number) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await purchaseCredits(amount);
      setSuccess(`Vous avez acheté ${amount} crédit${amount > 1 ? 's' : ''} avec succès !`);
      
      // Rediriger vers la page de création d'histoire après un court délai
      setTimeout(() => {
        router.push('/stories/new');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'achat des crédits');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Acheter des crédits</h1>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
        >
          Retour au tableau de bord
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {success}
        </div>
      )}

      <div className="bg-indigo-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Vos crédits actuels: {credits.remaining}</h2>
        <p className="text-gray-700 mb-4">
          Chaque génération d'histoire utilise 1 crédit. Vous recevez 1 crédit gratuit par mois.
        </p>
        {credits.nextFreeDate && (
          <p className="text-sm text-indigo-700">
            Prochain crédit gratuit: {new Date(credits.nextFreeDate).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {creditPackages.map((pkg) => (
          <div 
            key={pkg.amount}
            className={`border rounded-lg p-6 ${pkg.popular ? 'border-indigo-500 ring-2 ring-indigo-500 ring-opacity-50' : 'border-gray-200'}`}
          >
            {pkg.popular && (
              <div className="bg-indigo-500 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                POPULAIRE
              </div>
            )}
            <h3 className="text-2xl font-bold">{pkg.amount} crédits</h3>
            <p className="text-3xl font-bold text-indigo-600 my-4">{pkg.price.toFixed(2)} €</p>
            <p className="text-gray-600 mb-6">
              Générez {pkg.amount} histoires personnalisées pour vos enfants.
            </p>
            <button
              onClick={() => handlePurchase(pkg.amount)}
              disabled={isLoading}
              className={`w-full py-3 rounded-md font-medium ${
                pkg.popular
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                  : 'bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50'
              } transition-colors`}
            >
              {isLoading ? 'Traitement en cours...' : `Acheter maintenant`}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Comment fonctionnent les crédits ?</h3>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-start">
            <span className="text-indigo-500 mr-2">•</span>
            <span>Chaque génération d'histoire complète utilise 1 crédit</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-500 mr-2">•</span>
            <span>Vous recevez 2 crédits gratuits à l'inscription</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-500 mr-2">•</span>
            <span>Vous recevez 1 crédit gratuit chaque mois</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-500 mr-2">•</span>
            <span>Les crédits achetés n'expirent jamais</span>
          </li>
          <li className="flex items-start">
            <span className="text-indigo-500 mr-2">•</span>
            <span>Vous pouvez réutiliser vos personnages pour créer de nouvelles histoires</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
