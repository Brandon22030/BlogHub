"use client";

import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/breadcrumbs";
import { NavBar } from "@/components/navBar";
import Marked from "@/components/dashboard/marked";
import Send from "@/components/dashboard/send";
import MyPosts from "@/components/dashboard/myPosts";
import { useUser } from "@/context/UserContext";
import { useState } from "react";

// type UserProfile = {
//   name: string;
//   imageUrl?: string;
// };

export default function Profile() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("marked");

  const renderTab = () => {
    switch (activeTab) {
      case "marked":
        return <Marked />;
      case "create":
        return <Send />;
      case "posts":
        return <MyPosts />;
      default:
        return <Marked />;
    }
  };


  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-gray-600 font-bold text-lg">
          Aucun utilisateur trouvé.
        </span>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <Breadcrumbs />
      <div className="bg-[#F5F5F5] p-2 mb-[45px] rounded-xl mx-20 ">
        <div className="w-full mb-4">
          <Image
            className="w-full h-auto rounded-xl"
            src="/astral.svg"
            alt="astral"
            width={1491}
            height={150}
          />
        </div>
        <div className="flex justify-between items-center">
          {/* User Infos */}
          <div className="flex gap-3 items-center">
            <Image
              className="rounded-xl w-12 h-12 object-cover"
              src={user?.imageUrl || "/avatar.svg"}
              alt="profile"
              width={75}
              height={75}
            />
            <p className="text-[#3E3232] font-semibold">{user.userName}</p>
          </div>

          {/* User Menus */}
          <div className="flex space-x-4">
            {["marked", "create", "posts"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-2 transition text-[#3E3232] font-semibold duration-300 ${
                  activeTab === tab
                    ? "font-bold border-b-4 rounded-b-sm border-[#F81539]"
                    : "text-gray-600"
                }`}
              >
                {tab === "marked"
                  ? "Favoris"
                  : tab === "create"
                    ? "Créer un article"
                    : "Mes articles"}
              </button>
            ))}
          </div>

          {/* Edit Profile */}
          <Link href="/profile/edit">
            <div className="flex items-center gap-2 border-2 border-[#E6E6E6] py-3 px-4 rounded-xl cursor-pointer hover:bg-[#F81539] hover:bg-opacity-10 transition duration-300 ease-in-out">
              <Image src="/edit.svg" alt="edit" width={20} height={20} />
              <p className="text-[#F81539] font-semibold text-opacity-75">
                Edit Profile
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div className="mt-11">{renderTab()}</div>
    </div>
  );
}
