"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/footer";

/**
 * ClientLayoutWrapper component for BlogHub.
 * Wraps page content and conditionally displays the Footer based on route.
 * @param children - React children nodes to render inside the layout
 * @returns JSX.Element - The wrapped layout with optional Footer
 */
export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideFooterRoutes = ["/login", "/register", "/admin"];

  const shouldShowFooter = !hideFooterRoutes.includes(pathname);

  return (
    <>
      {children}
      {shouldShowFooter && <Footer />}
    </>
  );
}

