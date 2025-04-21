"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion"; // Ajout de Framer Motion

const navPages = [
  {
    id: 1,
    title: "Blog",
    slug: "/blog",
    // icon: "/blog.svg",
  },
  {
    id: 4,
    title: "FAQ",
    slug: "/faq",
    // icon: "/faq.svg",
  },
  {
    id: 5,
    title: "Terms & Conditions",
    slug: "/terms",
    // icon: "/terms.svg",
  },
  {
    id: 6,
    title: "Privacy Policy",
    slug: "/privacy",
    // icon: "/privacy.svg",
  },
];

interface PagesProps {
  current?: string;
}

export default function Pages({ current }: PagesProps) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  return (
    <div className="w-72 bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-6 border border-gray-100">
      <div>
        <ul className="flex flex-col gap-1">
          {navPages.map((page) => (
            <li key={page.id}>
              <Link href={page.slug}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl group transition-all duration-150 
                    ${
                      (current === "blog" && page.slug === "/blog") ||
                      (current === "faq" && page.slug === "/faq") ||
                      (current === "terms" && page.slug === "/terms") ||
                      (current === "privacy" && page.slug === "/privacy")
                        ? "bg-[#FC4308] text-white cursor-default font-bold border border-[#FC4308]"
                        : `cursor-pointer hover:bg-[#FC4308]/90 hover:text-white ${activeCategory === page.id ? "bg-[#FC4308]/80 text-white" : "text-[#3E3232]"}`
                    }
                  `}
                  onMouseEnter={() => setActiveCategory(page.id)}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  <span className="font-semibold text-base tracking-wide">
                    {page.title}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
