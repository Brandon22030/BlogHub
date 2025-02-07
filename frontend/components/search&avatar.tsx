"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FaSearch, FaEllipsisV, FaBookmark } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react"; // Assurez-vous d'avoir lucide-react installé.
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

export default function SearchAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCliqued, setIsCliqued] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Fonction pour récupérer l'utilisateur
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      const res = await fetch("http://localhost:3001/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    };

    fetchUserProfile();
  }, []);

  // Fonction pour gérer la déconnexion
  const handleLogout = useCallback(() => {
    Cookies.remove("token");
    router.push("/login");
  }, [router]);

  // Fonction pour fermer le menu en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      {user ? (
        <div className="container flex items-center w-[31rem] justify-between">
          {/* Barre de recherche */}
          <div className="relative flex items-center flex-1 max-w-lg mx-4 bg-gray-100 rounded-lg">
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
          <div ref={menuRef} className="relative flex items-center gap-2">
            {/* Avatar utilisateur */}
            <Image
              src="/avatar.png"
              alt="User"
              width={48}
              height={48}
              className="w-10 h-10 rounded-md object-cover cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            />
            <span
              className="font-semibold cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            >
              {user.name}
            </span>

            {/* Chevron qui change en fonction de l'état du menu */}
            <button onClick={() => setIsOpen(!isOpen)} className="transition">
              {isOpen ? (
                <ChevronUp size={20} className="text-black" />
              ) : (
                <ChevronDown size={20} className="text-black" />
              )}
            </button>

            {/* Menu déroulant */}
            <div
              className={`absolute right-0 top-full mt-2 w-40 bg-white shadow-md rounded-lg border border-gray-200 transition-all duration-300 ease-in-out ${
                isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
              } origin-top`}
            >
              <ul className="flex flex-col">
                <Link href="/profile">
                  <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                    Profil
                  </li>
                </Link>
                <li
                  onClick={handleLogout}
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>

          {/* Icône signet */}
          <button className="p-2" onClick={() => setIsCliqued(!isCliqued)}>
            <Image
              src={isCliqued ? "/signet_open.svg" : "/signet.svg"}
              alt="Bookmark"
              className="font-bold"
              width={48}
              height={48}
              priority
            />
          </button>
        </div>
      ) : (
        <div className="flex gap-10 w-[18rem]">
          <Link
            href="/login"
            className="p-2 bg-[#FC4308] text-white font-semibold rounded-md ml-1 transition-all duration-200 ease-in-out hover:bg-[#FF5A1F] hover:text-black hover:scale-105"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="p-2 bg-[#FC4308] text-white font-semibold rounded-md ml-1 transition-all duration-200 ease-in-out hover:bg-[#FF5A1F] hover:text-black hover:scale-105"
          >
            S'enregistrer
          </Link>
        </div>
      )}
    </div>
  );
}
