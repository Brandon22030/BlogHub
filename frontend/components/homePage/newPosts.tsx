"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { FaChevronRight } from "react-icons/fa";
import FavoriteButton from "@/components/FavoriteButton"; // Importer le bouton

interface Author {
  id: string;
  name: string;
  imageUrl?: string;
}

interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: Author;
  categoryId: string;
  status: string;
  createdAt: string; 
  views: number;
  likes: number;
}

interface ApiResponse {
  data: Article[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export default function NewPosts() {
  const router = useRouter(); // Instance de useRouter
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/articles?sortBy=createdAt&sortOrder=desc&limit=5&page=1` // Limité à 5 pour l'exemple
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch new articles: ${response.status} ${response.statusText}`
          );
        }
        const result: ApiResponse = await response.json();
        setArticles(result.data);
      } catch (err: any) { // Type Error pour une meilleure gestion
        setError(err.message || "An unknown error occurred while fetching articles.");
        console.error("Error fetching new articles:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewArticles();
  }, []);

  // La logique pour handleShowAll sera ajoutée ultérieurement si nécessaire
  // const handleShowAll = () => { console.log("Show all new posts"); };

  return (
    <div className="mt-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> {/* Ajout d'un conteneur avec max-width et padding */} 
      <div className="flex items-center mb-5 justify-between">
        <div className="flex gap-[6px] items-center text-black">
          <Image src="/red_ops.svg" alt="new_posts_icon" width={4} height={4} />
          <p className="font-semibold text-md">New Posts</p>
        </div>
        <div 
          // onClick={handleShowAll} // Fonctionnalité à implémenter
          className="hover:scale-105 transition-transform cursor-pointer p-2 flex text-[#3E3232] rounded-lg items-center justify-center bg-[#F5F5F5] space-x-2"
          aria-label="Show all new posts"
        >
          <p className="text-xs">Show All</p>
          <button className="text-xs" aria-label="Show all new posts icon">
            <FaChevronRight />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-500">Loading new posts...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 p-4 rounded-lg text-red-700">
          <p className="font-semibold">Error loading new posts:</p>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && articles.length === 0 && (
        <div className="text-center text-gray-500 py-5">
          <p>No new posts to display at the moment.</p>
        </div>
      )}

      {!isLoading && !error && articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out">
              {article.imageUrl && (
                
                <Link 
                  href={`/article/${article.id}`} 
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${article.id}/view`, {
                        method: "PATCH",
                      });
                      if (!res.ok) {
                        console.warn(`Failed to increment view count for article ${article.id}: ${res.status}`);
                      }
                    } catch (error: any) {
                      console.error('Error incrementing view count:', error);
                    }
                    router.push(`/article/${article.id}`);
                  }}
                  passHref
                >
                  <div className="relative w-full h-48 cursor-pointer">
                    <Image 
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Link>
              )}
              <div className="p-4">
                
                <Link 
                  href={`/article/${article.id}`} 
                  onClick={async (e) => {
                    e.preventDefault();
                    try {
                      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${article.id}/view`, {
                        method: "PATCH",
                      });
                      if (!res.ok) {
                        console.warn(`Failed to increment view count for article ${article.id}: ${res.status}`);
                      }
                    } catch (error: any) {
                      console.error('Error incrementing view count:', error);
                    }
                    router.push(`/article/${article.id}`);
                  }}
                  passHref
                >
                  <h3 className="font-semibold text-lg mb-2 text-gray-800 hover:text-[#F81539] transition-colors cursor-pointer line-clamp-2">
                    {article.title}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 mb-1">
                  By {article.author.name} - {new Date(article.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {truncateText(article.content.replace(/<[^>]+>/g, ''), 100)}
                </p>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xs text-gray-500">{new Date(article.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span> 
                  <FavoriteButton articleId={article.id} /> 
                  
                  <Link 
                    href={`/article/${article.id}`} 
                    onClick={async (e) => {
                      e.preventDefault();
                      try {
                        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${article.id}/view`, {
                          method: "PATCH",
                        });
                        if (!res.ok) {
                          console.warn(`Failed to increment view count for article ${article.id}: ${res.status}`);
                        }
                      } catch (error: any) {
                        console.error('Error incrementing view count:', error);
                      }
                      router.push(`/article/${article.id}`);
                    }}
                    passHref
                  >
                     <span className="text-[#F81539] hover:underline cursor-pointer font-medium">
                       Read more &rarr;
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
