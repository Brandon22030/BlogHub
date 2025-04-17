"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const categories = [
  {
    id: 1,
    title: "Car",
    // slug: "/categories/car",
    image: "/mega_car.svg",
    items: [
      { name: "Car News", link: "/categories/car/news" },
      { name: "Car Articles", link: "/categories/car/articles" },
      { name: "Car Prices", link: "/categories/car/prices" },
      { name: "Car Video", link: "/categories/car/video" },
    ],
  },
  {
    id: 2,
    title: "Girlish",
    // slug: "/categories/girlish",
    image: "/mega_girlish.svg",
    items: [
      { name: "Dance Training", link: "/categories/girlish/dance" },
      { name: "Movies And Books", link: "/categories/girlish/movies" },
      { name: "Cooking Training", link: "/categories/girlish/cooking" },
      { name: "Child Custody", link: "/categories/girlish/custody" },
    ],
  },
  {
    id: 3,
    title: "Cooking",
    // slug: "/categories/cooking",
    image: "/mega_cooking.svg",
    items: [
      { name: "Cake Baking", link: "/categories/cooking/cake" },
      { name: "Cooking Training", link: "/categories/cooking/training" },
      { name: "Drink Training", link: "/categories/cooking/drinks" },
      { name: "Fast Foods", link: "/categories/cooking/fastfood" },
    ],
  },
  {
    id: 4,
    title: "Technology",
    // slug: "/categories/technology",
    image: "/mega_techno.svg",
    items: [
      { name: "Operating System", link: "/categories/cooking/cake" },
      { name: "Internet And Network", link: "/categories/cooking/training" },
      { name: "Camera", link: "/categories/cooking/drinks" },
      { name: "Laptop And Desktop", link: "/categories/cooking/fastfood" },
    ],
  },
  {
    id: 5,
    title: "Sport",
    // slug: "/categories/sport",
    image: "/mega_sport.svg",
    items: [
      { name: "Sports News", link: "/categories/cooking/cake" },
      { name: "Football Results", link: "/categories/cooking/training" },
      { name: "Boxing Results", link: "/categories/cooking/drinks" },
      { name: "Volleyball Results", link: "/categories/cooking/fastfood" },
    ],
  },
  {
    id: 6,
    title: "Music",
    // slug: "/categories/music",
    image: "/mega_music.svg",
    items: [
      { name: "Composition", link: "/categories/cooking/cake" },
      { name: "Effect of Music", link: "/categories/cooking/training" },
      { name: "Music Mix", link: "/categories/cooking/drinks" },
      { name: "Music Style", link: "/categories/cooking/fastfood" },
    ],
  },
];

/**
 * Mega_Categories component for BlogHub.
 * Displays a mega menu with categorized links and images for different blog topics.
 * @returns JSX.Element - The mega categories menu
 */
export default function Mega_Categories() {

  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  return (
    <div className="flex gap-8 p-3 bg-white rounded-xl shadow-md border-gray-200 transition">
      {/* Partie principale */}
      <div className="grid grid-cols-3 gap-6 w-full">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`flex items-start gap-4 p-3 rounded-xl transition-all ${
              activeCategory === category.id ? "bg-red-100" : "bg-transparent"
            }`}
          >
            <div className="relative w-[190px] h-[190px] rounded-xl overflow-hidden">
              {/* <Link href={category.slug}> */}
              <Image
                src={category.image}
                alt={category.title}
                fill
                className="object-cover"
              />
              {/* </Link> */}
            </div>
            <div>
              {/* <Link href={category.slug}> */}
              <div
                className={`font-bold text-lg text-[#3E3232] flex items-center gap-1 px-2 py-1 rounded-lg transition-all ${
                  activeCategory === category.id
                    ? "border-b-4 text-[#F81539]"
                    : "border-transparent"
                }`}
              >
                <span className="bg-[#F81539] text-xl w-1 h-3 rounded-full"></span>{" "}
                {category.title}
              </div>
              {/* </Link> */}
              <ul className="text-black space-y-1 mt-1">
                {category.items.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.link}
                      className="block px-2 py-1 text-sm font-semibold hover:font-bold rounded-lg hover:text-[#F81539] transition-all"
                    >
                      {item.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Carrousel Vertical Scrollable */}
      {/* <div className="w-1/4 h-72 overflow-y-auto rounded-xl">
        <div className="space-y-4">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="relative w-full h-28 rounded-xl overflow-hidden transition-all hover:scale-105"
              whileHover={{ scale: 1.05 }}
            >
              <Link href={category.slug}>
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover cursor-pointer transition hover:opacity-80"
                />
              </Link>
              <Link
                href={category.slug}
                className="absolute bottom-2 left-2 bg-gray-200 px-3 py-1 rounded-lg text-sm hover:bg-gray-300 transition"
              >
                {category.title}
              </Link>
            </motion.div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
