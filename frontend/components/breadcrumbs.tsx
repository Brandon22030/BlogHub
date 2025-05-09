"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Breadcrumbs = () => {
  const pathname = usePathname(); // Récupère le chemin actuel
  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <nav className="text-sm text-gray-500 py-[45px] mx-20 ">
      <ul className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-black font-bold">
            Accueil
          </Link>
        </li>
        {pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/");
          const isLast = index === pathSegments.length - 1;

          return (
            <li key={href} className="flex items-center">
              <span className="mx-2">›</span>
              {!isLast ? (
                <Link href={href} className="hover:underline">
                  {decodeURIComponent(segment)}
                </Link>
              ) : (
                <span className="text-gray-400">
                  {decodeURIComponent(segment)}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
