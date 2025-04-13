'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoginForm from '@/components/LoginForm';
import { useUser } from '@/context/UserContext';

export default function Login() {
  const router = useRouter();
  const { signIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    setError(undefined);

    try {
      await signIn(data.email, data.password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Connexion</h1>
        <p className="mt-2 text-gray-600">
          Connectez-vous pour accéder à votre compte
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Vous n'avez pas de compte ?{' '}
            <Link href="/register" className="text-indigo-600 hover:text-indigo-500">
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
