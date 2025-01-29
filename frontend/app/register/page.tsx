"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader } from "@/components/loading";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      router.push("/");
    }, 3500);
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center mb-4 text-[#FC4308]">
              Inscription
            </h1>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-[#3E3232]"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-2 block text-black py-[.5rem] px-2 w-full rounded-md border border-gray focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Votre email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-[#3E3232]"
                >
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  className="mt-2 block text-black py-[.5rem] px-2 w-full rounded-md border border-gray focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Votre mot de passe"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-bold text-[#3E3232]"
                >
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  id="confirm-password"
                  className="mt-2 block text-black py-[.5rem] px-2 w-full rounded-md border border-gray focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Confirmez votre mot de passe"
                />
              </div>

              <button
                type="submit"
                className="w-full font-semibold bg-[#FC4308] text-white py-2 px-4 rounded-md shadow hover:bg-[#d44717] transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                S'inscrire
              </button>
            </form>

            <p className="mt-4 text-center text-md font-semibold text-[#3E3232]">
              Déjà un compte ?
              <Link
                href="/login"
                className="text-[#FC4308] hover:underline ml-1"
              >
                Se connecter
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
