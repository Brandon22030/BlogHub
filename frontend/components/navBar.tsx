"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchAvatar from "./search&avatar";
import Mega_categories from "./mega_categories";
import Pages from "./pages";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import NotificationBell from "./notifications/NotificationBell";

export function NavBar() {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = (id: number) => {
    setActiveMenu((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        event.target instanceof Node &&
        !menuRef.current.contains(event.target)
      ) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3001/user/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur :",
          error
        );
      }
    };

    fetchUser();
  }, []);

  const menus = [
    { id: 0, name: "Categories", SubmenuComponent: Mega_categories },
    {
      id: 1,
      name: "Pages",
      SubmenuComponent: (props: any) => <Pages {...props} />,
    },
    { id: 2, name: "Contact us", href: "/contact", SubmenuComponent: null },
    { id: 3, name: "About Us", href: "/about", SubmenuComponent: null },
  ];

  const pathname = usePathname();

  return (
    <nav ref={menuRef} className="relative flex justify-between items-center z-20 mx-20 mt-10">
      <div className="flex items-center gap-[40px]">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="logo"
            width={120}
            height={48}
            priority
            className="w-[7rem]"
          />
        </Link>
        <ul className="flex gap-5">
          {menus.map(({ id, name, SubmenuComponent, href }) => (
            <li key={id} className="relative">
              {href ? (
                <Link href={href} legacyBehavior>
                  <a className="rounded-lg transition-colors duration-300 text-black text-sm flex items-center font-semibold cursor-pointer">
                    {name}
                  </a>
                </Link>
              ) : (
                <button className="items-center rounded-lg transition-colors duration-300">
                  <div
                    onClick={() => toggleMenu(id)}
                    className="text-black text-sm flex items-center font-semibold cursor-pointer"
                  >
                    {name}
                    {SubmenuComponent && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          activeMenu === id ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                  <div
                    className={`h-[.2rem] rounded-lg w-[1.5rem] transition-colors duration-500 ${
                      activeMenu === id
                        ? "bg-[#FC4308]"
                        : "group-hover:bg-[#FC4308]"
                    }`}
                  />
                </button>
              )}
              {/* Ligne orange sous le lien actif pour /contact et /about */}
              {href && ((href === "/contact" && pathname.startsWith("/contact")) || (href === "/about" && pathname.startsWith("/about"))) && (
                <div className="h-[.2rem] rounded-lg w-[1.5rem] bg-[#FC4308] absolute left-1/2 -translate-x-1/2 mt-1" />
              )}

              {SubmenuComponent && activeMenu === id && (
                <div
                  className={`absolute top-10 z-20 ${
                    id === 0
                      ? user
                        ? "-left-60 w-[75rem]"
                        : "-left-52 w-[75rem]"
                      : ""
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
                      {/* Passe la prop currentPage au sous-menu Pages si besoin */}
                      <SubmenuComponent
                        current={
                          typeof window !== "undefined" &&
                          (window.location.pathname.startsWith("/blog") ||
                            window.location.pathname.startsWith("/faq") ||
                            window.location.pathname.startsWith("/terms") ||
                            window.location.pathname.startsWith("/privacy"))
                            ? window.location.pathname.split("/")[1]
                            : undefined
                        }
                      />{" "}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Barre de recherche, Notifications & Avatar */}
      <div className="flex items-center gap-4">
        {/* {user && <NotificationBell />} */}
        <SearchAvatar />
      </div>
    </nav>
  );
}
