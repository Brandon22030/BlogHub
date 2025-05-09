"use client";

import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Ajout de useRouter
import Link from 'next/link'; // Importer Link pour la navigation

interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: {
    id: string;
    name: string;
    imageUrl?: string;
  };
  categoryId: string;
  status: string;
  createdAt: string; // Ou Date
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

// Fonction pour tronquer le contenu
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export default function Banner() { // Renommé BlogSection en Banner pour correspondre au nom du fichier
  const router = useRouter(); // Instance de useRouter
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/articles?limit=3&page=1&sortBy=createdAt&sortOrder=desc`,
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch articles: ${response.status} ${response.statusText}`,
          );
        }
        const result: ApiResponse = await response.json();
        setArticles(result.data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An unknown error occurred while fetching articles.";
        setError(message);
        console.error("Error fetching articles:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? articles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === articles.length - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-16 h-96">
        <p className="text-xl text-gray-500">Loading banner...</p>
        {/* Vous pouvez ajouter un spinner ici */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center mt-16 h-96 bg-red-100 p-4 rounded-lg">
        <p className="text-xl text-red-700">Error loading articles for banner:</p>
        <p className="text-md text-red-600">{error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex justify-center items-center mt-16 h-96">
        <p className="text-xl text-gray-500">No articles to display in banner.</p>
      </div>
    );
  }

  const currentArticle = articles[currentIndex];

  return (
    <div className="flex justify-center mt-16"> {/* Centrer le carrousel */}
      {/* Carousel Card */}
      <div className="relative w-full max-w-3xl h-[450px] rounded-xl overflow-hidden shadow-lg group">
        {currentArticle.imageUrl ? (
          <Image
            src={currentArticle.imageUrl}
            alt={currentArticle.title}
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            priority={currentIndex === 0} // Charger la première image en priorité
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        {articles.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 left-3 transform -translate-y-1/2 p-3 bg-white/50 hover:bg-white/80 text-black rounded-full shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-10"
              aria-label="Previous article"
            >
              <FaChevronLeft size={24}/>
            </button>
            <button
              onClick={handleNext}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 p-3 bg-white/50 hover:bg-white/80 text-black rounded-full shadow-md transition-opacity duration-300 opacity-0 group-hover:opacity-100 z-10"
              aria-label="Next article"
            >
              <FaChevronRight size={24}/>
            </button>
          </>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          
          <Link 
            href={`/article/${currentArticle.id}`} 
            onClick={async (e) => {
              e.preventDefault();
              try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${currentArticle.id}/view`, {
                  method: "PATCH",
                });
                if (!res.ok) {
                  console.warn(`Failed to increment view count for article ${currentArticle.id}: ${res.status}`);
                }
              } catch (error: unknown) {
                if (error instanceof Error) {
                  console.error('Error incrementing view count:', error.message);
                } else {
                  console.error('An unknown error occurred while incrementing view count:', error);
                }
              }
              router.push(`/article/${currentArticle.id}`);
            }}
            passHref
          >
            <h3 className="font-bold text-3xl mb-2 hover:underline cursor-pointer">
              {currentArticle.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-200 mb-1">
            By {currentArticle.author.name} - {new Date(currentArticle.createdAt).toLocaleDateString()}
          </p>
          <p className="text-md text-gray-300 line-clamp-3">
            {truncateText(currentArticle.content.replace(/<[^>]+>/g, ''), 150)} 
          </p>
          
          <Link 
            href={`/article/${currentArticle.id}`} 
            onClick={async (e) => {
              e.preventDefault();
              try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${currentArticle.id}/view`, {
                  method: "PATCH",
                });
                if (!res.ok) {
                  console.warn(`Failed to increment view count for article ${currentArticle.id}: ${res.status}`);
                }
              } catch (error: unknown) {
                if (error instanceof Error) {
                  console.error('Error incrementing view count:', error.message);
                } else {
                  console.error('An unknown error occurred while incrementing view count:', error);
                }
              }
              router.push(`/article/${currentArticle.id}`);
            }}
            passHref
          >
             <span className="mt-3 inline-block text-indigo-300 hover:text-indigo-100 font-semibold hover:underline cursor-pointer">
                Lire plus &rarr;
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
