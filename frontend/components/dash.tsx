"use client";

import { useState } from "react";

export default function DashboardMenu() {
  const [activeTab, setActiveTab] = useState("favoris");

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Menu */}
      <div className="flex space-x-4 border-b pb-2">
        {["favoris", "create", "posts"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 ${
              activeTab === tab
                ? "border-b-2 border-blue-500 font-semibold"
                : "text-gray-500"
            }`}
          >
            {tab === "favoris"
              ? "Favoris"
              : tab === "create"
                ? "Créer un post"
                : "Mes posts"}
          </button>
        ))}
      </div>

      {/* Contenu Dynamique */}
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        {activeTab === "favoris" && <p>📌 Contenu des favoris</p>}
        {activeTab === "create" && <p>📝 Formulaire de création de post</p>}
        {activeTab === "posts" && <p>📃 Liste de mes posts</p>}
      </div>
    </div>
  );
}
