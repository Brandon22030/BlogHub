"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function Home_Categories() {
  const categories = [
    { name: "Food", image: "/food.svg" },
    { name: "Animal", image: "/animal.svg" },
    { name: "Car", image: "/car.svg" },
    { name: "Sport", image: "/sport.svg" },
    { name: "Music", image: "/music.svg" },
    { name: "Technology", image: "/techno.svg" },
    { name: "Abstract", image: "/abstract.svg" },
    { name: "Anime", image: "/anime.png" },
    { name: "Games", image: "/game.jpg" },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);

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

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <div className="relative bg-[#F5F5F5] rounded-lg w-full p-6">
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
                src={category.image}
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
