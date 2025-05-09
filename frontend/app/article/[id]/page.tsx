"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import LikeButton from "@/components/LikeButton";
import FavoriteButton from "@/components/FavoriteButton"; // Importer FavoriteButton
import CommentSection from "@/components/comments/CommentSection"; // Import CommentSection
import { NavBar } from "@/components/navBar";

interface Author {
  id: string;
  name: string;
  imageUrl?: string;
  articles?: Partial<Article>[];
  _count?: {
    articles?: number;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: Author;
  views?: number;
  likes?: number;
  createdAt?: string;
  category?: Category;
}

export default function ArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // State for categories
  const [loading, setLoading] = useState(true);
  const viewIncrementLogicInitiatedForIdRef = useRef<string | null>(null);

  useEffect(() => {
    console.log(`ArticlePage useEffect triggered for ID: ${id}`);
    if (!id) return;

    // Gérer le double appel de useEffect par StrictMode
    if (viewIncrementLogicInitiatedForIdRef.current !== id) {
      console.log(
        `View increment logic for ${id} not yet initiated in this render cycle. Proceeding.`
      );
      viewIncrementLogicInitiatedForIdRef.current = id; // Marquer comme initié pour cet id dans ce cycle

      const sessionStorageKey = `viewedArticle_${id}`;
      const alreadyViewedInSession = sessionStorage.getItem(sessionStorageKey);
      console.log(
        `Checking sessionStorage for ${sessionStorageKey}: alreadyViewed = ${alreadyViewedInSession}`
      );

      if (!alreadyViewedInSession) {
        console.log(
          `Incrementing view for ${id} as it's not in sessionStorage.`
        );
        fetch(`https://bloghub-8ljb.onrender.com/articles/${id}/view`, { method: "PATCH" })
          .then((response) => {
            if (response.ok) {
              console.log(
                `View incremented successfully for ${id}. Marking in sessionStorage.`
              );
              sessionStorage.setItem(sessionStorageKey, "true");
            } else {
              console.error(
                `Failed to increment view API call for ${id}. Status: ${response.status}`
              );
            }
          })
          .catch((error) =>
            console.error("API call to increment view failed:", error)
          );
      } else {
        console.log(`View for ${id} already noted in sessionStorage.`);
      }
    } else {
      console.log(
        `View increment logic for ${id} already initiated in this render cycle (StrictMode double call). Skipping.`
      );
    }

    // Fetch article data (ceci doit toujours s'exécuter si id change)
    fetch(`https://bloghub-8ljb.onrender.com/articles/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setArticle(data);
        setLoading(false);
      });
    // Fetch related articles (example endpoint)
    fetch(`https://bloghub-8ljb.onrender.com/articles/related/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // Defensive: handle both array and object (e.g. { data: [...] })
        if (Array.isArray(data)) {
          setRelated(data);
        } else if (Array.isArray(data?.data)) {
          setRelated(data.data);
        } else {
          setRelated([]);
        }
      });

    // Fetch categories
    fetch(`https://bloghub-8ljb.onrender.com/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          setCategories([]);
          console.warn("Categories data is not an array:", data);
        }
      })
      .catch((error) =>
        console.error("API call to fetch categories failed:", error)
      );
  }, [id]); // id est toujours une dépendance pour recharger les données si l'id change

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  if (!article)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Article not found.
      </div>
    );

  // Helper function to format date (optional, or use a library)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (err) {
      console.warn(`Failed to format date string: ${dateString}`, err);
      return dateString; // fallback to original string if formatting fails
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto py-10">
        {/* Left: Main Article - Redesigned */}
        <div className="flex-1 bg-[#f8f8f8] rounded-xl shadow-lg p-6 md:p-8">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 text-center">
            {article.title}
          </h1>

          {/* Main Image with Overlap */}
          {article.imageUrl && (
            <div className="w-full rounded-xl mb-8">
              {" "}
              {/* Increased mb for space after overlap */}
              <Image
                src={article.imageUrl}
                alt={article.title}
                width={900} // Adjust as per your design needs
                height={500} // Adjust as per your design needs
                className="rounded-xl w-full h-auto object-cover -mb-5 relative z-10 shadow-md"
                priority // Good for LCP
              />
            </div>
          )}

          {/* Metadata Section - Centered */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 sm:gap-x-6 gap-y-2 text-sm text-gray-600 my-8 md:my-12">
            {/* Date */}
            {article.createdAt && (
              <div className="flex items-center">
                {/* Placeholder for Date Icon */}
                <span className="material-icons-outlined text-base mr-1">
                  calendar_today
                </span>
                <span>{formatDate(article.createdAt)}</span>
              </div>
            )}
            {/* Category */}
            {article.category && (
              <div className="flex items-center">
                {/* Placeholder for Category Icon */}
                <span className="material-icons-outlined text-base mr-1">
                  folder_open
                </span>
                <Link
                  href={`/categories/${article.category.slug}`}
                  className="hover:underline"
                >
                  {article.category.name}
                </Link>
              </div>
            )}
            {/* Views */}
            <div className="flex items-center">
              {/* Placeholder for Views Icon */}
              <span className="material-icons-outlined text-base mr-1">
                visibility
              </span>
              <span>{article.views || 0} vues</span>
            </div>
            {/* Comments Link/Count Placeholder */}
            <div className="flex items-center">
              {/* Placeholder for Comments Icon */}
              <span className="material-icons-outlined text-base mr-1">
                chat_bubble_outline
              </span>
              <a href="#comments-section" className="hover:underline">
                Commentaires
              </a>
              {/* Placeholder for count: (article.commentsCount || 0) */}
            </div>
            {/* Likes */}
            <div className="flex items-center">
              {/* Likes - Utilisation du composant LikeButton */}
              {article.id && (
                <LikeButton articleId={article.id} initialLikes={article.likes ?? 0}
                initialLiked={false} />
              )}
              {/* Bouton Favori */}
              {article.id && <FavoriteButton articleId={article.id} />}
            </div>
          </div>

          {/* Article Content */}
          <div
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed whitespace-pre-line"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Comments Section - Ensure it has an id for the link to work */}
          <div id="comments-section" className="mt-12">
            <CommentSection articleId={id} />
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col gap-8">
          {/* Author Card */}
          {article?.author && (
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center space-x-4">
                {" "}
                {/* Changed items-start to items-center */}
                {/* Left: Author Image */}
                <div className="flex-shrink-0">
                  <Image
                    src={article.author.imageUrl || "/avatar.svg"}
                    alt={article.author.name || "Author"}
                    width={80}
                    height={80}
                    className="rounded-md w-12 h-12 object-cover"
                  />
                </div>
                {/* Right: Author Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {article.author.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {article.author._count?.articles !== undefined
                      ? `${article.author._count.articles} Article${article.author._count.articles === 1 ? "" : "s"} written`
                      : article.author.articles &&
                          Array.isArray(article.author.articles)
                        ? `${article.author.articles.length} Article${article.author.articles.length === 1 ? "" : "s"} written`
                        : "Article count unavailable"}
                  </p>
                  <button className="w-full bg-[#FC4308] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FC4308] transition duration-150 ease-in-out">
                    Follow
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Categories Card */}
          {categories && categories.length > 0 && (
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex gap-[6px] items-center mb-5">
                <Image src="/red_ops.svg" alt="reed_ops" width={4} height={4} />
                <h3 className="font-bold text-lg text-gray-800">
                  Catégories
                </h3>
              </div>
              <ul className="flex flex-wrap gap-2">
                {" "}
                {/* Changed for horizontal display */}
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-[#FC4308] rounded-full px-3 py-1 transition-colors duration-150 block"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
