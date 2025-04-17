import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Breadcrumbs from "@/components/breadcrumbs";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./globals.css";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlogHub",
  description: "Your Favorite Blog Website",
};

import { UserProvider } from "@/context/UserContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          {/* Si tu veux ajouter des éléments globaux comme des breadcrumbs, tu peux les inclure ici */}
          {/* <Breadcrumbs /> */}
          {children} {/* Affiche une seule fois les enfants */}
          <Footer /> {/* Le footer après les enfants */}
        </UserProvider>
      </body>
    </html>
  );
}
