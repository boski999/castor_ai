import React from 'react';
import Link from 'next/link';

type BookCardProps = {
  id: string;
  title: string;
  theme: string;
  coverImageUrl?: string;
  createdAt: string;
  status: 'draft' | 'published';
  onView: () => void;
  onDelete?: () => void;
};

export default function BookCard({ 
  id, 
  title, 
  theme, 
  coverImageUrl, 
  createdAt, 
  status,
  onView,
  onDelete
}: BookCardProps) {
  // Formater la date
  const formattedDate = new Date(createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-indigo-100 flex items-center justify-center">
        {coverImageUrl ? (
          <img 
            src={coverImageUrl} 
            alt={title} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-100 to-purple-100">
            <span className="text-xl font-bold text-indigo-600 text-center px-4">
              {title}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{title}</h3>
        <p className="text-gray-600 text-sm">Thème: {theme}</p>
        <p className="text-gray-500 text-sm mt-1">Créé le {formattedDate}</p>
        
        <div className="mt-2">
          {status === 'draft' ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Brouillon
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Publié
            </span>
          )}
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={onView}
            className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
          >
            Voir
          </button>
          
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
