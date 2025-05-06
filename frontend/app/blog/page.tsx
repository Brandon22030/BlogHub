"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NavBar } from "../../components/navBar";
import Breadcrumbs from "@/components/breadcrumbs";
import LikeButton from "@/components/LikeButton";
import { useRouter } from "next/navigation"; // Ajout de useRouter

interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: {
    name: string;
    imageUrl?: string;
  };
  createdAt: string;
  views?: number;
  likes?: number;
}

export default function BlogPage() {
  const router = useRouter(); // Instance de useRouter
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        search,
        limit: "6",
      });
      const res = await fetch(`http://localhost:3001/articles?${params}`);
      const data = await res.json();

      setArticles(data.data);
      setTotalPages(data.meta?.totalPages || 1);
      setTotalItems(data.meta?.totalItems || 0);
      setLoading(false);
    }

    fetchArticles();
  }, [page, search]);

  return (
    <>
      <NavBar />
      <Breadcrumbs />
      <main className="max-w-5xl mx-auto py-12 px-4">
        {/* En-tête */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-[#FC4308] mb-2">
            Explorez tous les articles
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Inspirez-vous, partagez et découvrez les dernières publications de
            la communauté BlogHub. Utilisez la barre de recherche pour trouver
            un sujet précis !
          </p>
        </header>

        {/* Barre de recherche */}
        <section className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <input
            type="text"
            placeholder="🔍 Rechercher un article (titre, contenu, auteur...)"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border px-4 py-2 rounded-lg w-full max-w-md shadow-sm focus:border-[#FC4308] focus:outline-none text-base text-black"
          />
          <span className="text-gray-500 text-sm">
            {totalItems} article{totalItems > 1 ? "s" : ""} trouvé
            {totalItems > 1 ? "s" : ""}
          </span>
        </section>

        {/* Liste des articles */}
        {loading ? (
          <p className="text-center py-16 text-lg text-gray-500">
            Chargement...
          </p>
        ) : articles.length === 0 ? (
          <p className="text-center py-16 text-lg text-gray-500">
            Aucun article trouvé.
          </p>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => {
  const initialLiked = false; // À remplacer par la vraie logique utilisateur si possible
  return (
    <Link
      key={article.id}
      href={`/article/${article.id}`}
      className="block group"
      onClick={async (e) => {
        e.preventDefault();
        try {
          // Appel explicite pour incrémenter la vue
          const res = await fetch(
            `http://localhost:3001/articles/${article.id}/view`,
            {
              method: "PATCH",
            },
          );
          if (res.ok) {
            // Optionnel: mise à jour optimiste si vous affichez les vues directement ici
            // ou si vous voulez forcer un re-fetch sur la page de détail
            console.log(`View increment API call successful for ${article.id} from BlogPage`);
          } else {
            console.error(`View increment API call failed for ${article.id} from BlogPage`);
          }
        } catch (error) {
          console.error("Error calling view increment API from BlogPage:", error);
        }
        // Navigation programmatique vers la page de l'article
        router.push(`/article/${article.id}`);
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
            <svg width="16" height="16" fill="none" stroke="currentColor" className="inline mr-1"><circle cx="8" cy="8" r="7" strokeWidth="2" /></svg>
            {article.views || 0} vues
          </span>
          <LikeButton
            articleId={article.id}
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
            {article.content.replace(/<[^>]+>/g, "").slice(0, 100)}...
          </p>
          {/* Infos auteur */}
          <div className="flex items-center justify-between mt-4 bg-[#F5F5F5] py-3 px-4 rounded-xl">
            <div className="flex items-center">
              <Image
                src={
                  article.author.imageUrl?.startsWith("http")
                    ? article.author.imageUrl
                    : "/avatar.png"
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
                  {new Date(article.createdAt).toLocaleDateString(
                    "fr-FR",
                  )}
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
        </div>
      </div>
    </Link>
  );
})}
          </section>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded bg-gray-200 text-black hover:text-white hover:bg-[#FC4308]  font-bold disabled:opacity-50 disabled:hover:bg-gray-300 disabled:text-black"
          >
            Précédent
          </button>
          <span className="font-semibold">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded bg-gray-200 text-black hover:text-white hover:bg-[#FC4308]  font-bold disabled:opacity-50 disabled:hover:bg-gray-300 disabled:text-black"
          >
            Suivant
          </button>
        </div>
      </main>
    </>
  );
}
