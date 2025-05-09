'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams();
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  useEffect(() => {
    if (params?.token) {
      setToken(Array.isArray(params.token) ? params.token[0] : params.token);
    }
  }, [params]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError('Les mots de passe ne correspondent pas.');
      setIsLoading(false);
      return;
    }

    if (!token) {
      setError('Le jeton est manquant. Veuillez demander un nouveau lien de réinitialisation de mot de passe.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword, confirmNewPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Un problème est survenu lors de la réinitialisation de votre mot de passe.');
      }

      setMessage(data.message || 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.');
      setNewPassword('');
      setConfirmNewPassword('');
      // Optionally redirect to login page after a delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Échec de la réinitialisation du mot de passe. Veuillez réessayer ou demander un nouveau lien.");
      }
    }
    setIsLoading(false);
  };

  if (!token && !params?.token) {
    // This case handles if the page is accessed without a token in the URL directly
    // or if the token isn't picked up by useEffect yet.
    // We show a more generic message or a loader if params.token exists but token state isn't set yet.
    let content = (
      <>
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Jeton invalide ou manquant</h2>
        <p className="text-gray-700 dark:text-gray-300">Le jeton de réinitialisation du mot de passe est manquant ou invalide. Veuillez demander un nouveau lien de réinitialisation.</p>
        <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
          Demander un nouveau lien
        </Link>
      </>
    );

    if (params?.token && !token) {
        // If params.token exists, it means token is likely being set. Show loading or a specific message.
        content = <p className="text-gray-700 dark:text-gray-300">Chargement du jeton...</p>;
    }

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl text-center">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Réinitialiser votre mot de passe
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Entrez votre nouveau mot de passe ci-dessous.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="new-password" className="sr-only">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  id="new-password"
                  name="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pr-10"
                  placeholder="Nouveau mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="confirm-new-password" className="sr-only">
                Confirmer le nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  id="confirm-new-password"
                  name="confirmNewPassword"
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm pr-10"
                  placeholder="Confirmer le nouveau mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {showConfirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
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
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 dark:focus:ring-offset-gray-800"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Réinitialiser le mot de passe'
              )}
            </button>
          </div>
        </form>
        {message && (
            <div className="mt-6 text-center">
                <p className="text-sm">
                    <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Retour à la connexion
                    </Link>
                </p>
            </div>
        )}
      </div>
    </div>
  );
}
