'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';
import BookPreview from '@/components/BookPreview';
import OrderForm from '@/components/OrderForm';
import { OrderFormData } from '@/lib/schema';

export default function BookDetail() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.id as string;
  
  const { books, characters } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [showOrderForm, setShowOrderForm] = useState(false);
  
  // Trouver le livre correspondant à l'ID
  const book = books.find(b => b.id === bookId);
  
  // Rediriger si le livre n'existe pas
  useEffect(() => {
    if (!isLoading && books.length > 0 && !book) {
      router.push('/books');
    }
  }, [book, books, router, isLoading]);

  const handlePurchase = () => {
    setShowOrderForm(true);
  };

  const handleOrder = async (data: OrderFormData) => {
    setIsLoading(true);
    setError(undefined);

    try {
      // Simuler le traitement de la commande
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Rediriger vers une page de confirmation
      router.push(`/books/${bookId}/success?format=${data.format}`);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors du traitement de la commande');
    } finally {
      setIsLoading(false);
    }
  };

  if (!book) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Trouver le personnage associé au livre
  const character = characters.find(char => char.id === book.characterId);

  // Préparer les données pour la prévisualisation
  const pages = book.content?.pages?.map(page => ({
    text: page.text,
    imageUrl: page.imageUrl
  })) || [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
        <Link
          href="/books"
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
        >
          Retour aux livres
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Détails du livre</h2>
            <p><span className="font-medium">Thème:</span> {book.theme}</p>
            <p><span className="font-medium">Personnage:</span> {character?.name || 'Personnage inconnu'}</p>
            <p><span className="font-medium">Nombre de pages:</span> {pages.length}</p>
            <p><span className="font-medium">Statut:</span> {book.status === 'draft' ? 'Brouillon' : 'Publié'}</p>
          </div>
          
          {pages[0]?.imageUrl && (
            <div className="w-full md:w-1/3">
              <img 
                src={pages[0].imageUrl} 
                alt="Couverture" 
                className="w-full h-auto rounded-lg shadow-sm"
              />
            </div>
          )}
        </div>
      </div>

      {showOrderForm ? (
        <OrderForm 
          onSubmit={handleOrder} 
          bookId={bookId} 
          isLoading={isLoading}
        />
      ) : (
        <BookPreview 
          title={book.title} 
          pages={pages} 
          previewPercentage={35} 
          onPurchase={handlePurchase}
        />
      )}
    </div>
  );
}
