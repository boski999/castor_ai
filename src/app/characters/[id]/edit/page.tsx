'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ChildForm from '@/components/ChildForm';
import { ChildFormData } from '@/lib/schema';
import { useUser } from '@/context/UserContext';

export default function EditCharacter() {
  const router = useRouter();
  const params = useParams();
  const characterId = params.id as string;
  
  const { characters, updateCharacter } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  
  // Trouver le personnage correspondant à l'ID
  const character = characters.find(char => char.id === characterId);
  
  // Rediriger si le personnage n'existe pas
  useEffect(() => {
    if (!isLoading && characters.length > 0 && !character) {
      router.push('/characters');
    }
  }, [character, characters, router, isLoading]);

  const handleSubmit = async (data: ChildFormData) => {
    setIsLoading(true);
    setError(undefined);

    try {
      await updateCharacter(characterId, data);
      router.push('/characters');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la mise à jour du personnage');
    } finally {
      setIsLoading(false);
    }
  };

  if (!character) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Préparer les données initiales pour le formulaire
  const initialData: ChildFormData = {
    name: character.name,
    age: character.age,
    gender: character.gender as any,
    appearance: character.appearance,
    interests: character.interests,
    personality: character.personality,
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Modifier le personnage</h1>
        <Link
          href="/characters"
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
        >
          Annuler
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <ChildForm onSubmit={handleSubmit} initialData={initialData} isLoading={isLoading} />
    </div>
  );
}
