'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');
            if (!token) {
                setMessage("Token invalide ou manquant.");
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:3001/auth/verify-email?token=${token}`);
                const data = await response.json();
                setMessage(data.message);
                setIsSuccess(response.ok);
            } catch (error) {
                setMessage("Une erreur est survenue. Veuillez réessayer plus tard.");
            } finally {
                setIsLoading(false);
                if (isSuccess) {
                    setTimeout(() => router.push('/login'), 3000);
                }
            }
        };

        verifyEmail();
    }, [searchParams, router, isSuccess]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="max-w-lg w-full p-8 bg-white rounded-2xl shadow-xl">
                {isLoading ? (
                    <div className="flex flex-col items-center">
                        <Loader2 className="animate-spin h-12 w-12 text-[#FC4308]" />
                        <h1 className="mt-6 text-xl font-semibold text-gray-700">Vérification en cours...</h1>
                    </div>
                ) : (
                    <div className="text-center">
                        <h1 className={`text-2xl font-bold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                            {message}
                        </h1>
                        {isSuccess ? (
                            <p className="mt-4 text-gray-600">Vous serez redirigé vers la page de connexion...</p>
                        ) : (
                            <p className="mt-4 text-gray-600">Veuillez vérifier votre lien ou contacter le support.</p>
                        )}
                        <button
                            onClick={() => router.push('/login')}
                            className="mt-6 px-6 py-2 text-white bg-[#FC4308] hover:bg-[FC4308] rounded-lg transition duration-300"
                        >
                            Retour à la connexion
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
