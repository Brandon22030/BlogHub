"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { NavBar } from "@/components/navBar";
import NotificationToast from "@/components/notifications/NotificationToast";
import { useToast } from "@/components/notifications/useToast";
// useToast importé uniquement ici, pas dans CategoryCreateForm

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
}

// Formulaire de création de catégorie
function CategoryCreateForm({
  onCreated,
  showToast,
}: {
  onCreated?: (cat: Category) => void;
  showToast: (args: {
    title: string;
    message: string;
    type?: "success" | "error";
  }) => void;
}) {
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // utilisé uniquement si nécessaire
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = typeof window !== "undefined" ? Cookies.get("token") : null;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Drag & Drop handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image")) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageUrl("");
    }
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  // File input classic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image")) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImageUrl("");
    }
  };

  // Upload image to backend (simulate if no endpoint)
  const uploadImage = async (file: File): Promise<string | null> => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_URL}/articles/images/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLoading(false);
      return data.secure_url || data.url || data.imageUrl || null;
    } catch {
      showToast({
        title: "Erreur",
        message: "Erreur upload image",
        type: "error",
      });
      setLoading(false);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast({
        title: "Erreur",
        message: "Le nom est requis.",
        type: "error",
      });
      return;
    }
    setLoading(true);
    let finalImageUrl = imageUrl;
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (!uploadedUrl) {
        showToast({
          title: "Erreur",
          message:
            "Erreur lors de l'upload vers Cloudinary. Vérifie ta connexion ou le format du fichier.",
          type: "error",
        });
        setLoading(false);
        return;
      }
      finalImageUrl = uploadedUrl;
    }
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, imageUrl: finalImageUrl }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      showToast({
        title: "Succès",
        message: "Catégorie créée !",
        type: "success",
      });
      setName("");
      setImageUrl("");
      setImageFile(null);
      setPreviewUrl("");
      if (onCreated) onCreated(data);
    } catch {
      showToast({ title: "Erreur", message: "Erreur lors de la création." });
    }
    setLoading(false);
  };

  return (
    <>
      <form
        className="flex flex-col md:flex-row gap-3 items-end mb-4"
        onSubmit={handleSubmit}
      >
        <div className="flex-1">
          <label className="block text-xs text-neutral-500 mb-1">Nom</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Nom de la catégorie"
            disabled={loading}
          />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <label className="block text-xs text-neutral-500 mb-1">Image</label>
          <div
            className={`border-2 ${isDragging ? "border-blue-400 bg-blue-50" : "border-dashed border-neutral-300"} rounded flex flex-col items-center justify-center py-4 cursor-pointer transition mb-1`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById("cat-image-input")?.click()}
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="preview"
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded mb-2"
              />
            ) : (
              <span className="text-neutral-400">
                Glisse une image ici ou clique pour choisir
              </span>
            )}
            <input
              id="cat-image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value);
              setImageFile(null);
              setPreviewUrl("");
            }}
            className="border rounded px-3 py-2 w-full"
            placeholder="Ou colle une URL d'image"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold"
          disabled={loading}
        >
          {loading ? "Création..." : "Créer"}
        </button>
      </form>
    </>
  );
}
export default function AdminPage() {
  const { toast, showToast, hideToast } = useToast();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  // Ajoute la nouvelle catégorie en haut de la liste
  const handleCategoryCreated = (cat: Category) => {
    setCategories([cat, ...categories]);
  };
  const [users, setUsers] = useState<User[]>([]);

  // UI State pour l'édition inline
  const [editCatId, setEditCatId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatSlug, setEditCatSlug] = useState("");
  const [editCatImage, setEditCatImage] = useState("");
  const [editCatFile, setEditCatFile] = useState<File | null>(null);
  const [roleLoading, setRoleLoading] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  // Toast animation CSS (Tailwind + custom)
  // Add this to your global.css if not present:
  // .animate-toast-in { animation: toastIn 0.4s cubic-bezier(0.42,0,0.58,1); }
  // @keyframes toastIn { from { opacity:0; transform: translateY(-16px) scale(0.98);} to { opacity:1; transform: none;} }

  // TODO: Replace with your auth logic to get JWT token
  const token = typeof window !== "undefined" ? Cookies.get("token") : null;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, userRes] = await Promise.all([
        fetch(`${API_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
          if (!res.ok) throw new Error("Erreur catégorie");
          return res.json();
        }),
        fetch(`${API_URL}/user`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
          if (!res.ok) throw new Error("Erreur utilisateur");
          return res.json();
        }),
      ]);
      setCategories(catRes);
      setUsers(userRes);
    } catch {
      showToast({
        title: "Erreur",
        message: "Erreur lors du chargement des données.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [token, showToast]);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }
    fetchData();
  }, [token, fetchData, router]);

  // Suppression d'utilisateur
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      const res = await fetch(`${API_URL}/user/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setUsers(users.filter((user) => user.id !== id));
      showToast({
        title: "Succès",
        message: "Utilisateur supprimé !",
        type: "error",
      });
    } catch {
      showToast({
        title: "Erreur",
        message: "Erreur lors de la suppression de l'utilisateur.",
        type: "error",
      });
    }
  };

  // Inline edit catégorie
  const startEditCategory = (cat: Category) => {
    setEditCatId(cat.id);
    setEditCatName(cat.name);
    setEditCatSlug(cat.slug);
    setEditCatImage(cat.imageUrl);
    setEditCatFile(null);
  };
  const cancelEditCategory = () => {
    setEditCatId(null);
    setEditCatName("");
    setEditCatSlug("");
    setEditCatImage("");
    setEditCatFile(null);
  };
  const handleEditCatFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image")) {
      setEditCatFile(file);
      setEditCatImage("");
    }
  };
  const saveEditCategory = async (id: string) => {
    try {
      let finalImageUrl = editCatImage;
      if (editCatFile) {
        // Réutilise la logique d'upload du formulaire de création
        const formData = new FormData();
        formData.append("file", editCatFile);
        const resUpload = await fetch(`${API_URL}/articles/images/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!resUpload.ok) throw new Error();
        const data = await resUpload.json();
        finalImageUrl = data.secure_url || data.url || data.imageUrl || "";
      }
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editCatName,
          slug: editCatSlug,
          imageUrl: finalImageUrl,
        }),
      });
      if (!res.ok) throw new Error();
      setCategories(
        categories.map((c) =>
          c.id === id
            ? {
                ...c,
                name: editCatName,
                slug: editCatSlug,
                imageUrl: finalImageUrl,
              }
            : c,
        ),
      );
      showToast({
        title: "Succès",
        message: "Catégorie modifiée !",
        type: "success",
      });
      cancelEditCategory();
    } catch {
      showToast({
        title: "Erreur",
        message: "Erreur lors de la modification.",
        type: "error",
      });
    }
  };

  // Changement de rôle utilisateur
  const handleRoleChange = async (id: string, newRole: "USER" | "ADMIN") => {
    setRoleLoading(id);
    try {
      const res = await fetch(`${API_URL}/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error();
      setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
      showToast({
        title: "Succès",
        message: "Rôle modifié !",
        type: "success",
      });
    } catch {
      showToast({
        title: "Erreur",
        message: "Erreur lors du changement de rôle.",
        type: "error",
      });
    }
    setRoleLoading(null);
  };

  // Suppression de catégorie
  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${Cookies.get("token")}` },
      });
      if (!res.ok) throw new Error();
      setCategories(categories.filter((cat) => cat.id !== id));
      showToast({
        title: "Succès",
        message: "Catégorie supprimée !",
        type: "error",
      });
    } catch {
      showToast({
        title: "Erreur",
        message: "Erreur lors de la suppression de la catégorie.",
        type: "error",
      });
    }
  };

  return (
    <>
      <NotificationToast
        title={toast.title}
        message={toast.message}
        visible={toast.visible}
        onClose={hideToast}
        type={toast.type}
      />
      <NavBar />

      <div
        className="min-h-screen bg-white px-4 py-8 md:p-12"
        style={{ color: "#111", maxWidth: 900, margin: "auto" }}
      >
        <h1 className="text-3xl font-bold mb-8 text-center">Administration</h1>
        {/* Catégories */}
        <div className="rounded-xl shadow border border-neutral-200 mb-12 overflow-x-auto bg-white p-6">
          {/* Formulaire création catégorie */}
          <CategoryCreateForm
            onCreated={handleCategoryCreated}
            showToast={showToast}
          />
          <table className="w-full text-sm text-left mt-6">
            <thead className="bg-neutral-50">
              <tr>
                <th className="py-3 px-4">Nom</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b hover:bg-neutral-50">
                  {editCatId === cat.id ? (
                    <>
                      <td className="py-2 px-4">
                        <input
                          value={editCatName}
                          onChange={(e) => setEditCatName(e.target.value)}
                          className="border rounded px-2 py-1 w-full mb-1"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          value={editCatSlug}
                          onChange={(e) => setEditCatSlug(e.target.value)}
                          className="border rounded px-2 py-1 w-full mb-1"
                          placeholder="slug"
                        />
                      </td>
                      <td className="py-2 px-4">
                        <input
                          value={editCatImage}
                          onChange={(e) => setEditCatImage(e.target.value)}
                          className="border rounded px-2 py-1 w-full mb-1"
                          placeholder="URL image"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditCatFileChange}
                          className="mt-1"
                        />
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                          onClick={() => saveEditCategory(cat.id)}
                        >
                          Enregistrer
                        </button>
                        <button
                          className="bg-neutral-300 hover:bg-neutral-400 text-black px-3 py-1 rounded"
                          onClick={cancelEditCategory}
                        >
                          Annuler
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 px-4 font-medium">{cat.name}</td>
                      <td className="py-2 px-4 text-neutral-400">{cat.slug}</td>
                      <td className="py-2 px-4">
                        <Image
                          src={cat.imageUrl}
                          alt={cat.name}
                          width={48}
                          height={48}
                          className="rounded object-cover"
                          style={{ width: 48, height: 48 }}
                        />
                      </td>
                      <td className="py-2 px-4 flex gap-2">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                          onClick={() => startEditCategory(cat)}
                        >
                          Modifier
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          onClick={() =>
                            handleDeleteCategory(cat.id, cat.imageUrl)
                          }
                        >
                          Supprimer
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Utilisateurs */}
        <div className="rounded-xl shadow border border-neutral-200 overflow-x-auto bg-white">
          <table className="w-full text-sm text-left">
            <thead className="bg-neutral-50">
              <tr>
                <th className="py-3 px-4">Nom</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Rôle</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-neutral-50">
                  <td className="py-2 px-4 font-medium">{user.name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">
                    <select
                      className="border rounded px-2 py-1 bg-white"
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(
                          user.id,
                          e.target.value as "USER" | "ADMIN",
                        )
                      }
                      disabled={roleLoading === user.id}
                    >
                      <option value="USER">Utilisateur</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
