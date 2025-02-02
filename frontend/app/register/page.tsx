"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader } from "@/components/loading";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    // Vérification du mot de passe
    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setError("");

    try {
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.access_token);

        console.log("Inscription réussie : ", data);

        setIsLoading(true);
        setTimeout(() => {
          router.push("/login");
        }, 3500);
      } else {
        if (Array.isArray(data.message)) {
          setErrors(data.message); // Stocke les erreurs retournées par le backend
        } else {
          setErrors(["Une erreur est survenue."]);
        }
      }
    } catch (error) {
      setErrors(["Erreur lors de la connexion au serveur."]);
    }
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

            {errors.length > 0 && (
              <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
                {errors.map((err, index) => (
                  <p key={index}>{err}</p>
                ))}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {" "}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-bold text-[#3E3232]"
                >
                  Nom
                </label>
                <input
                  type="text"
                  id="name"
                  onChange={handleChange}
                  name="name"
                  className="mt-2 block text-black py-[.5rem] px-2 w-full rounded-md border border-gray focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Votre nom"
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name[0]}</p>
                )}
              </div>
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
                  onChange={handleChange}
                  name="email"
                  className="mt-2 block text-black py-[.5rem] px-2 w-full rounded-md border border-gray focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Votre email"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email[0]}</p>
                )}
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
                  name="password"
                  onChange={handleChange}
                  className="mt-2 block text-black py-[.5rem] px-2 w-full rounded-md border border-gray focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Votre mot de passe"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password[0]}</p>
                )}
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
                  name="confirmPassword"
                  onChange={handleChange}
                  className="mt-2 block text-black py-[.5rem] px-2 w-full rounded-md border border-gray focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Confirmez votre mot de passe"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500">{errors.confirmPassword[0]}</p>
                )}
              </div>
              {error && <p style={{ color: "red" }}>{error}</p>}
              {errors.general && (
                <p className="text-red-500">{errors.general[0]}</p>
              )}
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
