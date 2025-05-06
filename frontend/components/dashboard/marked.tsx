"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
// import Cookies from "js-cookie"; // Cookie-based JWT is handled by browser automatically
import { LoadingMarked } from "./Sending/send";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation"; // Ajout pour navigation programmatique

// Fonction utilitaire pour retirer toutes les balises HTML
function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
}

const fetchArticles = async () => {
  const res = await fetch("http://localhost:3001/articles");
  if (!res.ok) throw new Error("Failed to fetch categories");
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

export default function Marked() {
  const [likedArticles, setLikedArticles] = useState<string[]>([]);
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
    async function loadArticles() {
      try {
        const data = await fetchArticles();
        setArticles(data.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      } finally {
        setLoading(false);
      }
    }
    async function loadLikedArticles() {
      try {
        const res = await fetch("http://localhost:3001/articles/liked", {
          credentials: "include",
        });
        if (res.ok) {
          const likedIds = await res.json();
          setLikedArticles(likedIds);
        }
      } catch (error) {
        // Silently ignore if not logged in
      }
    }
    loadArticles();
    loadLikedArticles();
  }, []);

  if (loading) return <LoadingMarked />;

  return (
    <div className="w-full ">
      <div className="mx-20 ">
        <div className="grid grid-cols-1 rounded-xl sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              href={`/article/${article.id}`}
              key={article.id}
              className="block group"
              onClick={async (e) => {
                e.preventDefault();
                await fetch(
                  `http://localhost:3001/articles/${article.id}/view`,
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
                      alt="Preview"
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
                            {article.author.name}
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
                    {/* Compteurs views/likes et bouton like */}
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
                        {article.views || 0} views
                      </span>
                      {likedArticles.includes(article.id) ? (
                        <button
                          className="flex items-center gap-1 text-xs focus:outline-none text-[#FC4308] hover:text-gray-500 group-hover:text-white"
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const res = await fetch(
                              `http://localhost:3001/articles/${article.id}/like`,
                              {
                                method: "PATCH",
                                credentials: "include",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ status: 0 }),
                              },
                            );
                            if (res.ok) {
                              const updated = await res.json();
                              setArticles((prev) =>
                                prev.map((a) =>
                                  a.id === article.id
                                    ? { ...a, likes: updated.likes }
                                    : a,
                                ),
                              );
                              setLikedArticles((prev) =>
                                prev.filter((id) => id !== article.id),
                              );
                            }
                          }}
                          aria-label="Dislike"
                        >
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            className="inline text-red-500 group-hover:text-white"
                          >
                            <path d="M8 14s6-4.35 6-7.5A3.5 3.5 0 0 0 8 4.5 3.5 3.5 0 0 0 2 6.5C2 9.65 8 14 8 14z" />
                            <line
                              x1="4"
                              y1="12"
                              x2="12"
                              y2="4"
                              stroke="red"
                              strokeWidth="2"
                            />
                          </svg>
                          Dislike ({article.likes || 0})
                        </button>
                      ) : (
                        <button
                          className="flex items-center gap-1 text-xs focus:outline-none text-gray-500 hover:text-[#FC4308] group-hover:text-white"
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const res = await fetch(
                              `http://localhost:3001/articles/${article.id}/like`,
                              {
                                method: "PATCH",
                                credentials: "include",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ status: 1 }),
                              },
                            );
                            if (res.ok) {
                              const updated = await res.json();
                              setArticles((prev) =>
                                prev.map((a) =>
                                  a.id === article.id
                                    ? { ...a, likes: updated.likes }
                                    : a,
                                ),
                              );
                              setLikedArticles((prev) => [...prev, article.id]);
                            }
                          }}
                          aria-label="Like"
                        >
                          <svg
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="inline text-red-500 group-hover:text-white"
                          >
                            <path d="M8 14s6-4.35 6-7.5A3.5 3.5 0 0 0 8 4.5 3.5 3.5 0 0 0 2 6.5C2 9.65 8 14 8 14z" />
                          </svg>
                          Like ({article.likes || 0})
                        </button>
                      )}
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
