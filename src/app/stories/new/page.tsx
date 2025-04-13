'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import StoryForm from '@/components/StoryForm';
import { StoryFormData } from '@/lib/schema';
import { useUser } from '@/context/UserContext';
import { generateStory, generateIllustration } from '@/lib/openai';

export default function NewStory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const characterId = searchParams.get('characterId');
  
  const { characters, addBook, credits, useStoryCredit } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [progress, setProgress] = useState<string>('');
  
  // Trouver le personnage correspondant à l'ID
  const character = characterId ? characters.find(char => char.id === characterId) : null;
  
  // Rediriger si aucun personnage n'est sélectionné
  React.useEffect(() => {
    if (!isLoading && characters.length > 0 && !character && characterId) {
      router.push('/characters');
    }
  }, [character, characters, router, isLoading, characterId]);

  const handleSubmit = async (data: StoryFormData) => {
    if (!character) {
      setError('Veuillez sélectionner un personnage');
      return;
    }

    // Vérifier si l'utilisateur a des crédits disponibles
    if (credits.remaining <= 0) {
      setError(`Vous n'avez plus de crédits disponibles. ${credits.nextFreeDate ? `Prochain crédit gratuit: ${new Date(credits.nextFreeDate).toLocaleDateString()}` : 'Achetez des crédits pour continuer.'}`);
      return;
    }

    setIsLoading(true);
    setError(undefined);
    setProgress('Initialisation de la génération...');

    try {
      // Utiliser un crédit
      await useStoryCredit();

      // Préparer les données du personnage
      const childAppearance = `${character.appearance.hairStyle} cheveux ${character.appearance.hairColor}, yeux ${character.appearance.eyeColor}, peau ${character.appearance.skinTone}, taille ${character.appearance.height}${character.appearance.specialFeature ? `, avec ${character.appearance.specialFeature}` : ''}`;
      
      // Générer l'histoire
      setProgress('Génération de l\'histoire en cours...');
      const storyContent = await generateStory(
        character.name,
        character.age,
        character.gender,
        childAppearance,
        character.interests,
        character.personality,
        data.theme,
        data.pageCount
      );
      
      // Analyser le contenu de l'histoire
      const storyLines = storyContent.split('\n');
      let title = 'Histoire personnalisée';
      const pages = [];
      
      // Extraire le titre
      for (const line of storyLines) {
        if (line.startsWith('Titre :') || line.startsWith('Titre:')) {
          title = line.replace(/^Titre\s*:\s*/, '').trim();
          break;
        }
      }
      
      // Extraire les pages et les descriptions d'illustrations
      let currentPage = '';
      let currentIllustrationDesc = '';
      
      for (const line of storyLines) {
        if (line.match(/^Page \d+\s*:/)) {
          if (currentPage) {
            pages.push({
              text: currentPage.trim(),
              illustrationDescription: currentIllustrationDesc.trim()
            });
            currentPage = '';
            currentIllustrationDesc = '';
          }
          currentPage = line.replace(/^Page \d+\s*:\s*/, '').trim() + ' ';
        } else if (line.match(/^Description illustration\s*:/)) {
          currentIllustrationDesc = line.replace(/^Description illustration\s*:\s*/, '').trim();
        } else if (currentPage && !line.match(/^Titre\s*:/)) {
          currentPage += line.trim() + ' ';
        }
      }
      
      // Ajouter la dernière page
      if (currentPage) {
        pages.push({
          text: currentPage.trim(),
          illustrationDescription: currentIllustrationDesc.trim()
        });
      }
      
      // Générer les illustrations
      setProgress('Génération des illustrations...');
      const pagesWithImages = [];
      
      for (let i = 0; i < pages.length; i++) {
        setProgress(`Génération de l'illustration ${i+1}/${pages.length}...`);
        try {
          const imageUrl = await generateIllustration(
            character.name,
            character.age,
            character.gender,
            childAppearance,
            pages[i].illustrationDescription,
            'style aquarelle pour enfants'
          );
          
          pagesWithImages.push({
            ...pages[i],
            imageUrl
          });
        } catch (err) {
          console.error('Erreur lors de la génération de l\'illustration:', err);
          pagesWithImages.push(pages[i]);
        }
      }
      
      // Créer le livre
      setProgress('Enregistrement du livre...');
      const bookData = {
        title,
        theme: data.theme,
        content: {
          pages: pagesWithImages
        },
        characterId: character.id,
        status: 'draft'
      };
      
      const bookId = await addBook(bookData);
      router.push(`/books/${bookId}`);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la génération de l\'histoire');
    } finally {
      setIsLoading(false);
      setProgress('');
    }
  };

  if (!characterId) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Créer une histoire</h1>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            Annuler
          </Link>
        </div>

        {credits.remaining <= 0 && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-md mb-6">
            <h3 className="font-semibold">Vous n'avez plus de crédits disponibles</h3>
            <p className="mt-1">
              {credits.nextFreeDate 
                ? `Votre prochain crédit gratuit sera disponible le ${new Date(credits.nextFreeDate).toLocaleDateString()}.` 
                : 'Achetez des crédits pour générer de nouvelles histoires.'}
            </p>
            <div className="mt-3">
              <Link
                href="/credits/purchase"
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
              >
                Acheter des crédits
              </Link>
            </div>
          </div>
        )}

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Sélectionnez un personnage</h2>
          
          {characters.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Vous devez d'abord créer un personnage avant de pouvoir générer une histoire.
              </p>
              <Link
                href="/characters/new"
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
              >
                Créer un personnage
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((char) => (
                <div 
                  key={char.id}
                  className="border rounded-lg p-4 hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer transition-colors"
                  onClick={() => {
                    if (credits.remaining > 0) {
                      router.push(`/stories/new?characterId=${char.id}`);
                    }
                  }}
                >
                  <h3 className="font-semibold">{char.name}</h3>
                  <p className="text-sm text-gray-600">{char.age} ans</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-indigo-50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Crédits disponibles: {credits.remaining}</h2>
          <p className="text-gray-700 mb-4">
            Chaque génération d'histoire utilise 1 crédit. Vous recevez 1 crédit gratuit par mois.
          </p>
          {credits.nextFreeDate && (
            <p className="text-sm text-indigo-700">
              Prochain crédit gratuit: {new Date(credits.nextFreeDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Créer une histoire pour {character.name}</h1>
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

      {isLoading && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-3 rounded-md">
          <div className="flex items-center">
            <div className="mr-3 animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
            <p>{progress}</p>
          </div>
          <p className="mt-2 text-sm">La génération peut prendre plusieurs minutes. Merci de votre patience.</p>
        </div>
      )}

      <div className="bg-indigo-50 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Crédits disponibles: {credits.remaining}</h2>
        <p className="text-gray-700 mb-4">
          Cette génération d'histoire utilisera 1 crédit.
        </p>
        {credits.nextFreeDate && (
          <p className="text-sm text-indigo-700">
            Prochain crédit gratuit: {new Date(credits.nextFreeDate).toLocaleDateString()}
          </p>
        )}
      </div>

      <StoryForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
        characterId={character.id} 
      />
    </div>
  );
}
