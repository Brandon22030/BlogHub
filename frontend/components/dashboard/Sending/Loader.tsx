import React from "react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[320px] w-full h-full">
      <svg className="animate-spin h-8 w-8 text-[#F81539] mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <span className="text-[#F81539] font-semibold">Chargement de l'image...</span>
    </div>
  );
}
