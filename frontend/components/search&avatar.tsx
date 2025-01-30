"use client";
import { useState } from "react";
import {
  FaSearch,
  FaEllipsisV,
  FaBookmark,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react"; // Assurez-vous d'avoir lucide-react installé.
import Image from "next/image";

export default function SearchAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCliqued, setIsCliqued] = useState(false);

  return (
    <div className="flex items-center w-[30rem] justify-between">
      {/* Barre de recherche */}
      <div className="relative flex items-center flex-1 max-w-lg mx-4 bg-gray-100 rounded-lg">
        {/* Icône Menu (3 points) */}
        <button className="p-2">
          <FaEllipsisV className="text-black" />
        </button>
        <input
          type="text"
          placeholder="Search Anything"
          className="w-full px-4 py-2 text-gray-700 bg-transparent rounded-full focus:outline-none"
        />
        <FaSearch className="absolute right-3 text-black" />
      </div>

      {/* Profil utilisateur */}
      <div
        className="relative flex items-center gap-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          src="/avatar.png" // Remplace par le bon chemin
          alt="User"
          width={48}
          height={48}
          className="w-10 h-10 rounded-md object-cover"
        />
        <span className="font-semibold">User name</span>
        {isOpen ? (
          <Image
            className=""
            src="/arrow_down_open.svg"
            alt="logo"
            width={30}
            height={30}
            priority
          />
        ) : (
          <Image
            className=""
            src="/arrow_down.svg"
            alt="logo"
            width={30}
            height={30}
            priority
          />
        )}
      </div>

      {/* Icône signet */}
      <button className="p-2" onClick={() => setIsCliqued(!isCliqued)}>
        {isCliqued ? (
          <Image
            className=""
            src="/signet_open.svg"
            alt="logo"
            width={48}
            height={48}
            priority
          />
        ) : (
          <Image
            className=""
            src="/signet.svg"
            alt="logo"
            width={48}
            height={48}
            priority
          />
        )}
      </button>
    </div>
  );
}
