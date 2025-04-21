import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

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

export default function AdminPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace with your auth logic to get JWT token
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }
    fetchData();
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, userRes] = await Promise.all([
        axios.get("/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setCategories(catRes.data);
      setUsers(userRes.data);
    } catch (err: any) {
      setError("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une catégorie
  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    try {
      await axios.delete(`/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression de la catégorie.");
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`/api/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression de l'utilisateur.");
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: 32 }}>
      <h1>Admin - Gestion des catégories</h1>
      {/* Catégories */}
      <table
        border={1}
        cellPadding={8}
        style={{ marginBottom: 32, width: "100%" }}
      >
        <thead>
          <tr>
            <th>Nom</th>
            <th>Slug</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>{cat.slug}</td>
              <td>
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  style={{ width: 50, height: 50 }}
                />
              </td>
              <td>
                <button>Modifier</button>
                <button onClick={() => handleDeleteCategory(cat.id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Utilisateurs</h2>
      <table border={1} cellPadding={8} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button>Changer rôle</button>
                <button onClick={() => handleDeleteUser(user.id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
