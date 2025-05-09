"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { Loader } from "@/components/loading";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useUser } from "@/context/UserContext";

type FormData = { email: string; password: string };
type FormErrors = { email?: string; password?: string; general?: string };

export default function Login() {
  const { refreshUser } = useUser();
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!form.email) {
      newErrors.email = "L'email est requis.";
    } else if (!form.email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      newErrors.email = "Adresse email invalide.";
    }
    if (!form.password) {
      newErrors.password = "Le mot de passe est requis.";
    } else if (form.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères.";
    } else if (!form.password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[ \]{};':"\\|,.<>/?-]).*$/)) {
      newErrors.password =
        "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial";
    }
    return newErrors;
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setMessage(null);
      return;
    }
    setErrors({});
    setMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch("https://bloghub-8ljb.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Connexion réussie.");
        // Cookies.set("token", data.access_token, { expires: 7 });
        // Rafraîchir le contexte utilisateur AVANT de rediriger
        if (typeof window !== "undefined") {
          await refreshUser();
        }
        router.push("/");
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else if (data.message) {
          setErrors({ general: data.message });
        } else {
          setErrors({ general: "Erreur inconnue." });
        }
      }
    } catch {
      setErrors({ general: "Erreur lors de la connexion au serveur." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full p-6 shadow-md rounded-md bg-white">
        <h1 className="text-2xl font-bold text-center mb-4 text-[#FC4308]">
          Connexion
        </h1>
        <p className="text-center mb-4 text-[#3E3232]">
          Veuillez entrer vos informations de connexion
        </p>

        {(message || errors.general) && (
          <div
            className={`mb-4 p-2 rounded ${
              message ? "text-white bg-green-500" : "text-red-800 bg-red-200"
            }`}
          >
            {message || errors.general}
          </div>
        )}

        {isLoading ? (
          <Loader />
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-[#3E3232]"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                className="mt-2 block text-black py-2 px-2 w-full rounded-md border border-gray-300 focus:border-[#FC4308] focus:outline-none sm:text-sm"
                placeholder="Votre email"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-[#3E3232]"
              >
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                  className="mt-2 block text-black py-2 px-2 w-full rounded-md border border-gray-300 focus:border-[#FC4308] focus:outline-none sm:text-sm"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-2 flex items-center text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full font-semibold bg-[#FC4308] hover:bg-[#d44717] text-white py-2 px-4 rounded-md shadow  transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC4308]"
              disabled={isLoading}
            >
              Se connecter
            </button>
          </form>
        )}

        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="text-sm text-[#FC4308] hover:underline">
            Mots de passe oublié ?
          </Link>
        </div>

        <p className="mt-4 text-center text-md font-semibold text-[#3E3232]">
          Pas encore inscrit ?{" "}
          <Link
            href="/register"
            className="text-[#FC4308] hover:underline ml-1"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
