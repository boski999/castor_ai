'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import RegisterForm from '@/components/RegisterForm';
import { useUser } from '@/context/UserContext';

export default function Register() {
  const router = useRouter();
  const { signUp } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(undefined);

    try {
      await signUp(data.email, data.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inscription</h1>
        <p className="mt-2 text-gray-600">
          Créez un compte pour commencer à créer des histoires personnalisées
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <RegisterForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link href="/login" className="text-indigo-600 hover:text-indigo-500">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
