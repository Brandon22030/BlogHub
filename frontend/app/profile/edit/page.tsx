"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import Breadcrumbs from "@/components/breadcrumbs";
import { NavBar } from "@/components/navBar";

export default function EditProfile() {
  // Champs utilisateur simplifiés
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // Pour prévisualisation
  const [imageFile, setImageFile] = useState<File | null>(null); // Pour upload
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const token = Cookies.get("token");
  const { refreshUser } = useUser();

  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }
    const fetchUserProfile = async () => {
      try {
        const res = await fetch("http://localhost:3001/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok)
          throw new Error("Erreur lors de la récupération du profil.");
        const data = await res.json();
        setUserName(data.userName || data.name || "");
        setEmail(data.email || "");
        setImageUrl(data.imageUrl || "");
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("email", email);
      formData.append("oldPassword", oldPassword);
      formData.append("password", password);
      if (imageFile) {
        formData.append("image", imageFile);
      }
      const res = await fetch("http://localhost:3001/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        let errorMsg = "Erreur lors de la mise à jour du profil.";
        try {
          const errorData = await res.json();
          if (errorData && errorData.message) {
            errorMsg = errorData.message;
          } else if (typeof errorData === "string") {
            errorMsg = errorData;
          }
        } catch {}
        throw new Error(errorMsg);
      }
      // Met à jour le cookie token si la réponse contient un nouveau token
      try {
        const data = await res.json();
        if (data.token) {
          Cookies.set("token", data.token);
          refreshUser(); // Mets à jour le contexte utilisateur global
        }
      } catch {}
      setSuccess("Profil mis à jour avec succès !");
      setTimeout(() => router.push("/profile"), 1200);
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    }
  };

  // Gérer l'upload d'image et l'aperçu
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-[#FC4308] font-bold text-lg">
          Chargement du profil...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <NavBar />
      <Breadcrumbs />
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md mt-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block mb-1 font-semibold text-black">
              User Name
            </label>
            <input
              className="border rounded-lg p-2 w-full text-black"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-black">Email</label>
            <input
              className="border rounded-lg p-2 w-full text-black"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block mb-1 font-semibold text-black">
              Old Password
            </label>
            <input
              className="border rounded-lg p-2 w-full text-black"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-black">
              Password
            </label>
            <input
              className="border rounded-lg p-2 w-full text-black"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-black">
            Add Image
          </label>
          <div className="border-2 border-dashed rounded-lg p-4 bg-gray-50 flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              className="mb-2 text-black"
              onChange={handleImageChange}
            />
            {imageUrl && (
              <Image
                src={imageUrl}
                alt="profile preview"
                width={100}
                height={100}
                className="rounded-xl mt-2"
              />
            )}
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="flex items-center gap-2 bg-[#F81539] text-white font-bold py-2 px-8 rounded-lg hover:bg-[#d91432] transition"
          >
            Save
          </button>
        </div>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </form>
    </div>
  );
}
