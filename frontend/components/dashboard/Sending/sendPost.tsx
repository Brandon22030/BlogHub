import React, { useState, useEffect, useRef } from "react";
// JWT is managed by httpOnly cookie, no js-cookie needed.
import Image from "next/image";
import { SendPulse } from "./send";
import Loader from "./Loader";

// Définition des interfaces
interface User {
  id: string;
  name?: string;
  // Ajoutez d'autres champs si nécessaire, par exemple email, role
}

interface Category {
  id: string;
  name: string;
  // Ajoutez d'autres champs si nécessaire
}
/**
 * SendPost component for BlogHub dashboard.
 * Provides a form for creating and submitting a new blog post, including image upload and category selection.
 * @returns JSX.Element - The post creation form and logic
 */
export default function SendPost() {
  const [title, setTitle] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [preview, setPreview] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const editorRef = useRef<HTMLDivElement | null>(null);

  // No token needed, use credentials: 'include'.

  useEffect(() => {
    const fetchUserProfile = async () => {
      // if (!token) return; // Supprimé car le token est géré par httpOnly cookie

      const res = await fetch("https://bloghub-8ljb.onrender.com/user/profile", {
        method: "GET",
        credentials: "include", // Assure l'envoi des cookies
      });

      if (res.ok) {
        const data = await res.json();
        console.log("User profile data from API:", data); // DEBUG: Inspect user profile data
        setUser(data);
      } else {
        // Optionnel: Gérer le cas où le profil n'est pas récupéré (par exemple, si le cookie n'est pas valide ou expiré)
        console.error("Failed to fetch user profile, status:", res.status);
        setError(
          "Impossible de récupérer le profil utilisateur. Veuillez vous reconnecter."
        );
        // Potentiellement rediriger vers la page de connexion si res.status est 401 ou 403
        // if (res.status === 401 || res.status === 403) router.push('/login');
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://bloghub-8ljb.onrender.com/categories");
        if (!response.ok)
          throw new Error("Erreur de chargement des catégories");
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        if (err instanceof Error) { setError(err.message); } else { setError("Une erreur inconnue s'est produite lors du chargement des catégories"); }
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const uploadResponse = await fetch(
      "https://bloghub-8ljb.onrender.com/articles/images/upload",
      {
        method: "POST",
        credentials: "include",
        body: formData,
      }
    );
    if (uploadResponse.ok) {
      const uploadData = await uploadResponse.json();
      console.log("Cloudinary uploadData:", uploadData);
      setImageUrl(uploadData.secure_url || uploadData.filePath);
    }
    setIsUploading(false);
  };

  // Fonction pour gérer le drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const formatText = (command: string) => {
    if (command === "createLink") {
      insertLink();
    } else {
      document.execCommand(command, false, undefined);
    }
  };

  const changeColor = () => {
    const color = prompt("Entrez une couleur (ex: red, #ff0000) :");
    document.execCommand("foreColor", false, color ?? undefined);
  };

  const insertLink = () => {
    const url = prompt("Entrez l'URL du lien :");
    if (url) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("target", "_blank");
        link.style.textDecoration = "underline"; // Ajout du soulignement
        link.style.transition = "color 0.3s"; // Transition pour l'effet de survol
        link.innerText = selection.toString();

        range.deleteContents(); // Supprime le texte sélectionné
        range.insertNode(link); // Insère le lien à la place du texte sélectionné
      }
    }
  };

  const alignText = (alignment: string) => {
    document.execCommand(alignment, false, undefined);
  };

  const handleSubmit = async (status: string) => {
    if (!user) return;

    console.log("Contenu envoyé :", editorRef.current?.innerHTML);

    const content = editorRef.current?.innerHTML.trim(); // Supprime les espaces inutiles
    if (!content || content === "<br>") {
      // Vérifie si c'est vide ou juste un saut de ligne
      alert("Le contenu ne peut pas être vide !");
      return;
    }

    const data = {
      title,
      content,
      authorId: user.id,
      categoryId: category,
      status,
      imageUrl,
    };

    const response = await fetch("https://bloghub-8ljb.onrender.com/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`, // Supprimé car le token est géré par httpOnly cookie
      },
      credentials: "include", // Ajouté pour assurer l'envoi des cookies d'authentification
      body: JSON.stringify(data),
    });

    if (response.ok) {
      window.location.reload();
    } else {
      const errorData = await response
        .json()
        .catch(() => ({
          message: "Erreur lors de la création de l'article, réponse non JSON.",
        }));
      console.error(
        "Article creation failed, status:",
        response.status,
        "data:",
        errorData
      );
      alert(
        `Erreur lors de la création de l'article: ${errorData.message || response.statusText}`
      );
    }
  };

  if (loading) return <SendPulse />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="text-black pt-10 pb-32 mx-20">
      <div className="flex min-h-screen gap-6">
        {/* FIRST PART */}
        <div className="items-center flex-auto">
          <div className="flex gap-6 mb-5">
            {/* TITLE INPUT */}
            <div className="w-1/2">
              <label htmlFor="title" className="font-semibold mb-4">
                Titre
              </label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full py-3 px-2 border border-gray-100 rounded-xl bg-[#F5F5F5] focus:outline-none focus:ring-0"
              />
            </div>

            {/* CATEGORIES INPUT */}
            <div className="w-1/2">
              <label htmlFor="categories" className="font-semibold mb-4">
                Choisir une catégorie
              </label>
              <select
                value={category}
                name="categories"
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-4 px-2 border-none rounded-xl bg-[#F5F5F5] text-gray-800 shadow-sm focus:outline-none focus:ring-0"
              >
                <option value=""></option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* TOOLBAR */}
          <div>
            <p className="font-semibold">Contenu de l&apos;article</p>
            <div className="shadow-lg p-5 rounded-xl border border-opacity-5">
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => formatText("bold")}
                  className="hover:bg-[#F81539] hover:text-white font-semibold transition duration-300 ease-in-out py-3 px-4 bg-gray-200 flex justify-center items-center gap-2 rounded-xl"
                >
                  B
                </button>
                <button
                  onClick={() => formatText("italic")}
                  className="hover:bg-[#F81539] hover:text-white font-semibold transition duration-300 ease-in-out py-3 px-4 bg-gray-200 flex justify-center items-center gap-2 rounded-xl"
                >
                  I
                </button>
                <button
                  onClick={changeColor}
                  className="group hover:bg-[#F81539] text-[#3E3232] hover:text-white font-semibold transition duration-300 ease-in-out py-3 px-4 bg-gray-200 flex justify-center items-center gap-2 rounded-xl"
                >
                  <div className="relative w-4 h-4">
                    {/* Icône normale */}
                    <Image
                      src="/color.svg"
                      alt="color"
                      width={16}
                      height={16}
                      className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                    />
                    {/* Icône au survol */}
                    <Image
                      src="/color-hover.svg"
                      alt="color hover"
                      width={16}
                      height={16}
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </div>
                  <span className="font-semibold text-opacity-75">Couleur</span>
                </button>
                <button
                  onClick={insertLink}
                  className="group hover:bg-[#F81539] text-[#3E3232] hover:text-white font-semibold transition duration-300 ease-in-out py-3 px-4 bg-gray-200 flex justify-center items-center gap-2 rounded-xl"
                >
                  <div className="relative w-4 h-4">
                    {/* Icône normale */}
                    <Image
                      src="/link.svg"
                      alt="link"
                      width={16}
                      height={16}
                      className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                    />
                    {/* Icône au survol */}
                    <Image
                      src="/link-hover.svg"
                      alt="link hover"
                      width={16}
                      height={16}
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </div>
                  <span className="font-semibold text-opacity-75">Lien</span>
                </button>
                <button
                  onClick={() => alignText("justifyLeft")}
                  className="hover:bg-[#F81539] hover:text-white font-semibold transition duration-300 ease-in-out py-3 px-4 bg-gray-200 flex justify-center items-center gap-2 rounded-xl"
                >
                  Aligné à gauche
                </button>
                <button
                  onClick={() => alignText("justifyCenter")}
                  className="hover:bg-[#F81539] hover:text-white font-semibold transition duration-300 ease-in-out py-3 px-4 bg-gray-200 flex justify-center items-center gap-2 rounded-xl"
                >
                  Centré
                </button>
                <button
                  onClick={() => alignText("justifyRight")}
                  className="hover:bg-[#F81539] hover:text-white font-semibold transition duration-300 ease-in-out py-3 px-4 bg-gray-200 flex justify-center items-center gap-2 rounded-xl"
                >
                  Aligné à droite
                </button>
              </div>
              <div
                ref={editorRef}
                contentEditable
                className="w-full bg-[#F5F5F5] min-h-[350px] p-2 border rounded-lg focus:outline-none focus:ring-0"
              ></div>
            </div>
          </div>
        </div>

        {/* SECOND PART */}
        <div className="flex-auto">
          <p className="font-semibold mb-4">Ajouter une image</p>
          {/* Zone de Dropzone */}
          <div className="p-3 bg-[#F5F5F5] rounded-xl items-center mb-7">
            <div
              className={`h-80 relative ${
                isDragging ? "border-4 border-dashed border-[#F81539]" : ""
              }`}
              onDragEnter={() => setIsDragging(true)}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              {isUploading ? (
                <Loader />
              ) : imageUrl ? (
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <Image
                    src={
                      imageUrl?.startsWith("http")
                        ? imageUrl
                        : `https://bloghub-8ljb.onrender.com${imageUrl}`
                    }
                    alt="Aperçu"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                  <button
                    onClick={() => setImageUrl(null)}
                    className="absolute top-2 right-2 bg-white border rounded-xl py-2 px-3 shadow-md hover:bg-[#F81539] hover:font-bold hover:text-white transition duration-300 ease-in-out"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 w-full h-full flex flex-col justify-center items-center text-center bg-[#F5F5F5]">
                  <div className="text-gray-400 mb-2">
                    <Image
                      src="/dragndrop.svg"
                      alt="Aperçu"
                      width={96}
                      height={96}
                      className="rounded-lg"
                    />
                  </div>
                  <p className="text-[#3E3232] text-opacity-75 font-medium mt-9 mb-6 text-sm">
                    Déposez l&apos;image ici, collez ou
                  </p>

                  <label className="border group hover:bg-[#F81539] hover:text-[#F81539] hover:bg-opacity-10 flex items-center gap-2 mt-2 px-4 py-2 rounded-xl shadow-sm text-gray-600 transition duration-300 ease-in-out cursor-pointer">
                    <div className="relative w-4 h-4">
                      <Image
                        src="/add.svg"
                        alt="add"
                        width={14}
                        height={14}
                        className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                      />
                      <Image
                        src="/add-hover.svg"
                        alt="link hover"
                        width={16}
                        height={16}
                        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                    </div>
                    <span className="font-semibold">Choisir une image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleImageUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-6 justify-center">
            {/* DRAFT BUTTON */}
            <button
              onClick={() => handleSubmit("DRAFT")}
              className="group hover:bg-[#F81539] text-[#3E3232] hover:text-white font-semibold transition duration-300 ease-in-out py-3 px-4 bg-gray-200 flex justify-center items-center gap-2 rounded-xl"
            >
              <div className="relative w-4 h-4">
                {/* Icône normale */}
                <Image
                  src="/draft.svg"
                  alt="draft"
                  width={16}
                  height={16}
                  className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                />
                {/* Icône au survol */}
                <Image
                  src="/draft-hover.svg"
                  alt="draft hover"
                  width={16}
                  height={16}
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
              <span className="font-semibold text-opacity-75">Brouillon</span>
            </button>

            {/* PREVIEW BUTTON */}
            <button
              onClick={() => setPreview(true)}
              className="group hover:bg-[#F81539] text-[#3E3232] hover:text-white font-semibold transition duration-300 ease-in-out py-3 px-4 bg-gray-200 flex justify-center items-center gap-2 rounded-xl"
            >
              <div className="relative w-4 h-4">
                {/* Icône normale */}
                <Image
                  src="/preview.svg"
                  alt="preview"
                  width={16}
                  height={16}
                  className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                />
                {/* Icône au survol */}
                <Image
                  src="/preview-hover.svg"
                  alt="preview hover"
                  width={16}
                  height={16}
                  className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
              <span className="font-semibold text-opacity-75">Aperçu</span>
            </button>

            {/* PUBLIC BUTTON */}
            <button
              onClick={() => handleSubmit("PUBLISHED")}
              className="bg-[#F81539] bg-opacity-75 text-white flex gap-2 px-4 py-3 rounded-xl font-semibold hover:bg-[#F81539] transition duration-300 ease-in-out"
            >
              <Image
                src="/public.svg"
                alt="color"
                width={16}
                height={16}
                className="hover:text-white transition-colors duration-300"
              />
              <span>Publier</span>
            </button>
          </div>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {preview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[80vh] overflow-auto">
            <h3 className="font-bold text-xl mb-2">{title}</h3>
            <p
              className="text-gray-700"
              dangerouslySetInnerHTML={{
                __html: editorRef.current?.innerHTML || "",
              }}
            ></p>
            {imageUrl && (
              <Image
                src={imageUrl}
                width={420}
                height={150}
                alt="Aperçu"
                className="w-full h-auto my-2"
              />
            )}
            <button
              onClick={() => setPreview(false)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
