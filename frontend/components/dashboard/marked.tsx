"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
// import Cookies from "js-cookie"; // Cookie-based JWT is handled by browser automatically
import { LoadingMarked } from "./Sending/send";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation"; // Ajout pour navigation programmatique
import FavoriteButton from "@/components/FavoriteButton"; // Ajout de FavoriteButton

// Fonction utilitaire pour retirer toutes les balises HTML
function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
}

// Définition basique de l'interface Article
interface Article {
  id: string;
  title: string;
  content: string; // Rendu obligatoire
  imageUrl?: string;
  author: { name: string; imageUrl?: string }; // Ajusté pour correspondre
  category?: { name?: string }; // Ajuster selon la structure réelle
  createdAt: string; // ou Date si c'est un objet Date
  slug?: string;
  likesCount?: number;
  isPublished?: boolean;
  views: number;
  likes: number; // Changé en number et rendu obligatoire
}

// L'API /favorites retourne un tableau de { id, userId, articleId, article: ArticleDetails }
interface FavoriteEntry {
  id: string;
  article: Article; // L'objet Article complet
  // userId et articleId (du modèle Favorite) ne sont pas directement utilisés ici pour l'affichage
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function Marked() {
  const router = useRouter();
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  interface Article {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    author: { name: string; imageUrl?: string };
    createdAt: string;
    views: number;
    likes: number;
  }

  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function loadFavoriteArticles() {
      if (!user) {
        setArticles([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/favorites`,
          {
            credentials: "include", // Important pour l'authentification
            cache: "no-store", // Demander des données fraîches
          }
        );
        if (response.status === 401) {
          // Gérer le cas où l'utilisateur n'est pas authentifié ou session expirée
          console.warn("Utilisateur non authentifié pour récupérer les favoris.");
          setArticles([]);
          setLoading(false); // Assurer que loading est mis à jour
          // Optionnel: afficher un message à l'utilisateur
        } else if (!response.ok) {
          setLoading(false); // Assurer que loading est mis à jour
          throw new Error(`Échec de la récupération des articles favoris : ${response.status}`);
        } else {
          const result: FavoriteEntry[] = await response.json();
          setArticles(result.map((fav) => fav.article));
          setLoading(false); // Assurer que loading est mis à jour
        }
      } catch (error) {
        console.error("Erreur lors du chargement des articles favoris:", error);
        setArticles([]); // Optionnel, réinitialiser en cas d'erreur
        setLoading(false); // Assurer que loading est mis à jour dans le catch aussi
      }
    }
    console.log("Objet utilisateur dans useEffect du composant Marked:", user);
    loadFavoriteArticles(); // Appeler la fonction de chargement des favoris
  }, [user]); // Ajout de user comme dépendance

  if (loading) return <LoadingMarked />;

  // Gérer le cas où l'utilisateur n'est pas connecté
  if (!user) {
    return (
      <div className="w-full">
        <div className="mx-20 my-10 text-center">
          <p className="text-xl text-gray-700">
            Veuillez vous <Link href="/login" className="text-[#FC4308] hover:underline">connecter</Link> pour voir vos articles favoris.
          </p>
        </div>
      </div>
    );
  }

  // Gérer le cas où il n'y a pas d'articles favoris
  if (articles.length === 0) {
    return (
      <div className="w-full">
        <div className="mx-20 my-10 text-center">
          <p className="text-xl text-gray-700">Vous n&apos;avez aucun article en favori pour le moment.</p>
          <p className="text-md text-gray-500 mt-2">Cliquez sur l&apos;icône ❤️ sur un article pour l&apos;ajouter à vos favoris.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full ">
      <div className="mx-20 ">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Mes Articles Favoris</h2> {/* Titre de la section */}
        <div className="grid grid-cols-1 rounded-xl sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              href={`/article/${article.id}`}
              key={article.id}
              className="block group"
              onClick={async (e) => {
                e.preventDefault();
                await fetch(
                  `https://bloghub-8ljb.onrender.com/articles/${article.id}/view`,
                  {
                    method: "PATCH",
                  },
                );
                setArticles((prev) =>
                  prev.map((a) =>
                    a.id === article.id
                      ? { ...a, views: (a.views || 0) + 1 }
                      : a,
                  ),
                );
                router.push(`/article/${article.id}`);
              }}
            >
              <div className="bg-white hover:bg-[#FC4308] group-hover:text-white flex flex-col justify-between shadow-md rounded-xl overflow-hidden p-3 transition transform hover:scale-105 cursor-pointer">
                {article.imageUrl ? (
                  <Image
                    src={
                      article.imageUrl?.startsWith("http")
                        ? article.imageUrl
                        : "/dragndrop.svg"
                    }
                    alt={article.title}
                    width={400}
                    height={250}
                    className="w-full h-48 rounded-xl object-cover"
                  />
                ) : (
                  <div className="text-gray-400 mb-2">
                    <Image
                      src="/dragndrop.svg"
                      alt="Aperçu"
                      width={400}
                      height={200}
                      className="w-full h-48 rounded-xl "
                    />
                  </div>
                )}
                <div className="pt-4">
                  <h3 className="text-md px-3 font-semibold line-clamp-1 text-[#3E3232] group-hover:text-white">
                    {article.title}
                  </h3>
                  <div className="text-gray-600 px-3 text-sm line-clamp-1 overflow-hidden mt-2 group-hover:text-white">
                    {stripHtml(article.content)}
                  </div>
                  <div className="w-full">
                    <div className="flex items-center justify-between mx-auto mt-4 bg-[#F5F5F5] py-3 px-4 rounded-xl ">
                      <div className="flex items-center">
                        {article.author.imageUrl ? (
                          <Image
                            src={
                              article.author.imageUrl?.startsWith("http")
                                ? article.author.imageUrl
                                : "/avatar.svg"
                            }
                            alt={article.author.name}
                            width={30}
                            height={30}
                            className="w-11 h-11 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="text-gray-400 mb-2">
                            <Image
                              src="/dragndrop.svg"
                              alt="Aperçu"
                              width={30}
                              height={30}
                              className="w-11 h-11 rounded-xl cover"
                            />
                          </div>
                        )}
                        <div className="ml-2 text-sm">
                          <p className="text-[#3E3232] font-semibold">
                            {article.author.name}
                          </p>
                          <p className="text-[#3E3232] text-opacity-75">
                            {formatDate(article.createdAt)}
                          </p>
                        </div>
                      </div>
                      <FavoriteButton articleId={article.id} />
                    </div>
                    <div className="flex items-center justify-start mt-2 px-3">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="inline mr-1"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        {article.views || 0} vues
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
