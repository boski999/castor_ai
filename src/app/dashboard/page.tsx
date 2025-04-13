'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import CharacterCard from '@/components/CharacterCard';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, characters, books } = useUser();

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Ne rien afficher pendant la redirection
  }

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-2 text-gray-600">
          Bienvenue sur votre espace personnel
        </p>
      </div>

      {/* Section Personnages */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Vos personnages</h2>
          <Link
            href="/characters/new"
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
          >
            Créer un personnage
          </Link>
        </div>

        {characters.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Aucun personnage créé</h3>
            <p className="text-gray-600 mb-6">
              Commencez par créer un personnage pour pouvoir générer des histoires personnalisées.
            </p>
            <Link
              href="/characters/new"
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              Créer mon premier personnage
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.slice(0, 3).map((character) => (
              <CharacterCard
                key={character.id}
                id={character.id}
                name={character.name}
                age={character.age}
                imageUrl={character.imageUrl}
                onEdit={() => router.push(`/characters/${character.id}/edit`)}
                onCreateStory={() => router.push(`/stories/new?characterId=${character.id}`)}
              />
            ))}
          </div>
        )}

        {characters.length > 3 && (
          <div className="mt-4 text-center">
            <Link
              href="/characters"
              className="text-indigo-600 hover:text-indigo-500"
            >
              Voir tous vos personnages ({characters.length})
            </Link>
          </div>
        )}
      </section>

      {/* Section Livres récents */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Vos livres récents</h2>
          <Link
            href="/books"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Voir tous vos livres
          </Link>
        </div>

        {books.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold mb-2">Aucun livre créé</h3>
            <p className="text-gray-600 mb-6">
              Une fois que vous aurez créé un personnage, vous pourrez générer des histoires personnalisées.
            </p>
            {characters.length > 0 && (
              <Link
                href={`/stories/new?characterId=${characters[0].id}`}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
              >
                Créer ma première histoire
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {books.slice(0, 3).map((book) => (
              <div key={book.id} className="bg-white p-4 rounded-lg shadow-md flex items-center">
                <div className="h-16 w-16 bg-indigo-100 rounded-md flex items-center justify-center mr-4">
                  {book.previewUrl ? (
                    <img 
                      src={book.previewUrl} 
                      alt={book.title} 
                      className="h-full w-full object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-indigo-600">📖</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{book.title}</h3>
                  <p className="text-sm text-gray-500">Thème: {book.theme}</p>
                </div>
                <Link
                  href={`/books/${book.id}`}
                  className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                >
                  Voir
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section Démarrage rapide */}
      <section className="bg-indigo-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Démarrage rapide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-semibold mb-2">1. Créez un personnage</h3>
            <p className="text-sm text-gray-600 mb-4">
              Personnalisez un héros qui ressemble à votre enfant.
            </p>
            <Link
              href="/characters/new"
              className="text-indigo-600 hover:text-indigo-500 text-sm"
            >
              Créer un personnage →
            </Link>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-semibold mb-2">2. Générez une histoire</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choisissez un thème et créez une aventure unique.
            </p>
            <Link
              href={characters.length > 0 ? `/stories/new?characterId=${characters[0].id}` : "/characters/new"}
              className="text-indigo-600 hover:text-indigo-500 text-sm"
            >
              Créer une histoire →
            </Link>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h3 className="font-semibold mb-2">3. Commandez votre livre</h3>
            <p className="text-sm text-gray-600 mb-4">
              Téléchargez en PDF ou commandez une version imprimée.
            </p>
            <Link
              href="/books"
              className="text-indigo-600 hover:text-indigo-500 text-sm"
            >
              Voir mes livres →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
