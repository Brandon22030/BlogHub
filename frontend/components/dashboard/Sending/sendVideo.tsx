import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import { SendPulse } from "./send";

/**
 * SendVideo component for BlogHub dashboard.
 * Provides a form for creating and submitting a new video post, including video upload and category selection.
 * @returns JSX.Element - The video post creation form and logic
 */
export default function SendPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(false);
  const [thePreview, setThePreview] = useState(null);
  const [status, setStatus] = useState("DRAFT");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const editorRef = useRef(null);

  const token = Cookies.get("token");

  useEffect(() => {
    const fetchUserProfile = async () => {
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

  // // Fonction pour gérer l'upload de l'image
  // const handleImageUpload = (file) => {
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     setImageUrl(reader.result);
  //   };
  //   reader.readAsDataURL(file);
  // };

  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const uploadResponse = await fetch(
      "http://localhost:3001/articles/images/upload",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      },
    );
    if (uploadResponse.ok) {
      const uploadData = await uploadResponse.json();
      setImageUrl(uploadData.filePath);
    }
  };

  // Fonction pour gérer le drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const formatText = (command) => {
    if (command === "createLink") {
      insertLink();
    } else {
      document.execCommand(command, false, null);
    }
  };

  const changeColor = () => {
    const color = prompt("Entrez une couleur (ex: red, #ff0000) :");
    document.execCommand("foreColor", false, color);
  };

  const insertLink = () => {
    const url = prompt("Entrez l'URL du lien :");
    if (url) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("target", "_blank");
      link.style.textDecoration = "underline"; // Ajout du soulignement
      link.style.transition = "color 0.3s"; // Transition pour l'effet de survol
      link.innerText = selection.toString();

      range.deleteContents(); // Supprime le texte sélectionné
      range.insertNode(link); // Insère le lien à la place du texte sélectionné    }
    }
  };

  const alignText = (alignment) => {
    document.execCommand(alignment, false, null);
  };

  const handleSubmit = async (status) => {
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

    const response = await fetch("http://localhost:3001/articles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) window.location.reload();
  };

  if (loading) return <SendPulse />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="text-black pt-10 mx-20">
      <div className="flex h-screen gap-6">
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
            <p className="font-semibold">Explanation</p>
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
                  <span className="font-semibold text-opacity-75">Color</span>
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
                  <span className="font-semibold text-opacity-75">Link</span>
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
          <p className="font-semibold mb-4">Add Video</p>
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
              {imageUrl ? (
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <Image
                    src={`http://localhost:3001${imageUrl}`}
                    alt="Preview"
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
                      alt="Preview"
                      width={96}
                      height={96}
                      className="rounded-lg"
                    />
                  </div>
                  <p className="text-[#3E3232] text-opacity-75 font-medium mt-9 mb-6 text-sm">
                    Drop Video here, paste or
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
                    <span className="font-semibold">Select</span>
                    <input
                      type="file"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                      className="hidden"
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
              <span className="font-semibold text-opacity-75">Draft</span>
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
              <span className="font-semibold text-opacity-75">Preview</span>
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
              <span>Public</span>
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
                __html: editorRef.current?.innerHTML,
              }}
            ></p>
            {imageUrl && (
              <Image
                src={`http://localhost:3001${imageUrl}`}
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
