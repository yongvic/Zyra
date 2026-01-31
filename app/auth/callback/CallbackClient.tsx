'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';

export default function CallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setError('Token manquant.');
      return;
    }

    const run = async () => {
      try {
        localStorage.setItem('token', token);
        const me = await api.users.me();
        localStorage.setItem('user', JSON.stringify(me));
        router.replace('/dashboard');
      } catch (e: any) {
        localStorage.removeItem('token');
        setError(e?.message || "Échec de l'authentification.");
      }
    };

    run();
  }, [router, searchParams]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full p-6 rounded-xl border bg-white">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Connexion</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="animate-spin text-4xl mb-4">💕</div>
        <p className="text-gray-600">Connexion en cours...</p>
      </div>
    </main>
  );
}

