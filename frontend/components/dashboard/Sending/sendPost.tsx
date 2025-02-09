import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function SendPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState("DRAFT");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      const res = await fetch("http://localhost:3001/user/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3001/categories");
        if (!response.ok)
          throw new Error("Erreur de chargement des catégories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (status) => {
    if (!user) return;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("authorId", user.id);
    formData.append("categoryId", category);
    formData.append("status", status);
    if (image) formData.append("image", image);

    const response = await fetch("http://localhost:3001/articles", {
      method: "POST",
      body: formData,
    });

    if (response.ok) router.push("/dashboard");
  };

  if (loading) return <p>Chargement des catégories...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Créer un Article</h2>
      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <textarea
        placeholder="Contenu"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-full p-2 border rounded mb-2"
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="">Sélectionner une catégorie</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="DRAFT">Brouillon</option>
        <option value="PUBLISHED">Publié</option>
      </select>
      {preview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h3 className="font-bold text-xl mb-2">{title}</h3>
            <p className="mb-4">{content}</p>
            <button
              onClick={() => setPreview(false)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setPreview(true)}
        className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
      >
        Prévisualiser
      </button>
      <button
        onClick={() => handleSubmit("DRAFT")}
        className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
      >
        Enregistrer en Brouillon
      </button>
      <button
        onClick={() => handleSubmit("PUBLISHED")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Publier
      </button>
    </div>
  );
}
