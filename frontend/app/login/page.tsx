"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader } from "@/components/loading";
import Cookies from "js-cookie";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrors([]);

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",

        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (res.ok) {
        Cookies.set("token", String(data.access_token), {
          expires: 7,
        });
        // localStorage.setItem("token", data.access_token);

        // Redirige l'utilisateur vers le dashboard ou la page d'accueil
        setIsLoading(true);
        setTimeout(() => {
          router.push("/");
        }, 3500);
      } else {
        if (Array.isArray(data.message)) {
          setErrors(data.message);
        } else {
          console.log(data.message);
          setErrors(["Identifiants incorrects."]);
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
              Connexion
            </h1>

            {errors.length > 0 && (
              <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
                {errors.map((err, index) => (
                  <p key={index}>{err}</p>
                ))}
              </div>
            )}

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
                  onChange={handleChange}
                  name="email"
                  id="email"
                  className="mt-2 block text-black py-[.5rem] px-2 w-full rounded-md border border-gray focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Votre email"
                  required
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
                  name="password"
                  onChange={handleChange}
                  id="password"
                  className="mt-2 block text-black py-[.5rem] px-2 w-full rounded-md border border-gray focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Votre mot de passe"
                  required
                />{" "}
              </div>

              <button
                type="submit"
                className="w-full font-semibold bg-[#FC4308] text-white py-2 px-4 rounded-md shadow hover:bg-[#d44717] transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Se connecter
              </button>
            </form>

            <p className="mt-4 text-center text-md font-semibold text-[#3E3232]">
              Pas encore inscrit ?
              <Link
                href="/register"
                className="text-[#FC4308] hover:underline ml-1"
              >
                Créer un compte
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
