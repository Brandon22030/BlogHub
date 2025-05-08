"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { NavBar } from "@/components/navBar";
import Breadcrumbs from "@/components/breadcrumbs";
import LikeButton from "@/components/LikeButton";

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
  content?: string;
  author?: {
    name: string;
    imageUrl?: string;
  };
  createdAt?: string;
  views?: number;
  likes?: number;
}

import { useRouter } from "next/navigation";
import logo from "@/public/logo.svg";
import dragndrop from "@/public/dragndrop.svg";

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
      <p
        className={`text-lg mt-4 transition-opacity duration-1000 ${showText ? "opacity-100" : "opacity-0"}`}
      >
        {message || "Oops! Cette page n&apos;existe pas."}
      </p>
      <button
        onClick={() => router.push("/")}
        className="mt-6 px-6 py-3 bg-[#FC4308] hover:bg-[#F81539] text-white font-bold rounded-lg transition-transform duration-200 hover:scale-110"
      >
        Retour à l&apos;accueil
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
  const router = useRouter(); // Obtenir l'instance du router
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`https://bloghub-8ljb.onrender.com/categories/slug/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Catégorie introuvable");
        return res.json();
      })
      .then((cat) => {
        setCategory(cat);
        return fetch(`https://bloghub-8ljb.onrender.com/articles?category=${cat.id}`)
          .then((res) => {
            if (!res.ok)
              throw new Error("Erreur lors du chargement des articles");
            return res.json();
          })
          .then((arts) => setArticles(arts.data || arts));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error || !category)
    return <NotFoundCategory message={error || "Catégorie introuvable"} />;

  return (
    <>
      <NavBar />
      <Breadcrumbs />
      <div className="min-h-screen bg-white">
        {/* Hero section modernisée */}
        <section className="relative w-full h-72 md:h-96 flex flex-col justify-center items-center bg-gradient-to-br from-[#FC4308]/60 to-[#3E3232]/90 mb-16 overflow-hidden shadow-lg">
          {category.imageUrl && (
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              className="object-cover opacity-20"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#3E3232]/90 via-transparent to-[#FC4308]/20 z-10" />
          <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-xl text-center mb-2">
              {category.name}
            </h1>
            <span className="inline-block text-lg md:text-2xl text-[#FC4308] bg-white bg-opacity-70 px-6 py-2 rounded-xl font-semibold mt-2 shadow">
              Catégorie
            </span>
          </div>
        </section>

        {/* Articles section modernisée */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <h2 className="text-3xl font-bold mb-10 text-[#FC4308] text-center tracking-tight">
            Articles de la catégorie
          </h2>
          {articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400 text-xl font-semibold bg-[#f8f8f8] rounded-xl shadow-inner">
              <Image
                src={dragndrop}
                alt="vide"
                width={80}
                height={80}
                className="mb-6"
              />
              Aucun article dans cette catégorie.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {articles.map((article) => {
                const initialLiked = false; // À remplacer par la vraie logique utilisateur si possible
                return (
                  <Link
                    key={article.id}
                    href={`/article/${article.id}`} // Correction: Utiliser /article/:id
                    className="block group"
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        // Appel explicite pour incrémenter la vue
                        // Note: article.id est un nombre ici, l'API doit le gérer ou il faut convertir
                        const res = await fetch(
                          `https://bloghub-8ljb.onrender.com/articles/${article.id}/view`,
                          {
                            method: "PATCH",
                          },
                        );
                        if (res.ok) {
                          console.log(
                            `View increment API call successful for ${article.id} from CategoryPage`,
                          );
                        } else {
                          console.error(
                            `View increment API call failed for ${article.id} from CategoryPage`,
                          );
                        }
                      } catch (error) {
                        console.error(
                          "Error calling view increment API from CategoryPage:",
                          error,
                        );
                      }
                      // Navigation programmatique vers la page de l'article
                      router.push(`/article/${article.id}`); // Correction: Utiliser /article/:id
                    }}
                  >
                    <div className="bg-white hover:bg-[#FC4308] group-hover:text-white shadow-md rounded-xl overflow-hidden p-3 transition-transform hover:scale-105">
                      {/* Image principale */}
                      <Image
                        src={
                          article.imageUrl?.startsWith("http")
                            ? article.imageUrl
                            : "/dragndrop.svg"
                        }
                        alt={article.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                      {/* Vues et likes */}
                      <div className="flex items-center justify-between mt-2 px-3">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            className="inline mr-1"
                          >
                            <circle cx="8" cy="8" r="7" strokeWidth="2" />
                          </svg>
                          {article.views || 0} vues
                        </span>
                        <LikeButton
                          articleId={String(article.id)} // Convertir en chaîne
                          initialLiked={initialLiked}
                          initialLikes={article.likes || 0}
                        />
                      </div>
                      {/* Contenu de l’article */}
                      <div className="pt-4">
                        <h3 className="text-md px-3 font-semibold line-clamp-1 text-[#3E3232] group-hover:text-white">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 px-3 mt-2 line-clamp-2 group-hover:text-white">
                          {(article.excerpt || article.content)
                            ?.replace(/<[^>]+>/g, "")
                            .slice(0, 100)}
                          ...
                        </p>
                        {/* Infos auteur */}
                        {article.author && (
                          <div className="flex items-center justify-between mt-4 bg-[#F5F5F5] py-3 px-4 rounded-xl">
                            <div className="flex items-center">
                              <Image
                                src={
                                  article.author.imageUrl?.startsWith("http")
                                    ? article.author.imageUrl
                                    : "/avatar.svg"
                                }
                                alt={article.author.name}
                                width={44}
                                height={44}
                                className="w-11 h-11 rounded-xl object-cover"
                              />
                              <div className="ml-2 text-sm">
                                <p className="text-[#3E3232] font-semibold">
                                  {article.author.name}
                                </p>
                                <p className="text-[#3E3232] text-opacity-75">
                                  {article.createdAt &&
                                    new Date(
                                      article.createdAt,
                                    ).toLocaleDateString("fr-FR")}
                                </p>
                              </div>
                            </div>
                            <Image
                              src="/signet.svg"
                              alt="signet"
                              width={30}
                              height={30}
                              className="w-10 h-10 object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
