"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { FaSearch, FaEllipsisV } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

/**
 * SearchAvatar component for BlogHub.
 * Renders the search bar and user avatar with a dropdown menu for profile and logout actions.
 * @returns JSX.Element - The search bar and avatar dropdown
 */
export default function SearchAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCliqued, setIsCliqued] = useState(false);
  const { user } = useUser();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const handleLogout = useCallback(() => {
    Cookies.remove("token");
    router.push("/login");
  }, [router]);

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

  // DEBUG: Affiche l'objet user dans la console pour vérifier le rôle
  if (typeof window !== 'undefined') {
    console.log('USER CONTEXT in SearchAvatar:', user);
  }
  const menuItems = [
    { label: "Profil", href: "/profile", onClick: null },
    ...(user?.role?.toLowerCase() === 'admin' ? [{ label: 'Administration', href: '/admin', onClick: null }] : []),
    { label: "Logout", href: "#", onClick: handleLogout },
  ];

  return (
    <div>
      {user ? (
        <div className="container w-full flex items-center justify-between">
          <div className="relative flex items-center gap-3 flex-1 mx-4 px-4 py-2 bg-gray-100 rounded-lg">
            <button className="p-2">
              <FaEllipsisV className="text-black" />
            </button>

            <input
              type="text"
              placeholder="Search Anything"
              className="flex-1 text-sm text-gray-700 bg-transparent focus:outline-none"
            />

            <FaSearch className="text-black" />
          </div>

          <div ref={menuRef} className="relative flex items-center gap-2">
            <Image
              src={user?.imageUrl || "/avatar.png"}
              alt="User"
              width={48}
              height={48}
              className="w-10 h-10 rounded-md object-cover cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
            />
            <span
              className="font-semibold cursor-pointer text-sm text-black"
              onClick={() => setIsOpen(!isOpen)}
            >
              {user?.userName}
            </span>

            <button onClick={() => setIsOpen(!isOpen)} className="transition">
              {isOpen ? (
                <ChevronUp size={20} className="text-black" />
              ) : (
                <ChevronDown size={20} className="text-black" />
              )}
            </button>

            <div
              className={`absolute right-0 top-full mt-2 w-40 bg-white shadow-md p-3 rounded-lg border border-gray-200 transition-all duration-300 ease-in-out ${
                isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0"
              } origin-top`}
            >
              <AnimatePresence>
                <motion.ul
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="font-bold text-lg borderp-0 items-center gap-1 rounded-lg transition-all flex flex-col"
                >
                  {menuItems.map((item, index) => (
                    <div key={index} className="w-full">
                      {item.href !== "#" ? (
                        <Link
                          href={item.href}
                          onClick={item.onClick || undefined}
                          className="block px-4 py-2 m-0 items-center text-black text-sm rounded-lg w-full text-center hover:bg-[#FC4308] hover:text-white transition-all cursor-pointer"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <li
                          onClick={item.onClick || undefined}
                          className="block px-4 py-2 m-0 text-black text-sm rounded-lg w-full text-center hover:bg-[#FC4308] hover:text-white transition-all cursor-pointer"
                        >
                          {item.label}
                        </li>
                      )}
                    </div>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
          </div>

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
            className="p-2 text-sm bg-[#FC4308] text-white font-semibold rounded-md ml-1 transition-all duration-200 ease-in-out hover:bg-[#FF5A1F] hover:text-black hover:scale-105"
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="p-2 text-sm bg-[#FC4308] text-white font-semibold rounded-md ml-1 transition-all duration-200 ease-in-out hover:bg-[#FF5A1F] hover:text-black hover:scale-105"
          >
            S'enregistrer
          </Link>
        </div>
      )}
    </div>
  );
}
