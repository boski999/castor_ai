import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { childFormSchema, ChildFormData, hairColorOptions, hairStyleOptions, eyeColorOptions, skinToneOptions, interestOptions, personalityOptions } from '@/lib/schema';

type ChildFormProps = {
  onSubmit: (data: ChildFormData) => void;
  initialData?: Partial<ChildFormData>;
  isLoading?: boolean;
};

export default function ChildForm({ onSubmit, initialData, isLoading = false }: ChildFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ChildFormData>({
    resolver: zodResolver(childFormSchema),
    defaultValues: initialData || {
      name: '',
      age: 6,
      gender: undefined,
      appearance: {
        hairColor: '',
        hairStyle: '',
        eyeColor: '',
        skinTone: '',
        height: undefined,
        specialFeature: '',
      },
      interests: [],
      personality: [],
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Informations de base</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Prénom de l'enfant
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Prénom"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Âge
            </label>
            <input
              id="age"
              type="number"
              min={3}
              max={10}
              {...register('age')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Genre
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="fille"
                {...register('gender')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <span className="ml-2">Fille</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="garçon"
                {...register('gender')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <span className="ml-2">Garçon</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="autre"
                {...register('gender')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <span className="ml-2">Autre</span>
            </label>
          </div>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Apparence</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="hairColor" className="block text-sm font-medium text-gray-700 mb-1">
              Couleur des cheveux
            </label>
            <select
              id="hairColor"
              {...register('appearance.hairColor')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              <option value="">Sélectionner...</option>
              {hairColorOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.appearance?.hairColor && (
              <p className="mt-1 text-sm text-red-600">{errors.appearance.hairColor.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="hairStyle" className="block text-sm font-medium text-gray-700 mb-1">
              Style de cheveux
            </label>
            <select
              id="hairStyle"
              {...register('appearance.hairStyle')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              <option value="">Sélectionner...</option>
              {hairStyleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.appearance?.hairStyle && (
              <p className="mt-1 text-sm text-red-600">{errors.appearance.hairStyle.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="eyeColor" className="block text-sm font-medium text-gray-700 mb-1">
              Couleur des yeux
            </label>
            <select
              id="eyeColor"
              {...register('appearance.eyeColor')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              <option value="">Sélectionner...</option>
              {eyeColorOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.appearance?.eyeColor && (
              <p className="mt-1 text-sm text-red-600">{errors.appearance.eyeColor.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="skinTone" className="block text-sm font-medium text-gray-700 mb-1">
              Teinte de peau
            </label>
            <select
              id="skinTone"
              {...register('appearance.skinTone')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            >
              <option value="">Sélectionner...</option>
              {skinToneOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.appearance?.skinTone && (
              <p className="mt-1 text-sm text-red-600">{errors.appearance.skinTone.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Taille
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="grand"
                {...register('appearance.height')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <span className="ml-2">Grand</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="moyen"
                {...register('appearance.height')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <span className="ml-2">Moyen</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="petit"
                {...register('appearance.height')}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <span className="ml-2">Petit</span>
            </label>
          </div>
          {errors.appearance?.height && (
            <p className="mt-1 text-sm text-red-600">{errors.appearance.height.message}</p>
          )}
        </div>

        <div className="mt-6">
          <label htmlFor="specialFeature" className="block text-sm font-medium text-gray-700 mb-1">
            Particularité (optionnel)
          </label>
          <input
            id="specialFeature"
            type="text"
            {...register('appearance.specialFeature')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Ex: taches de rousseur, lunettes, etc."
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Centres d'intérêt</h2>
        
        <Controller
          control={control}
          name="interests"
          render={({ field }) => (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {interestOptions.map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={field.value.includes(option.value)}
                    onChange={e => {
                      const value = option.value;
                      const newValues = e.target.checked
                        ? [...field.value, value]
                        : field.value.filter(v => v !== value);
                      field.onChange(newValues);
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    disabled={isLoading}
                  />
                  <span className="ml-2">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        />
        {errors.interests && (
          <p className="mt-1 text-sm text-red-600">{errors.interests.message}</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-indigo-700">Personnalité</h2>
        
        <Controller
          control={control}
          name="personality"
          render={({ field }) => (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {personalityOptions.map(option => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={field.value.includes(option.value)}
                    onChange={e => {
                      const value = option.value;
                      const newValues = e.target.checked
                        ? [...field.value, value]
                        : field.value.filter(v => v !== value);
                      field.onChange(newValues);
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    disabled={isLoading}
                  />
                  <span className="ml-2">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        />
        {errors.personality && (
          <p className="mt-1 text-sm text-red-600">{errors.personality.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? 'Chargement...' : 'Enregistrer le personnage'}
        </button>
      </div>
    </form>
  );
}
