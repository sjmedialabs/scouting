"use client";

import { useState } from "react";
import { AdminSidebar } from "./components/AdminSidebar";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex">
        <AdminSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />

        <main
          className={`
            transition-all duration-300
            ${collapsed ? "ml-20" : "ml-64"}
            w-full p-8 min-h-screen
          `}
        >
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
