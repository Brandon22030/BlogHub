"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
}

const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch("http://localhost:3001/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

/**
 * Mega_Categories component for BlogHub.
 * Displays a mega menu with categorized links and images for different blog topics.
 * @returns JSX.Element - The mega categories menu
 */
export default function Mega_Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Chargement des catégories...</div>;
  if (error) return <div className="p-8 text-red-500">Erreur: {error}</div>;

  return (
    <div className="ml-8 flex gap-8 p-4 bg-white rounded-xl shadow-md border-gray-200 transition">
      <div className="grid grid-cols-3 gap-6 w-full">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="relative group rounded-xl overflow-hidden flex items-center justify-center h-32 min-h-[8rem] bg-gray-200 shadow transition-transform duration-300 hover:scale-105"
            style={{ minWidth: "10rem" }}
          >
            <Image
              src={category.imageUrl || "/mega_default.svg"}
              alt={category.name}
              fill
              className="object-cover z-0 group-hover:scale-110 transition-transform duration-300"
              style={{ filter: "brightness(0.5)" }}
            />
            <span className="absolute inset-0 flex items-center justify-center z-10">
              <span className="text-white font-bold text-xl drop-shadow-lg text-center px-2">
                {category.name}
              </span>
            </span>
            {/* Overlay for readability */}
            <span className="absolute inset-0 bg-black/40 z-5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
