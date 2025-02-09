"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { FaSearch, FaEllipsisV } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function SearchAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCliqued, setIsCliqued] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      const res = await fetch("http://localhost:3001/user/profile", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    };

    fetchUserProfile();
  }, []);

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

  const menuItems = [
    { label: "Profil", href: "/profile", onClick: null },
    { label: "Logout", href: "#", onClick: handleLogout },
  ];

  return (
    <div>
      {user ? (
        <div className="container flex items-center w-[31rem] justify-between">
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

          <div ref={menuRef} className="relative flex items-center gap-2">
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
                    
                    <li
                      key={index}
                      onClick={item.onClick || undefined}
                      className="px-4 py-2 m-0 rounded-lg w-full text-center hover:bg-[#FC4308] hover:text-white transition-all cursor-pointer"
                    >
                      {item.href !== "#" ? (
                        <Link href={item.href}>{item.label}</Link>
                      ) : (
                        item.label
                      )}
                    </li>
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
