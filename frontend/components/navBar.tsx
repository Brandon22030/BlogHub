"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import SearchAvatar from "./search&avatar";
import Mega_categories from "./mega_categories";
import Pages from "./pages";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";

export function NavBar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [user, setUser] = useState(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  // Fonction pour basculer l'affichage du menu
  const toggleMenu = (id) => {
    setActiveMenu((prev) => (prev === id ? null : id));
  };

  // Fermer le menu en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Récupérer l'utilisateur via le token
  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      try {
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
      } catch (error) {
        console.error("Erreur lors de la récupération de l'utilisateur :", error);
      }
    };

    fetchUser();
  }, []);

  const menus = [
    { id: 0, name: "Categories", submenus: Mega_categories },
    { id: 1, name: "Pages", submenus: Pages },
    { id: 2, name: "Contact us", submenus: null },
    { id: 3, name: "About Us", submenus: null },
  ];

  return (
    <nav className={`relative flex w-full items-center z-20 ${!user ? "gap-[10rem]" : ""}`} ref={menuRef}>
      <div className="container mx-auto flex justify-center items-center gap-[50px]">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.svg" alt="logo" width={120} height={48} priority className="w-[10rem]" />
        </Link>

        {/* Menu Principal */}
        <ul className="flex w-full">
          {menus.map((menu) => (
            <li key={menu.id} className="relative w-full">
              <button className="items-center rounded-lg transition-colors duration-300">
                <div onClick={() => toggleMenu(menu.id)} className="flex items-center pr-4 font-semibold cursor-pointer">
                  {menu.name}
                  {menu.submenus && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${activeMenu === menu.id ? "rotate-180" : ""}`}
                    />
                  )}
                </div>
                <div className={`h-[.2rem] rounded-lg w-[1.5rem] transition-colors duration-500 ${activeMenu === menu.id ? "bg-[#FC4308]" : "group-hover:bg-[#FC4308]"}`}></div>
              </button>

              {/* Sous-menu déroulant */}
              {menu.submenus && activeMenu === menu.id && (
                <div
                  className={`absolute top-10 z-20 ${
                    menu.id === 0 && user ? "-left-60 w-[75rem]" : menu.id === 0 && !user ? "-left-52 w-[75rem]" : ""
                  }`}
                >
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="relative"
                    >
                      <menu.submenus />
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Barre de recherche & Avatar */}
      <div>
        <SearchAvatar />
      </div>
    </nav>
  );
}
