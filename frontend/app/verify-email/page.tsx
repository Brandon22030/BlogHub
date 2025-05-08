"use client";
import { Suspense, useEffect, useState } from "react"; // Ajout de Suspense
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Le contenu original de la page est déplacé dans ce composant
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setMessage("Token invalide ou manquant.");
        setIsLoading(false);
        return;
      }

            let apiResponse: globalThis.Response | null = null; // Déclarer response ici
      try {
        apiResponse = await fetch( // Assigner la réponse ici
          `https://bloghub-8ljb.onrender.com/auth/verify-email?token=${token}`,
        );
        const data = await apiResponse.json();
        setMessage(data.message);
        setIsSuccess(apiResponse.ok);
      } catch {
        setMessage("Une erreur est survenue. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
        if (apiResponse && apiResponse.ok) { // Maintenant 'response' est accessible
          setTimeout(() => router.push("/login"), 3000);
        }
      }
    };

    verifyEmail();
    // Retrait de isSuccess des dépendances pour éviter des re-render infinis potentiels
    // ou des comportements inattendus liés à sa mise à jour dans le finally.
  }, [searchParams, router]); 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-lg w-full p-8 bg-white rounded-2xl shadow-xl">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin h-12 w-12 text-[#FC4308]" />
            <h1 className="mt-6 text-xl font-semibold text-gray-700">
              Vérification en cours...
            </h1>
          </div>
        ) : (
          <div className="text-center">
            <h1
              className={`text-2xl font-bold ${isSuccess ? "text-green-600" : "text-red-600"}`}
            >
              {message}
            </h1>
            {isSuccess ? (
              <p className="mt-4 text-gray-600">
                Vous serez redirigé vers la page de connexion...
              </p>
            ) : (
              <p className="mt-4 text-gray-600">
                Veuillez vérifier votre lien ou contacter le support.
              </p>
            )}
            <button
              onClick={() => router.push("/login")}
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

// Nouveau composant de page qui utilise Suspense
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={ // Fallback pour Suspense
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="max-w-lg w-full p-8 bg-white rounded-2xl shadow-xl">
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin h-12 w-12 text-[#FC4308]" />
            <h1 className="mt-6 text-xl font-semibold text-gray-700">
              Chargement...
            </h1>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
