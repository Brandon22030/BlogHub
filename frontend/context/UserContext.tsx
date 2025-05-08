"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
// JWT is now managed by httpOnly cookie, no js-cookie or jwtDecode needed.

export interface User {
  userId: string;
  userName: string;
  userEmail: string;
  role: "USER" | "ADMIN";
  imageUrl?: string; // Standardized for profile image
}

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  refreshUser: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // No token expiry check needed with httpOnly cookie.

  // Fetch user profile from backend using httpOnly cookie
  const fetchUserProfile = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://bloghub-8ljb.onrender.com"}/user/profile`,
        {
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Failed to fetch user profile");
      const data = await res.json();
      setUser({
        userId: data.id || data.userId,
        userName: data.name || data.userName,
        userEmail: data.email || data.userEmail,
        role: data.role,
        imageUrl: data.imageUrl,
      });
    } catch (e) {
      setUser(null);
    }
  };

  // Refresh user: just fetch profile with cookie
  const refreshUser = async () => {
    await fetchUserProfile();
  };

  // On mount, refresh user
  useEffect(() => {
    refreshUser();
    // No more token in storage, skip multi-tab sync for token.
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
