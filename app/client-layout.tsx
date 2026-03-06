"use client";

import { usePathname } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { AuthProvider } from "@/contexts/auth-context";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // pages where Header + Footer should be hidden
  const hideUI =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/agency") ||
    pathname.startsWith("/client");

 return (
    <AuthProvider>
      {/* HEADER */}
      {!hideUI && <Navigation />}

      {/* PAGE CONTENT */}
      <main className="min-h-screen flex flex-col">
        <Suspense fallback={null}>{children}</Suspense>
      </main>

      {/* FOOTER */}
      {!hideUI && <Footer />}
    </AuthProvider>
  );
}
