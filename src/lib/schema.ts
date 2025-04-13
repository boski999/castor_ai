import { z } from 'zod';

// Schéma pour le formulaire d'inscription
export const registerSchema = z.object({
  email: z.string().email('Veuillez entrer une adresse email valide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
});

// Schéma pour le formulaire de connexion
export const loginSchema = z.object({
  email: z.string().email('Veuillez entrer une adresse email valide'),
  password: z.string().min(1, 'Veuillez entrer votre mot de passe')
});

// Schéma pour le formulaire de création/édition de personnage
export const childFormSchema = z.object({
  name: z.string().min(1, 'Le prénom est requis'),
  age: z.number().min(3, 'L\'âge minimum est 3 ans').max(10, 'L\'âge maximum est 10 ans'),
  gender: z.enum(['male', 'female']),
  appearance: z.object({
    hairColor: z.string().min(1, 'La couleur des cheveux est requise'),
    hairStyle: z.string().min(1, 'Le style de cheveux est requis'),
    eyeColor: z.string().min(1, 'La couleur des yeux est requise'),
    skinTone: z.string().min(1, 'Le teint de peau est requis'),
    height: z.string().min(1, 'La taille est requise'),
    specialFeature: z.string().optional()
  }),
  interests: z.array(z.string()).min(1, 'Au moins un centre d\'intérêt est requis'),
  personality: z.array(z.string()).min(1, 'Au moins un trait de personnalité est requis')
});

// Schéma pour le formulaire de création d'histoire
export const storyFormSchema = z.object({
  characterId: z.string().uuid('ID de personnage invalide'),
  theme: z.enum(['adventure', 'animals', 'educational']),
  pageCount: z.number().min(5, 'Minimum 5 pages').max(20, 'Maximum 20 pages')
});

// Schéma pour le formulaire de commande
export const orderFormSchema = z.object({
  bookId: z.string().uuid('ID de livre invalide'),
  format: z.enum(['pdf', 'softcover', 'hardcover']),
  quantity: z.number().min(1, 'Minimum 1 exemplaire').default(1),
  shippingAddress: z.object({
    fullName: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional()
  }).optional()
});

// Types dérivés des schémas
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ChildFormData = z.infer<typeof childFormSchema>;
export type StoryFormData = z.infer<typeof storyFormSchema>;
export type OrderFormData = z.infer<typeof orderFormSchema>;

// Schéma pour le système de crédits
export const creditPurchaseSchema = z.object({
  userId: z.string().uuid('ID utilisateur invalide'),
  amount: z.number().min(1, 'Minimum 1 crédit'),
  paymentMethod: z.enum(['card', 'paypal']),
});

export type CreditPurchaseData = z.infer<typeof creditPurchaseSchema>;
