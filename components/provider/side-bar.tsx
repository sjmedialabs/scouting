"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  ChevronDown,
  ChevronRight,
  Settings,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  children?: MenuItem[];
}

interface SidebarProps {
  user: any;
  menuItems: MenuItem[];
  isCollapsed: boolean;
  isMobileOpen: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
  user,
  menuItems,
  isCollapsed,
  isMobileOpen,
  setIsCollapsed,
  setIsMobileOpen,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  const toggleSection = (id: string) => {
    if (isCollapsed && !isMobileOpen) {
      setIsCollapsed(false);
      return;
    }

    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleMenuClick = (item: MenuItem) => {
    if (isCollapsed || isMobileOpen) {
      setIsCollapsed(false);
    }

    if (item.path) {
      router.push(item.path);
      setIsMobileOpen(false);
    }
  };

  /* ✅ Auto expand correct section based on pathname */
  useEffect(() => {
    if (!pathname) return;

    menuItems.forEach((section) => {
      if (section.children) {
        const isActiveChild = section.children.some(
          (child) =>
            child.path &&
            (pathname === child.path ||
              pathname.startsWith(child.path))
        );

        if (isActiveChild) {
          setExpandedSections((prev) =>
            prev.includes(section.id) ? prev : [...prev, section.id]
          );
        }
      }
    });
  }, [pathname, menuItems]);

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 bg-[#3C3A3E] text-[#FFFFFF] border-r border-border 
          flex flex-col transition-transform duration-300 ease-in-out
          lg:transition-all lg:duration-300
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${isCollapsed ? "lg:w-20" : "lg:w-80"}
          w-80
        `}
      >
        {/* HEADER */}
        <div
          className={`p-5 border-b border-border flex items-center justify-between ${
            isCollapsed ? "hidden" : "block"
          }`}
        >
          <div className={isCollapsed ? "hidden lg:block" : ""}>
            <h2 className="text-xl font-bold tracking-tight">
              Agency Dashboard
            </h2>
            <p className="text-sm text-[#8B8585] mt-0.5">
              Welcome back, {user?.name || "User"}
            </p>

            <div className="flex gap-2 mt-3">
              {user?.isVerified && (
                <Badge variant="default">Verified</Badge>
              )}
              {user?.isActive && (
                <Badge className="bg-[#39A935] rounded-full w-[60px] h-[30px]">
                  Active
                </Badge>
              )}
            </div>
          </div>

          {/* Desktop Collapse */}
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="p-2 rounded-lg hover:bg-accent lg:flex hidden"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronRight
              className={`h-5 w-5 transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Mobile Close */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-accent lg:hidden"
            aria-label="Close menu"
          >
            <ChevronRight className="h-6 w-6 rotate-180" />
          </button>
        </div>

        {/* NAVIGATION */}
        <div
          className="flex-1 overflow-y-auto px-3 py-4  
          [scrollbar-width:none]          
          [-ms-overflow-style:none]       
          [&::-webkit-scrollbar]:hidden"
        >
          <nav className="space-y-1.5">
            {menuItems.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="text-[#fff] w-full flex items-center justify-between 
                  px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <section.icon className="h-4 w-4 shrink-0" />
                    {!(isCollapsed && !isMobileOpen) && section.label}
                  </div>

                  {section.children &&
                    !(isCollapsed && !isMobileOpen) &&
                    (expandedSections.includes(section.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    ))}
                </button>

                {section.children &&
                  expandedSections.includes(section.id) &&
                  !(isCollapsed && !isMobileOpen) && (
                    <div className="ml-7 mt-1 space-y-1">
                      {section.children.map((item) => {
                        const isActive =
  item.path &&
  (
    pathname === item.path 
  );


                        return (
                          <button
                            key={item.id}
                            onClick={() => handleMenuClick(item)}
                            className={`
                              w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg
                              transition-colors cursor-pointer
                              ${
                                isActive
                                  ? "text-[#F54A0C] font-medium"
                                  : "text-[#fff]"
                              }
                            `}
                          >
                            <item.icon className="h-4 w-4 shrink-0" />
                            {!(isCollapsed && !isMobileOpen) &&
                              item.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
              </div>
            ))}
          </nav>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-border">
          <div
            className={`grid gap-2 ${
              isCollapsed && !isMobileOpen
                ? "grid-cols-1 place-items-center"
                : "grid-cols-2"
            }`}
          >
            <Button
              size="sm"
              onClick={() =>
                router.push(
                  "/agency/dashboard/account/subscriptions"
                )
              }
              className="justify-start bg-[#2C34A1] text-[#fff] hover:bg-[#2C34A1] rounded-full"
            >
              <Settings className="h-4 w-4 mr-2" />
              {!(isCollapsed && !isMobileOpen) && "Upgrade Plan"}
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={handleLogout}
              className="justify-start rounded-full bg-[#F54A0C]"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {!(isCollapsed && !isMobileOpen) && "Logout"}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
