"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // Assurez-vous d'avoir lucide-react installé.
import Image from "next/image";
import Link from "next/link";
import SearchAvatar from "./search&avatar";
import Mega_categories from "./mega_categories";
import { motion, AnimatePresence } from "framer-motion";
import Pages from "./pages";
import { useEffect } from "react";
import Cookies from "js-cookie";

export function NavBar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [user, setUser] = useState(null);

  const toggleMenu = (id) => {
    setActiveMenu((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");

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
    fetchUser();
  }, []);

  const menus = [
    {
      id: 0,
      name: "Categories",
      submenus: Mega_categories,
    },
    {
      id: 1,
      name: "Pages",
      submenus: Pages,
    },
    {
      id: 2,
      name: "Contact us",
      submenus: null,
    },
    {
      id: 3,
      name: "About Us",
      submenus: null,
    },
  ];

  return (
    <nav className="relative flex w-full items-center z-20">
      <div className="container w-[50%] mx-auto gap-[50px] flex items-center">
        <Image
          className=""
          src="/logo.svg"
          alt="logo"
          width={120}
          height={48}
          priority
        />
        <ul className="flex w-full">
          {menus.map((menu) => (
            <li key={menu.id} className="relative w-full">
              <button className="items-center rounded-lg transition-colors duration-300">
                <div
                  onClick={() => toggleMenu(menu.id)}
                  className="flex items-center pr-4 font-semibold"
                >
                  {menu.name}
                  {menu.submenus && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${
                        activeMenu === menu.id ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  )}
                </div>
                <div
                  className={`h-[.2rem] rounded-lg w-[1.5rem] group-hover:bg-[#FC4308] transition-colors duration-500 ${
                    activeMenu === menu.id ? "bg-[#FC4308]" : ""
                  }`}
                ></div>
              </button>
              {menu.submenus && activeMenu === menu.id && (
                <div
                  className={`top-10 absolute z-20  ${
                    menu.id === 0 && user
                    ? "-left-60 w-[75rem]"
                    : menu.id === 0 && !user
                      ? "-left-80 w-[75rem]"
                      : ""
                  } `}
                >
                  {/* <div className="absolute inset-0 bg-black opacity-40 shadow-2xl rounded-lg pointer-events-none"></div> */}
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }} // Applique la transition de disparition
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

      {/* Second part with search bar & avatar */}
      <div className="">
        <SearchAvatar />
      </div>
    </nav>
  );
}
