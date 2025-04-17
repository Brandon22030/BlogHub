"use client";

import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";

const staticCards = [
  {
    title: "How to Drive a Car Safely",
    description:
      "Ah, The Joy Of The Open Road—It's A Good Feeling. But If You're New To Driving, You May...",
    image: "/banner/car.svg",
  },
  {
    title: "How to Make Dance Music",
    description:
      "Download Torrents From Verified Or Trusted Uploaders. If You're A BitTorrent User Looking...",
    image: "/banner/woman.svg",
  },
];

const carouselCards = [
  {
    title: "Why I Stopped Using Multiple Monitor",
    description:
      "A Single Monitor Manifesto — Many Developers Believe Multiple Monitors Improve Productivity...",
    image: "/banner/computer.svg",
  },
  {
    title: "How to Drive a Car Safely",
    description:
      "Ah, The Joy Of The Open Road—It's A Good Feeling. But If You're New To Driving, You May...",
    image: "/banner/car.svg",
  },
  {
    title: "How to Make Dance Music",
    description:
      "Download Torrents From Verified Or Trusted Uploaders. If You're A BitTorrent User Looking...",
    image: "/banner/woman.svg",
  },
];

export default function BlogSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? carouselCards.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === carouselCards.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="flex space-x-4 mt-16">
      {/* Static Cards */}
      {staticCards.map((card, idx) => (
        <div
          key={idx}
          className="w-80 h-96 rounded-xl overflow-hidden shadow-md relative"
        >
          <Image
            src={card.image}
            alt={card.title}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl text-center space-y-2">
            <h3 className="font-semibold text-sm text-black">{card.title}</h3>
            <p className="text-xs text-gray-600">{card.description}</p>
          </div>
        </div>
      ))}

      {/* Carousel Card */}
      <div className="relative w-[600px] h-96 rounded-xl overflow-hidden shadow-md">
        <Image
          src={carouselCards[currentIndex].image}
          alt={carouselCards[currentIndex].title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-between px-3">
          <button
            onClick={handlePrev}
            className="p-2 bg-white text-black rounded-lg shadow"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={handleNext}
            className="p-2 bg-white text-black rounded-lg shadow"
          >
            <FaChevronRight />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl text-center space-y-2">
          <h3 className="font-semibold text-md text-black">
            {carouselCards[currentIndex].title}
          </h3>
          <p className="text-xs text-gray-600">
            {carouselCards[currentIndex].description}
          </p>
        </div>
      </div>
    </div>
  );
}
