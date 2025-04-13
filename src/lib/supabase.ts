import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonctions pour la gestion des crédits utilisateur
export const getUserCredits = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_credits')
    .select('credits_remaining, last_free_credit_date')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Erreur lors de la récupération des crédits:', error);
    throw new Error('Impossible de récupérer les crédits utilisateur');
  }

  // Vérifier si l'utilisateur peut recevoir un crédit gratuit mensuel
  if (data.last_free_credit_date) {
    const lastCreditDate = new Date(data.last_free_credit_date);
    const now = new Date();
    
    // Calculer si un mois s'est écoulé
    const oneMonthPassed = (
      now.getMonth() > lastCreditDate.getMonth() || 
      now.getFullYear() > lastCreditDate.getFullYear()
    ) && now.getDate() >= lastCreditDate.getDate();
    
    if (oneMonthPassed) {
      // Ajouter un crédit gratuit mensuel
      await addFreeCredit(userId);
      data.credits_remaining += 1;
    }
  }

  return data;
};

export const useCredit = async (userId: string) => {
  // Vérifier si l'utilisateur a des crédits disponibles
  const { data: credits } = await supabase
    .from('user_credits')
    .select('credits_remaining')
    .eq('user_id', userId)
    .single();

  if (!credits || credits.credits_remaining <= 0) {
    throw new Error('Vous n\'avez plus de crédits disponibles');
  }

  // Décrémenter le crédit
  const { error } = await supabase
    .from('user_credits')
    .update({ credits_remaining: credits.credits_remaining - 1 })
    .eq('user_id', userId);

  if (error) {
    console.error('Erreur lors de l\'utilisation du crédit:', error);
    throw new Error('Impossible d\'utiliser le crédit');
  }

  // Enregistrer l'utilisation de l'API
  await logApiUsage(userId, 'story_generation');

  return { creditsRemaining: credits.credits_remaining - 1 };
};

export const addCredits = async (userId: string, amount: number) => {
  const { data, error } = await supabase
    .from('user_credits')
    .update({ 
      credits_remaining: supabase.rpc('increment_credits', { amount }) 
    })
    .eq('user_id', userId)
    .select('credits_remaining')
    .single();

  if (error) {
    console.error('Erreur lors de l\'ajout de crédits:', error);
    throw new Error('Impossible d\'ajouter des crédits');
  }

  return data;
};

export const addFreeCredit = async (userId: string) => {
  const { error } = await supabase
    .from('user_credits')
    .update({ 
      credits_remaining: supabase.rpc('increment_credits', { amount: 1 }),
      last_free_credit_date: new Date().toISOString()
    })
    .eq('user_id', userId);

  if (error) {
    console.error('Erreur lors de l\'ajout du crédit gratuit:', error);
    throw new Error('Impossible d\'ajouter le crédit gratuit');
  }
};

export const initializeUserCredits = async (userId: string) => {
  // Vérifier si l'utilisateur a déjà une entrée dans la table des crédits
  const { data: existingCredits } = await supabase
    .from('user_credits')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (!existingCredits) {
    // Créer une nouvelle entrée avec 2 crédits initiaux
    const { error } = await supabase
      .from('user_credits')
      .insert({
        user_id: userId,
        credits_remaining: 2,
        last_free_credit_date: new Date().toISOString()
      });

    if (error) {
      console.error('Erreur lors de l\'initialisation des crédits:', error);
      throw new Error('Impossible d\'initialiser les crédits utilisateur');
    }
  }
};

export const logApiUsage = async (userId: string, operationType: string) => {
  const { error } = await supabase
    .from('api_usage')
    .insert({
      user_id: userId,
      operation_type: operationType,
      timestamp: new Date().toISOString()
    });

  if (error) {
    console.error('Erreur lors de l\'enregistrement de l\'utilisation de l\'API:', error);
    // Ne pas bloquer l'opération principale si l'enregistrement échoue
  }
};
