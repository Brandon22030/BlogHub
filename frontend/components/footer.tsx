"use client";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f8f8f8] border-t border-gray-100 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 py-6 px-6 md:px-12">
        {/* Logo à gauche */}
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="BlogHub Logo" width={100} height={100} className="w-50 h-50" />
          {/* <span className="font-bold text-lg text-[#FC4308] hidden sm:block">BlogHub</span> */}
        </div>
        {/* Liens centraux */}
        <nav className="flex gap-6 md:gap-10 text-black">
          <Link href="/about" className="footer-link">About</Link>
          <Link href="/contact" className="footer-link">Contact</Link>
          <Link href="/faq" className="footer-link">FAQ</Link>
          <Link href="/privacy" className="footer-link">Privacy</Link>
        </nav>
        {/* Copyright à droite */}
        <div className="text-sm text-gray-400 flex items-center gap-1">
          <span>© {new Date().getFullYear()} BlogHub</span>
          <span className="hidden md:inline">·</span>
          <span className="text-[#FC4308]">Made with <span className="animate-pulse">❤️ By Leidon&apos;s Bear</span></span>
        </div>
      </div>
      <style jsx>{`
        .footer-link {
          position: relative;
          color: #3E3232;
          font-weight: 500;
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: #FC4308;
        }
        .footer-link::after {
          content: '';
          display: block;
          height: 2px;
          width: 0;
          background: #FC4308;
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

