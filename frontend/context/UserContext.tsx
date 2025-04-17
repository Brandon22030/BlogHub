"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export interface User {
  userId: string;
  userName: string;
  userEmail: string;
  userImage?: string;
  imageUrl?: string; // Ajout compat Cloudinary
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

  // Décoder le token pour récupérer l'utilisateur
  const refreshUser = () => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({
          userId: decoded.userId,
          userName: decoded.userName,
          userEmail: decoded.userEmail,
          userImage: decoded.userImage,
          imageUrl: decoded.imageUrl, // Ajout compat Cloudinary
        });
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
