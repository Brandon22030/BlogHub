"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion"; // Ajout de Framer Motion

const categories = [
  {
    id: 1,
    title: "Blog",
    slug: "/categories/car",
  },
  {
    id: 2,
    title: "FAQ",
    slug: "/categories/car",
  },
  {
    id: 3,
    title: "Terms & Conditions",
    slug: "/categories/car",
  },
  {
    id: 4,
    title: "Privacy Policy",
    slug: "/categories/car",
  },
];

export default function Pages() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  return (
    <div className="flex gap-8 p-3 bg-white rounded-xl shadow-lg transition">
      {/* Partie principale */}
      <div className="">
        {categories.map((category) => (
          <Link href={category.slug} key={category.id}>
            <div
              key={category.id}
              className={`flex items-start hover:bg-[#F81539] text-[#3E3232]  hover:text-white gap-4 p-3 rounded-xl transition-all ${
                activeCategory === category.id ? "bg-red-100" : "bg-transparent"
              }`}
            >
              <div className="hover:text-white">
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: category.id * 0.1 }}
                  className={`font-bold text-lg  flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                    activeCategory === category.id
                      ? "border-b-4 text-[#F81539]"
                      : "border-transparent"
                  }`}
                >
                  <span className="bg-[#F81539] text-xl w-1.5 h-3 rounded-full"></span>{" "}
                  {category.title}
                </motion.div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
