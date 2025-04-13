import React from 'react';
import Link from 'next/link';

type CharacterCardProps = {
  id: string;
  name: string;
  age: number;
  imageUrl?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onCreateStory?: () => void;
};

export default function CharacterCard({ 
  id, 
  name, 
  age, 
  imageUrl, 
  onEdit, 
  onDelete,
  onCreateStory 
}: CharacterCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 bg-indigo-100 flex items-center justify-center">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-indigo-200 flex items-center justify-center">
            <span className="text-3xl font-bold text-indigo-600">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600">{age} ans</p>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Modifier
            </button>
          )}
          
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              Supprimer
            </button>
          )}
        </div>
        
        {onCreateStory && (
          <button
            onClick={onCreateStory}
            className="mt-4 w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Créer une histoire
          </button>
        )}
      </div>
    </div>
  );
}
