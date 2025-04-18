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
    <div className="flex gap-8 p-3 bg-white rounded-xl shadow-md border-gray-200 transition">
      <div className="grid grid-cols-3 gap-6 w-full">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-red-50 transition-all"
          >
            <div className="relative w-24 h-24 rounded-xl overflow-hidden mb-2">
              <Image
                src={category.imageUrl || "/mega_default.svg"}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
            <Link
              href={`/categories/${category.slug}`}
              className="font-bold text-lg text-[#3E3232] hover:text-[#F81539] transition"
            >
              {category.name}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
