"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader } from "@/components/loading";
import { Eye, EyeOff } from "lucide-react";


interface RegisterFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors: RegisterFormErrors = {};

    if (!form.name) newErrors.name = "Le nom est requis.";

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
        "Le mot de passe doit contenir au moins : une majuscule, une minuscule, un chiffre et un caractère spécial.";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("https://bloghub-8ljb.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Inscription réussie ! Veuillez vérifier votre e-mail.");
        setTimeout(() => router.push("/login"), 3000);
      } else if (data.message === "Cet email est déjà utilisé") {
        setErrors({ email: "Cet email est déjà utilisé." });
      } else if (data.message) {
        const errObj = Array.isArray(data.message)
          ? data.message.reduce((acc: RegisterFormErrors, msg: string) => {
              const [field, msgText] = msg.split(":");
              if (field && msgText) {
                const key = field.trim() as keyof RegisterFormErrors;
                acc[key] = msgText.trim();
              }
              return acc;
            }, {} as RegisterFormErrors)
          : { general: data.message };
        setErrors(errObj);
      } else {
        setErrors({ general: "Une erreur est survenue." });
      }
    } catch (err) {
      console.error("Erreur:", err);
      setErrors({ general: "Erreur lors de la connexion au serveur." });
    } finally {
      setIsLoading(false);
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

            {message && (
              <p className="text-white bg-green-500 p-2 rounded-md mb-2 text-center text-sm">
                {message}
              </p>
            )}
            {errors.general && (
              <p className="text-red-500 mb-4 text-sm text-center">
                {errors.general}
              </p>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Nom */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-bold text-[#3E3232]"
                >
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2 block text-black py-2 px-2 w-full rounded-md border border-gray focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Votre nom"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
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
                  className="mt-2 block text-black py-2 px-2 w-full rounded-md border border-gray focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Votre email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Mot de passe */}
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
                    className="mt-2 block text-black py-2 px-2 w-full rounded-md border border-gray focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Votre mot de passe"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-bold text-[#3E3232]"
                >
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="mt-2 block text-black py-2 px-2 w-full rounded-md border border-gray focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Confirmez votre mot de passe"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-2 flex items-center text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#FC4308] hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-md"
              >
                Créer un compte
              </button>

              <p className="text-center text-sm mt-4 text-black">
                Vous avez déjà un compte ?{" "}
                <Link
                  href="/login"
                  className="text-[#FC4308] font-medium hover:underline"
                >
                  Connexion
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
