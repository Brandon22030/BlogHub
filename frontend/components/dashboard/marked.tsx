"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { LoadingMarked } from "./Sending/send";
import { useUser } from "@/context/UserContext";

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
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  interface Article {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    author: { name: string; imageUrl?: string };
    createdAt: string;
  }

  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    async function loadArticles() {
      try {
        const data = await fetchArticles();
        console.log(data.data);
        setArticles(data.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  if (loading) return <LoadingMarked />;

  return (
    <div className="w-full ">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 rounded-xl sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
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
