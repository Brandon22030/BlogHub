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
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SearchAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCliqued, setIsCliqued] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Supprime le token du stockage local
    router.push("/login"); // Redirige vers la page de connexion
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirige si l'utilisateur n'est pas authentifié
    }
  }, []);

  return (
    <div className="container flex items-center w-[30rem] justify-between">
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
      <div className="relative flex items-center gap-2 cursor-pointer">
        {/* Avatar utilisateur */}
        <Image
          src="/avatar.png"
          alt="User"
          width={48}
          height={48}
          className="w-10 h-10 rounded-md object-cover"
        />
        <span className="font-semibold">User name</span>

        {/* Bouton du menu */}
        <button onClick={() => setIsOpen(!isOpen)} className="transition">
          <Image
            src={isOpen ? "/arrow_down_open.svg" : "/arrow_down.svg"}
            alt="Toggle menu"
            width={30}
            height={30}
            priority
          />
        </button>

        {/* Menu déroulant */}
        <div
          className={`absolute right-0 top-full mt-2 w-40 bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 ease-in-out ${
            isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
          } origin-top`}
        >
          <ul className="flex flex-col">
            <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
              Profil
            </li>
            <li onClick={handleLogout} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
              Logout
            </li>
          </ul>
        </div>
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
