'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import CharacterCard from '@/components/CharacterCard';

export default function Characters() {
  const router = useRouter();
  const { user, loading, characters, deleteCharacter } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce personnage ? Cette action est irréversible.')) {
      setIsDeleting(true);
      try {
        await deleteCharacter(id);
      } catch (error) {
        console.error('Erreur lors de la suppression du personnage:', error);
        alert('Une erreur est survenue lors de la suppression du personnage.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Mes personnages</h1>
        <Link
          href="/characters/new"
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
        >
          Créer un personnage
        </Link>
      </div>

      {characters.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-semibold mb-2">Aucun personnage créé</h2>
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
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              id={character.id}
              name={character.name}
              age={character.age}
              imageUrl={character.imageUrl}
              onEdit={() => router.push(`/characters/${character.id}/edit`)}
              onDelete={() => handleDelete(character.id)}
              onCreateStory={() => router.push(`/stories/new?characterId=${character.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
