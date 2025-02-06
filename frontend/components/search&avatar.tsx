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
import Cookies from "js-cookie";
import Link from "next/link";

export default function SearchAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCliqued, setIsCliqued] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login"); // Redirige vers la page de connexion
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get("token");
      // if (!token) {
      //   router.push("/login"); // Redirige si l'utilisateur n'est pas authentifié
      // }
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

  return (
    <div>
      {user ? (
        <div className="container flex items-center w-[31rem] justify-between">
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
            <span className="font-semibold">{user.name}</span>

            {/* <span className="font-semibold">{user.name}</span> */}

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
      ) : (
        <div className="flex gap-10">
          {/* Lien "Se connecter" avec soulignement et déplacement */}
          <Link
            href="/login"
            className="p-2 bg-[#FC4308] text-white font-semibold rounded-md ml-1 transition-all duration-200 ease-in-out hover:bg-[#FF5A1F] hover:text-black hover:scale-105"
          >
            Se connecter
          </Link>

          {/* Bouton "S'enregistrer" avec hover amélioré */}
          <Link
            href="/register"
            className="p-2 bg-[#FC4308] text-white font-semibold rounded-md ml-1 transition-all duration-200 ease-in-out hover:bg-[#FF5A1F] hover:text-black hover:scale-105"
          >
            S'enregistrer
          </Link>
        </div>

        // <span className="font-semibold">Chargement...</span>
      )}
    </div>
  );
}
