'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, initializeUserCredits, getUserCredits, useCredit, addCredits } from '@/lib/supabase';
import { ChildFormData } from '@/lib/schema';

interface UserContextType {
  user: any | null;
  loading: boolean;
  characters: any[];
  books: any[];
  credits: {
    remaining: number;
    nextFreeDate: Date | null;
  };
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  addCharacter: (data: ChildFormData) => Promise<string>;
  updateCharacter: (id: string, data: ChildFormData) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  addBook: (data: any) => Promise<string>;
  deleteBook: (id: string) => Promise<void>;
  useStoryCredit: () => Promise<boolean>;
  purchaseCredits: (amount: number) => Promise<void>;
  getTimeToNextFreeCredit: () => string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [characters, setCharacters] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [credits, setCredits] = useState<{ remaining: number; nextFreeDate: Date | null }>({
    remaining: 0,
    nextFreeDate: null
  });

  // Écouter les changements d'authentification
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchUserData(session.user.id);
          await initializeUserCredits(session.user.id);
          await fetchUserCredits(session.user.id);
        } else {
          setUser(null);
          setCharacters([]);
          setBooks([]);
          setCredits({ remaining: 0, nextFreeDate: null });
        }
        setLoading(false);
      }
    );

    // Vérifier l'état de l'authentification au chargement
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchUserData(session.user.id);
        await initializeUserCredits(session.user.id);
        await fetchUserCredits(session.user.id);
      }
      setLoading(false);
    };

    checkUser();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Récupérer les données de l'utilisateur
  const fetchUserData = async (userId: string) => {
    try {
      // Récupérer les personnages
      const { data: charactersData, error: charactersError } = await supabase
        .from('characters')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (charactersError) throw charactersError;
      setCharacters(charactersData || []);

      // Récupérer les livres
      const { data: booksData, error: booksError } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (booksError) throw booksError;
      setBooks(booksData || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des données utilisateur:', error);
    }
  };

  // Récupérer les crédits de l'utilisateur
  const fetchUserCredits = async (userId: string) => {
    try {
      const userCredits = await getUserCredits(userId);
      
      // Calculer la date du prochain crédit gratuit
      let nextFreeDate = null;
      if (userCredits.last_free_credit_date) {
        const lastDate = new Date(userCredits.last_free_credit_date);
        nextFreeDate = new Date(lastDate);
        nextFreeDate.setMonth(nextFreeDate.getMonth() + 1);
      }
      
      setCredits({
        remaining: userCredits.credits_remaining,
        nextFreeDate
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des crédits:', error);
    }
  };

  // Connexion
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de la connexion');
    }
  };

  // Inscription
  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });
      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de l\'inscription');
    }
  };

  // Déconnexion
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de la déconnexion');
    }
  };

  // Ajouter un personnage
  const addCharacter = async (data: ChildFormData) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');

      const characterData = {
        user_id: user.id,
        name: data.name,
        age: data.age,
        gender: data.gender,
        appearance: data.appearance,
        interests: data.interests,
        personality: data.personality,
        image_url: null // Sera mis à jour après génération
      };

      const { data: newCharacter, error } = await supabase
        .from('characters')
        .insert(characterData)
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour la liste des personnages
      setCharacters(prev => [newCharacter, ...prev]);

      return newCharacter.id;
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de la création du personnage');
    }
  };

  // Mettre à jour un personnage
  const updateCharacter = async (id: string, data: ChildFormData) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');

      const characterData = {
        name: data.name,
        age: data.age,
        gender: data.gender,
        appearance: data.appearance,
        interests: data.interests,
        personality: data.personality
      };

      const { error } = await supabase
        .from('characters')
        .update(characterData)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Mettre à jour la liste des personnages
      setCharacters(prev => prev.map(char => 
        char.id === id ? { ...char, ...characterData } : char
      ));
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de la mise à jour du personnage');
    }
  };

  // Supprimer un personnage
  const deleteCharacter = async (id: string) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('characters')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Mettre à jour la liste des personnages
      setCharacters(prev => prev.filter(char => char.id !== id));
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de la suppression du personnage');
    }
  };

  // Ajouter un livre
  const addBook = async (data: any) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');

      const bookData = {
        user_id: user.id,
        character_id: data.characterId,
        title: data.title,
        theme: data.theme,
        content: data.content,
        preview_url: data.previewUrl || null,
        pdf_url: null,
        status: data.status || 'draft',
      };

      const { data: newBook, error } = await supabase
        .from('books')
        .insert(bookData)
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour la liste des livres
      setBooks(prev => [newBook, ...prev]);

      return newBook.id;
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de la création du livre');
    }
  };

  // Supprimer un livre
  const deleteBook = async (id: string) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');

      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      // Mettre à jour la liste des livres
      setBooks(prev => prev.filter(book => book.id !== id));
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de la suppression du livre');
    }
  };

  // Utiliser un crédit pour créer une histoire
  const useStoryCredit = async () => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');

      // Vérifier et utiliser un crédit
      const result = await useCredit(user.id);
      
      // Mettre à jour les crédits dans le state
      setCredits(prev => ({
        ...prev,
        remaining: result.creditsRemaining
      }));

      return true;
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de l\'utilisation du crédit');
    }
  };

  // Acheter des crédits
  const purchaseCredits = async (amount: number) => {
    try {
      if (!user) throw new Error('Utilisateur non connecté');

      // Simuler un achat de crédits (à remplacer par une intégration de paiement réelle)
      const result = await addCredits(user.id, amount);
      
      // Mettre à jour les crédits dans le state
      setCredits(prev => ({
        ...prev,
        remaining: result.credits_remaining
      }));
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de l\'achat de crédits');
    }
  };

  // Obtenir le temps restant avant le prochain crédit gratuit
  const getTimeToNextFreeCredit = () => {
    if (!credits.nextFreeDate) return null;
    
    const now = new Date();
    const nextDate = credits.nextFreeDate;
    
    if (now >= nextDate) return "Disponible maintenant";
    
    const diffTime = Math.abs(nextDate.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `Disponible dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  };

  const value = {
    user,
    loading,
    characters,
    books,
    credits,
    signIn,
    signUp,
    signOut,
    addCharacter,
    updateCharacter,
    deleteCharacter,
    addBook,
    deleteBook,
    useStoryCredit,
    purchaseCredits,
    getTimeToNextFreeCredit
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser doit être utilisé à l\'intérieur d\'un UserProvider');
  }
  return context;
};
