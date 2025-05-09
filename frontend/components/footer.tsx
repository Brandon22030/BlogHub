"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f8f8f8] border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-4 py-6 px-4 md:flex-row md:justify-between md:items-center md:text-left md:gap-4 md:py-6 md:px-12">
        {/* Logo centré et réduit sur mobile */}
        <div className="flex items-center justify-center gap-2 w-full md:w-auto">
          <Image
            src="/logo.svg"
            alt="Logo BlogHub"
            width={96}
            height={96}
            className="w-24 h-24 md:w-28 md:h-28"
          />
        </div>
        {/* Liens centraux, wrap et centre sur mobile */}
        <nav className="flex text-black flex-wrap justify-center gap-4 md:gap-10 w-full md:w-auto">
          <Link href="/about" className="footer-link">
            À propos
          </Link>
          <Link href="/contact" className="footer-link">
            Contact
          </Link>
          <Link href="/faq" className="footer-link">
            FAQ
          </Link>
          <Link href="/privacy" className="footer-link">
            Politique de confidentialité
          </Link>
        </nav>
        {/* Copyright centré sur mobile, aligné à droite sur desktop */}
        <div className="text-sm text-gray-400 flex flex-col items-center gap-1 w-full md:w-auto md:flex-row md:items-center md:justify-end md:gap-1 md:text-right">
          <span> {new Date().getFullYear()} BlogHub</span>
          <span className="hidden md:inline">·</span>
          <span className="text-[#FC4308]">
            Fait avec{" "}
            <span className="animate-pulse">❤️ par Leidon&apos;s Bear</span>
          </span>
        </div>
      </div>
      <style jsx>{`
        .footer-link {
          position: relative;
          color: #3e3232;
          font-weight: 500;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: #fc4308;
        }
        .footer-link::after {
          content: "";
          display: block;
          height: 2px;
          width: 0;
          background: #fc4308;
          transition: width 0.3s;
          border-radius: 1px;
          margin-top: 2px;
        }
        .footer-link:hover::after {
          width: 100%;
        }
      `}</style>
    </footer>
  );
}
