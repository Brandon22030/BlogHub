"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const [showText, setShowText] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => setShowText(true), 500); // Retard pour l'effet fade-in
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen text-white">
      <div className="h-[15rem]">
        <Image
          className=""
          src="/logo.svg"
          alt="logo"
          width={300}
          height={48}
          priority
        />
      </div>
      {/* Animation Glitch 404 */}
      <h1 className="text-8xl font-extrabold glitch text-black" data-text="404">
        404
      </h1>

      {/* Texte avec effet fade-in */}
      <p
        className={`text-lg mt-4 text-black transition-opacity duration-1000 ${
          showText ? "opacity-100" : "opacity-0"
        }`}
      >
        Oops! Cette page n'existe pas.
      </p>

      {/* Bouton animé */}
      <button
        onClick={() => router.push("/")}
        className="mt-6 px-6 py-3 bg-[#FC4308] hover:bg-[#F81539] text-white font-bold rounded-lg transition-transform duration-200 hover:scale-110"
      >
        Retour à l'accueil
      </button>

      {/* Styles pour l'effet glitch */}
      <style jsx>{`
        .glitch {
          position: relative;
          color: black;
          text-shadow: 2px 2px 0 #ff00ff, -2px -2px 0 #00ffff;
          animation: glitch 0.8s infinite alternate;
        }

        @keyframes glitch {
          0% {
            text-shadow: 2px 2px 0 #ff00ff, -2px -2px 0 #00ffff;
          }
          100% {
            text-shadow: -2px -2px 0 #ff00ff, 2px 2px 0 #00ffff;
          }
        }
      `}</style>
    </div>
  );
}
