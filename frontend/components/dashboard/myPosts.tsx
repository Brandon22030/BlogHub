/**
 * MyPosts component for BlogHub.
 * Displays a title indicating the list of the current user's blog posts.
 * @returns JSX.Element - Paragraph with title
 */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { LoadingMarked } from "./Sending/send";
import { useUser } from "@/context/UserContext";
import LikeButton from "@/components/LikeButton";

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
}

const fetchArticles = async () => {
  const res = await fetch("http://localhost:3001/articles");
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json();
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function MyPosts() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  interface Article {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    author: { name: string; imageUrl?: string; userId?: string };
    createdAt: string;
    authorId?: string;
    views?: number;
    likes?: number;
  }
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function loadArticles() {
      try {
        const data = await fetchArticles();
        // Filtre les articles écrits par l'utilisateur connecté
        console.log("ARTICLES DEBUG", data.data);
        const myArticles = data.data.filter(
          (article: Article) =>
            article.author?.userId === user?.userId ||
            article.author?.id === user?.userId, // fallback si backend renvoie id
        );
        setArticles(myArticles);
      } catch (error) {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }
    if (user?.userId) loadArticles();
    else setLoading(false);
  }, [user]);

  if (loading) return <LoadingMarked />;
  if (!user)
    return (
      <p className="text-[#3E3232] font-semibold">
        Connectez-vous pour voir vos articles.
      </p>
    );
  if (articles.length === 0)
    return (
      <p className="text-[#3E3232] font-semibold">
        Vous n'avez pas encore publié d'article.
      </p>
    );

  return (
    <div className="w-full ">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 rounded-xl sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
  const initialLiked = false; // À remplacer par la vraie logique utilisateur si possible
  return (
    <Link
      href={`/article/${article.id}`}
      key={article.id}
      className="block group"
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
              alt="Preview"
              width={400}
              height={200}
              className="w-full h-48 rounded-xl "
            />
          </div>
        )}
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
                {article.author?.imageUrl ? (
                  <Image
                    src={
                      article.author.imageUrl?.startsWith("http")
                        ? article.author.imageUrl
                        : "/avatar.png"
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
                      alt="Preview"
                      width={30}
                      height={30}
                      className="w-11 h-11 rounded-xl cover"
                    />
                  </div>
                )}
                <div className="ml-2 text-sm">
                  <p className="text-[#3E3232] font-semibold">
                    {article.author?.name}
                  </p>
                  <p className="text-[#3E3232] text-opacity-75">
                    {formatDate(article.createdAt)}
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
      </div>
    </Link>
  );
})}
        </div>
      </div>
    </div>
  );
}
