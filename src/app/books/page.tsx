'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import BookCard from '@/components/BookCard';

export default function Books() {
  const router = useRouter();
  const { user, loading, books, deleteBook } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ? Cette action est irréversible.')) {
      setIsDeleting(true);
      try {
        await deleteBook(id);
      } catch (error) {
        console.error('Erreur lors de la suppression du livre:', error);
        alert('Une erreur est survenue lors de la suppression du livre.');
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
        <h1 className="text-3xl font-bold text-gray-900">Mes livres</h1>
        <Link
          href="/characters"
          className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
        >
          Créer une nouvelle histoire
        </Link>
      </div>

      {books.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-lg font-semibold mb-2">Aucun livre créé</h2>
          <p className="text-gray-600 mb-6">
            Commencez par créer un personnage puis générez votre première histoire personnalisée.
          </p>
          <Link
            href="/characters"
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
          >
            Voir mes personnages
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              theme={book.theme}
              coverImageUrl={book.previewUrl}
              createdAt={book.createdAt}
              status={book.status}
              onView={() => router.push(`/books/${book.id}`)}
              onDelete={() => handleDelete(book.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
