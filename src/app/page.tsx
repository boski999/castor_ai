import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Des histoires uniques</span>
          <span className="block text-indigo-600">pour votre enfant</span>
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500">
          Créez des livres personnalisés où votre enfant est le héros de l'aventure, générés par l'intelligence artificielle.
        </p>
        <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
          <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
            <Link
              href="/register"
              className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 sm:px-8"
            >
              Commencer gratuitement
            </Link>
            <Link
              href="#how-it-works"
              className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 sm:px-8"
            >
              Comment ça marche
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12" id="how-it-works">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Comment ça marche</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Créez un livre personnalisé en quelques étapes simples
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 rounded-md bg-indigo-100 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-indigo-600">1</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Personnalisez</h3>
            <p className="text-gray-600">
              Entrez les informations sur votre enfant : prénom, âge, apparence, centres d'intérêt et traits de personnalité.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 rounded-md bg-indigo-100 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-indigo-600">2</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Générez</h3>
            <p className="text-gray-600">
              Notre IA crée une histoire unique et des illustrations où votre enfant est le héros de l'aventure.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 rounded-md bg-indigo-100 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-indigo-600">3</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Recevez</h3>
            <p className="text-gray-600">
              Téléchargez le PDF ou commandez une version imprimée de qualité professionnelle livrée chez vous.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 bg-indigo-50 rounded-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Pourquoi choisir nos livres personnalisés</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Unique</h3>
            <p className="text-gray-600">
              Chaque livre est créé spécifiquement pour votre enfant, avec ses caractéristiques et ses goûts.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Éducatif</h3>
            <p className="text-gray-600">
              Nos histoires encouragent la lecture et stimulent l'imagination tout en transmettant des valeurs positives.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Mémorable</h3>
            <p className="text-gray-600">
              Un cadeau unique que votre enfant chérira et qui renforcera son amour de la lecture.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Évolutif</h3>
            <p className="text-gray-600">
              Créez plusieurs histoires avec le même personnage pour construire un univers cohérent.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
          Prêt à créer une histoire magique ?
        </h2>
        <Link
          href="/register"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Commencer gratuitement
        </Link>
        <p className="mt-4 text-sm text-gray-500">
          Aucune carte de crédit requise pour essayer
        </p>
      </section>
    </div>
  );
}
