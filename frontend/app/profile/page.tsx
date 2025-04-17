"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";
import Breadcrumbs from "@/components/breadcrumbs";
import { NavBar } from "@/components/navBar";
import Marked from "@/components/dashboard/marked";
import Send from "@/components/dashboard/send";
import MyPosts from "@/components/dashboard/myPosts";
import { useUser } from "@/context/UserContext";

// type UserProfile = {
//   name: string;
//   imageUrl?: string;
// };

export default function Profile() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("marked");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const token = Cookies.get("token");

  const renderTab = () => {
    switch (activeTab) {
      case "marked":
        return <Marked />;
      case "create":
        return <Send />;
      case "posts":
        return (
          <MyPosts
            onPostClick={(postId: string) => router.push(`/posts/${postId}`)}
          />
        );
      default:
        return <Marked />;
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-red-600 font-bold text-lg">{error}</span>
      </div>
    );
  }

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
      <div className="bg-[#F5F5F5] p-2 mb-[45px] rounded-xl">
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
              className="rounded-xl container"
              src={
                user?.userImage || user?.imageUrl
                  ? (user?.userImage || user?.imageUrl).startsWith("/uploads/")
                    ? `http://localhost:3001${user?.userImage || user?.imageUrl}`
                    : user?.userImage || user?.imageUrl
                  : "/avatar.png"
              }
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
                  ? "Marked"
                  : tab === "create"
                    ? "Send Post"
                    : "Posts"}
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
