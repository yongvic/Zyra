import React, { Suspense } from 'react';
import CallbackClient from './CallbackClient';

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">💕</div>
            <p className="text-gray-600">Connexion en cours...</p>
          </div>
        </main>
      }
    >
      <CallbackClient />
    </Suspense>
  );
}

