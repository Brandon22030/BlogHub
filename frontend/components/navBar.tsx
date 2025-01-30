"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // Assurez-vous d'avoir lucide-react installé.
import Image from "next/image";
import Link from "next/link";
import SearchAvatar from "./search&avatar";

export function NavBar() {
  const [activeMenu, setActiveMenu] = useState(null);

  const toggleMenu = (menu) => {
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  const menus = [
    {
      name: "Categories",
      submenus: ["Sous-menu 1", "Sous-menu 2", "Sous-menu 3"],
    },
    {
      name: "Pages",
      submenus: ["Sous-menu A", "Sous-menu B", "Sous-menu C"],
    },
    {
      name: "Contact us",
    },
    {
      name: "About Us",
    },
  ];

  return (
    <nav className="flex items-center">
      <div className="container mx-auto gap-[50px] flex items-center">
        <Image
          className=""
          src="/logo.svg"
          alt="logo"
          width={120}
          height={48}
          priority
        />
        <ul className="flex">
          {menus.map((menu, index) => (
            <li key={index} className="relative">
              <button className="items-center gap-2 px-3 rounded-lg transition-colors duration-300 group">
                <div
                  onClick={() => toggleMenu(index)}
                  className="flex items-center gap-1 font-semibold"
                >
                  {menu.name}
                  {menu.submenus ? (
                    activeMenu === index ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )
                  ) : (
                    ""
                  )}
                </div>
                <div
                  className={`h-[.2rem] rounded-lg w-[1.5rem] group-hover:bg-[#FC4308] transition-colors duration-500 ${
                    activeMenu === index ? "bg-[#FC4308]" : ""
                  }`}
                ></div>
              </button>
              {activeMenu === index && (
                <ul
                  className={`absolute left-0 mt-2 w-40 bg-gray-700 rounded-lg shadow-lg overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                    activeMenu === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  {menu.submenus.map((submenu, subIndex) => (
                    <li key={subIndex}>
                      <a
                        href="#"
                        className="block px-4 py-2 hover:bg-gray-600 rounded-lg transition-colors duration-300"
                      >
                        {submenu}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Second part with search bar & avatar */}
      <div>
        <SearchAvatar />
      </div>
    </nav>
  );
}
