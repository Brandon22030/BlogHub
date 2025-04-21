"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

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

  // Helper to check token expiry
  const isTokenExpired = (token: string) => {
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return true;
      }
      return false;
    } catch {
      return true;
    }
  };

  // Fetch user profile from backend
  const fetchUserProfile = async (token: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  // Refresh user: decode token, check expiry, fetch profile
  const refreshUser = async () => {
    const token = Cookies.get("token");
    if (!token || isTokenExpired(token)) {
      setUser(null);
      Cookies.remove("token");
      return;
    }
    await fetchUserProfile(token);
  };

  // On mount, refresh user
  useEffect(() => {
    refreshUser();
    // Listen for storage events (for multi-tab logout/login)
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "token") {
        refreshUser();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
