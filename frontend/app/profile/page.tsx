"use client";

import Breadcrumbs from "@/components/breadcrumbs";
import { NavBar } from "@/components/navBar";
import Image from "next/image";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Marked from "@/components/dashboard/marked";
import Send from "@/components/dashboard/send";
import MyPosts from "@/components/dashboard/myPosts";

// Typage du profil utilisateur
// Ajoute d'autres propriétés si besoin
// selon la réponse de ton backend

type UserProfile = {
  name: string;
  imageUrl?: string;
};

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState("marked");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      router.push("/");
      return;
    }
    const fetchUserProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:3001/user/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setError("Impossible de récupérer le profil utilisateur.");
        }
      } catch (err) {
        setError("Erreur lors de la connexion au serveur.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [token, router]);

  const renderTab = () => {
    switch (activeTab) {
      case "marked":
        return <Marked />;
      case "create":
        return <Send />;
      case "posts":
        return <MyPosts onPostClick={(postId: string) => router.push(`/posts/${postId}`)} />;
      default:
        return <Marked />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-[#FC4308] font-bold text-lg">Chargement du profil...</span>
      </div>
    );
  }

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
        <span className="text-gray-600 font-bold text-lg">Aucun utilisateur trouvé.</span>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <Breadcrumbs />
      <div>
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
            {/* User infos */}
            <div className="flex gap-3 items-center">
              <Image
                className="rounded-xl"
                src={user.imageUrl || "/avatar.svg"}
                alt="profile"
                width={75}
                height={75}
              />
              <p className="text-[#3E3232] font-semibold">{user.name}</p>
            </div>
            {/* User Menus */}
            <div>
              <div className="flex space-x-4">
                {["marked", "create", "posts"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-4 py-2 transition text-[#3E3232] font-semibold duration-300 ${
                      activeTab === tab ? "font-bold border-b-2 border-[#F81539]" : "text-gray-600"
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
            </div>
            {/* Edit Profil */}
            <div className="flex items-center gap-2 border-2 border-[#E6E6E6] py-3 px-4 rounded-xl cursor-pointer hover:bg-[#F81539] hover:bg-opacity-10 transition duration-300 ease-in-out">
              <Image src="/edit.svg" alt="edit" width={20} height={20} />
              <p className="text-[#F81539] font-semibold text-opacity-75">
                Edit Profile
              </p>
            </div>
          </div>
        </div>
        <div className="mt-11">{renderTab()}</div>
      </div>
    </div>
  );
}
export default function Profile() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("marked");




  const router = useRouter();

  const renderTab = () => {
    switch (activeTab) {
      case "marked":
        return <Marked />;
      case "create":
        return <Send />;
      case "posts":

        // return <MyPosts />;

        return <MyPosts onPostClick={(postId) => router.push(`/posts/${postId}`)} />;

      default:
        return <Marked />;
    }
  };

  const token = Cookies.get("token");
  useEffect(() => {
    if (!token) {
      router.push("/");
    } else {
      const fetchUserProfile = async () => {

        // if (!token) {
        //   router.push("/login"); // Redirige si l'utilisateur n'est pas authentifié
        // }


        const res = await fetch("http://localhost:3001/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      };

      fetchUserProfile();
    }

  }, []);

  }, [token]);


  return (
    <>
      {token && user ? (
        <div>
          <NavBar />
          <Breadcrumbs />
          <div>
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

                {/* User infos */}


                <div className="flex gap-3 items-center">
                  <Image
                    className="rounded-xl"
                    src={user.imageUrl || "/avatar.svg"}
                    alt="profile"
                    width={75}
                    height={75}
                  />
                  <p className="text-[#3E3232] font-semibold">{user.name}</p>
                </div>


                {/* User Menus */}


                <div>
                  <div className="flex space-x-4">
                    {["marked", "create", "posts"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative px-4 py-2 transition text-[#3E3232] font-semibold duration-300 ${
                          activeTab === tab ? "font-bold" : "text-gray-600"
                        }`}
                      >
                        {tab === "marked"
                          ? "Marked"
                          : tab === "create"
                          ? "Send Post"
                          : "Posts"}
                        <span
                          className={`absolute bottom-0 h-1 w-[1rem] rounded-full left-6 top-8 bg-[#F81539] transition-all duration-300 ${
                            activeTab === tab
                              ? "-translate-x-1/2 scale-100"
                              : "scale-0"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>


                {/* Edit Profil */}



                <div className="flex items-center gap-2 border-2 border-[#E6E6E6] py-3 px-4 rounded-xl cursor-pointer hover:bg-[#F81539] hover:bg-opacity-10 transition duration-300 ease-in-out">
                  <Image src="/edit.svg" alt="edit" width={20} height={20} />
                  <p className="text-[#F81539] font-semibold text-opacity-75">
                    Edit Profile
                  </p>
                </div>
              </div>
            </div>

            <div>

              <div className="mt-11">
                {renderTab()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

              <div className="mt-11">{renderTab()}</div>
            </div>
          </div>
        </div>
      ) : null}

    </>
  );
}
