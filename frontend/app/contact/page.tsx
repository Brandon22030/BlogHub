"use client";
"use client";
import { useState, useRef } from "react";
import { NavBar } from "../../components/navBar";

import Breadcrumbs from "@/components/breadcrumbs";
import Image from "next/image";

function validateEmail(email: string) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export default function ContactPage() {
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  // Simule l'upload (remplace par API si besoin)
  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setTimeout(() => {
      setImageUrl(URL.createObjectURL(file));
      setIsUploading(false);
    }, 1000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setErrors({});
    // Validation
    const newErrors: { [key: string]: string } = {};
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email";
    const content = editorRef.current?.innerText || "";
    if (!content.trim()) newErrors.message = "Message is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSending(true);
    // Envoi réel (remplace l’URL par ton endpoint réel si besoin)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          name,
          email,
          message: editorRef.current?.innerHTML,
          image: imageUrl,
        }),
      });
      if (res.ok) {
        setSuccess("Your message has been sent! Thank you.");
        setSubject("");
        setName("");
        setEmail("");
        setImageUrl(null);
        if (editorRef.current) editorRef.current.innerHTML = "";
      } else {
        setSuccess(null);
        setErrors({ global: "Error sending message. Please try again." });
      }
    } catch (err) {
      setSuccess(null);
      setErrors({ global: "Network error. Please try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <NavBar />
      <Breadcrumbs />
      <main className="min-h-screen py-10">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-[#FC4308]">Contact</h1>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Partie gauche : formulaire + éditeur */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-1 font-semibold text-gray-600">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className={`w-full text-black border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 ${errors.subject ? "border-red-500 ring-red-300" : "border-gray-300 focus:ring-[#FC4308]"}`}
                      placeholder="Subject"
                    />
                    {errors.subject && (
                      <div className="text-red-600 font-semibold text-sm mt-1">
                        {errors.subject}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-gray-600">
                      Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full text-black border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 ${errors.name ? "border-red-500 ring-red-300" : "border-gray-300 focus:ring-[#FC4308]"}`}
                      placeholder="Name"
                    />
                    {errors.name && (
                      <div className="text-red-600 font-semibold text-sm mt-1">
                        {errors.name}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-gray-600">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full text-black border rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 ring-red-300" : "border-gray-300 focus:ring-[#FC4308]"}`}
                      placeholder="Email"
                    />
                    {errors.email && (
                      <div className="text-red-600 font-semibold text-sm mt-1">
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-600">
                    Explanation
                  </label>
                  <textarea
                    value={editorRef.current?.innerText || ""}
                    onChange={(e) => {
                      if (editorRef.current)
                        editorRef.current.innerText = e.target.value;
                    }}
                    className={`w-full min-h-[140px] max-h-56 p-3 text-sm bg-white text-black border rounded-lg focus:outline-none focus:ring-0 ${errors.message ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"}`}
                    style={{ overflowY: "auto" }}
                    placeholder="Your message..."
                  />
                  {errors.message && (
                    <div className="text-red-600 font-semibold text-sm mt-1">
                      {errors.message}
                    </div>
                  )}
                </div>
              </div>
              {/* Partie droite : upload image */}
              <div className="w-full max-w-xs">
                <label className="block mb-2 font-semibold text-gray-600">
                  Add Image
                </label>
                <div
                  className={`p-3 bg-[#F5F5F5] rounded-xl items-center mb-7 border-2 ${isDragging ? "border-[#F81539] border-dashed" : "border-gray-300 border-dashed"}`}
                  onDragEnter={() => setIsDragging(true)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  {isUploading ? (
                    <div className="flex justify-center text-black items-center h-32">
                      Uploading...
                    </div>
                  ) : imageUrl ? (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt="Preview"
                        fill
                        className="rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl(null)}
                        className="absolute top-2 right-2 text-black font-black bg-white border rounded-xl py-2 px-3 shadow-md hover:bg-[#F81539] hover:font-bold hover:text-white transition duration-300"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center items-center h-40">
                      <Image
                        src="/dragndrop.svg"
                        alt="Upload"
                        width={60}
                        height={60}
                        className="mb-2 opacity-70"
                      />
                      <span className="text-xs text-gray-400 mb-2">
                        Drop image here, paste or
                      </span>
                      <label className="bg-white border rounded px-4 py-1 text-xs font-semibold text-gray-600 cursor-pointer">
                        + Select
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0])
                              handleImageUpload(e.target.files[0]);
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Bouton Send */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="bg-[#F81539] text-white px-6 py-2 rounded-xl shadow hover:bg-[#e04a0e] flex items-center gap-2 font-semibold"
              >
                <span>✈️</span> Send
              </button>
            </div>
          </form>
          {/* Messages globaux */}
          {errors.global && (
            <div className="text-red-700 font-bold text-base mb-4 text-center">
              {errors.global}
            </div>
          )}
          {success && (
            <div className="text-green-600 font-bold text-base mb-4 text-center">
              {success}
            </div>
          )}
          {/* Modal de preview */}
          {preview && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] overflow-auto">
                <h3 className="font-bold text-xl mb-2">{subject}</h3>
                <div className="mb-2 text-gray-600 text-sm">
                  From: {name} ({email})
                </div>
                <div
                  className="mb-4 border-b pb-2 text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: editorRef.current?.innerHTML || "",
                  }}
                />
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
                  className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
