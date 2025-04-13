'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ChildForm from '@/components/ChildForm';
import { ChildFormData } from '@/lib/schema';
import { useUser } from '@/context/UserContext';

export default function NewCharacter() {
  const router = useRouter();
  const { addCharacter } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (data: ChildFormData) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const characterId = await addCharacter(data);
      router.push(`/characters`);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la création du personnage');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Créer un personnage</h1>
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

      <ChildForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
