"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
}

interface Article {
  id: number;
  title: string;
  excerpt: string;
  imageUrl?: string;
  slug: string;
}

import { useRouter } from "next/navigation";
import logo from "@/public/logo.svg";

function NotFoundCategory({ message }: { message: string }) {
  const [showText, setShowText] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), 500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-white text-black overflow-hidden">
      <div className="mb-6">
        <Image src={logo} alt="logo" width={300} height={48} priority />
      </div>
      <h1 className="text-8xl font-extrabold glitch" data-text="404">
        404
      </h1>
      <p className={`text-lg mt-4 transition-opacity duration-1000 ${showText ? "opacity-100" : "opacity-0"}`}>
        {message || "Oops! Cette page n'existe pas."}
      </p>
      <button
        onClick={() => router.push("/")}
        className="mt-6 px-6 py-3 bg-[#FC4308] hover:bg-[#F81539] text-white font-bold rounded-lg transition-transform duration-200 hover:scale-110"
      >
        Retour à l'accueil
      </button>
      <style jsx>{`
        .glitch {
          position: relative;
          color: black;
          text-shadow:
            2px 2px 0 #ff00ff,
            -2px -2px 0 #00ffff;
          animation: glitch 0.8s infinite alternate;
        }
        @keyframes glitch {
          0% {
            text-shadow:
              2px 2px 0 #ff00ff,
              -2px -2px 0 #00ffff;
          }
          100% {
            text-shadow:
              -2px -2px 0 #ff00ff,
              2px 2px 0 #00ffff;
          }
        }
      `}</style>
    </div>
  );
}

export default function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([
      fetch(`http://localhost:3001/categories/slug/${slug}`).then((res) => {
        if (!res.ok) throw new Error("Catégorie introuvable");
        return res.json();
      }),
      fetch(`http://localhost:3001/articles/category/${slug}`).then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des articles");
        return res.json();
      }),
    ])
      .then(([cat, arts]) => {
        setCategory(cat);
        setArticles(arts);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error || !category) return <NotFoundCategory message={error || "Catégorie introuvable"} />;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <div className="relative w-full h-60 md:h-80 flex flex-col justify-end items-center bg-gray-100 mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 z-10 text-center text-[#3E3232] drop-shadow-lg">
          {category.name}
        </h1>
        {category.imageUrl && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-40 md:w-56 md:h-56">
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              className="object-contain rounded-xl border shadow-lg"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-0" />
      </div>

      {/* Articles section */}
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6 text-[#FC4308]">Articles</h2>
        {articles.length === 0 ? (
          <div className="text-gray-500">Aucun article dans cette catégorie.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                href={`/blog/${article.slug}`}
                key={article.id}
                className="block rounded-xl shadow hover:shadow-lg transition bg-white border overflow-hidden group"
              >
                {article.imageUrl && (
                  <div className="relative w-full h-40 bg-gray-50">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2 text-[#3E3232] group-hover:text-[#FC4308] transition">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
