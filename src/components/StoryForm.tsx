import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { storyFormSchema, StoryFormData, themeOptions } from '@/lib/schema';

type StoryFormProps = {
  onSubmit: (data: StoryFormData) => void;
  initialData?: Partial<StoryFormData>;
  isLoading?: boolean;
  characterId?: string;
};

export default function StoryForm({ onSubmit, initialData, isLoading = false, characterId }: StoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoryFormData>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: initialData || {
      childId: characterId,
      theme: '',
      pageCount: 12,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Créer une histoire</h2>
        
        <input
          type="hidden"
          {...register('childId')}
          value={characterId}
        />
        
        <div className="mb-6">
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
            Thème de l'histoire
          </label>
          <select
            id="theme"
            {...register('theme')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            <option value="">Sélectionner un thème...</option>
            {themeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.theme && (
            <p className="mt-1 text-sm text-red-600">{errors.theme.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="pageCount" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de pages
          </label>
          <input
            id="pageCount"
            type="number"
            min={8}
            max={20}
            {...register('pageCount')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          {errors.pageCount && (
            <p className="mt-1 text-sm text-red-600">{errors.pageCount.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Génération en cours...' : 'Générer l\'histoire'}
        </button>
      </div>
    </form>
  );
}
