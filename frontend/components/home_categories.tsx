"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
}

const fetchCategories = async () => {
  const res = await fetch("https://bloghub-8ljb.onrender.com/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

/**
 * Home_Categories component for BlogHub.
 * Fetches and displays a horizontally scrollable list of blog categories.
 * @returns JSX.Element - The categories carousel section
 */
export default function Home_Categories() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setShowLeftShadow(scrollLeft > 10);
        setShowRightShadow(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    async function loadCategories() {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories", error);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  if (loading)
    return (
      <>
        <div
          role="status"
          className="relative bg-[#F5F5F5] mt-[45px] rounded-lg w-full p-6"
        >
          <div className=" w-full flex space-x-[24px] px-4 justify-between items-start animate-pulse">
            <div className="bg-gray-300 relative group overflow-hidden rounded-xl shadow-lg w-[200px] h-[60px]"></div>
            <div className="bg-gray-300 relative group overflow-hidden rounded-xl shadow-lg w-[200px] h-[60px]"></div>
            <div className="bg-gray-300 relative group overflow-hidden rounded-xl shadow-lg w-[200px] h-[60px]"></div>
            <div className="bg-gray-300 relative group overflow-hidden rounded-xl shadow-lg w-[200px] h-[60px]"></div>
            <div className="bg-gray-300 relative group overflow-hidden rounded-xl shadow-lg w-[200px] h-[60px]"></div>
          </div>
        </div>
      </>
    );

  return (
    <div className="relative mt-[45px]  bg-[#F5F5F5] rounded-lg w-full p-6">
      {/* Effets flous FIXES en dehors du scroll */}
      {showLeftShadow && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
      )}
      {showRightShadow && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
      )}

      {/* Liste scrollable */}
      <div
        ref={scrollRef}
        className="flex space-x-[24px] overflow-x-auto scrollbar-hide px-4"
      >
        {categories.map((category, index) => (
          <div
            key={index}
            className="relative cursor-pointer group overflow-hidden rounded-xl shadow-lg min-w-[200px]"
          >
            {/* Image */}
            <div className="w-[200px] h-[60px] overflow-hidden">
              <Image
                src={category.imageUrl || "/placeholder-category.svg"}
                alt={category.name}
                width={200}
                height={150}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 blur-sm group-hover:blur-none"
              />
            </div>
            {/* Overlay sombre */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500"></div>
            {/* Titre centré */}
            <h3 className="absolute inset-0 flex items-center justify-center text-white text-lg font-semibold">
              {category.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
