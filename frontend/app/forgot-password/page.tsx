'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      // Replace with your actual API endpoint if different
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/request-password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Un problème est survenu lors de la demande de réinitialisation du mot de passe.');
      }

      setMessage(data.message || 'Si un compte avec cet e-mail existe, un lien de réinitialisation de mot de passe a été envoyé.');
      setEmail(''); // Clear email field on success
    } catch (err: unknown) {
      let errorMessage = 'Échec de l\'envoi de l\'e-mail de réinitialisation du mot de passe. Veuillez réessayer.';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object' && 'message' in err && typeof (err as { message: unknown }).message === 'string') {
        errorMessage = (err as { message: string }).message;
      }
      setError(errorMessage);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Mot de passe oublié ?
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Pas de problème ! Entrez votre adresse e-mail ci-dessous et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Adresse e-mail
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-[#FC4308] focus:border-[#FC4308] focus:z-10 sm:text-sm"
                placeholder="Entrez votre adresse e-mail"
              />
            </div>
          </div>

          {message && (
            <div className="bg-green-50 dark:bg-green-700 border-l-4 border-green-400 dark:border-green-500 p-4">
              <p className="text-sm text-green-700 dark:text-green-100">{message}</p>
            </div>
          )}
          {error && (
            <div className="bg-red-50 dark:bg-red-700 border-l-4 border-red-400 dark:border-red-500 p-4">
              <p className="text-sm text-red-700 dark:text-red-100">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FC4308] hover:bg-[#d44717] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC4308] disabled:opacity-60 dark:focus:ring-offset-gray-800"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Envoyer l\'e-mail de réinitialisation'
              )}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm">
            <Link href="/login" className="font-medium text-black hover:text-[#FC4308] dark:text-indigo-400 dark:hover:text-indigo-300">
              Vous vous souvenez de votre mot de passe ? Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
