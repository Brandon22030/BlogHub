import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// import { usePathname } from "next/navigation";
import ClientLayoutWrapper from "./ClientLayoutWrapper";
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
      <head>
        {/* Include Material Icons Outlined */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Icons+Outlined&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <UserProvider>
          {/* Si tu veux ajouter des éléments globaux comme des breadcrumbs, tu peux les inclure ici */}
          {/* <Breadcrumbs /> */}
          <main className="flex-1">
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          </main>
        </UserProvider>
      </body>
    </html>
  );
}
