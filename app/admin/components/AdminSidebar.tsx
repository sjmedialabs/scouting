"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import { adminMenu } from "../sidebar-config";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Settings, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}


export function AdminSidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const current = pathname.split("/")[2];
  const [open, setOpen] = useState<string[]>(["dashboard"]);

  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    // router.replace("/login");
  };

  const toggleSection = (label: string) => {
    setOpen(prev =>
      prev.includes(label)
        ? prev.filter(v => v !== label)
        : [...prev, label]
    );
  };

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full z-20
        transition-all duration-300
        ${collapsed ? "w-20 items-center" : "w-64"}
        bg-sidebarMain text-white border-r
        flex flex-col justify-between overflow-hidden
      `}
    >
      {/* HEADER (CLICK TO TOGGLE) */}
      <div className="w-full flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <button
          onClick={onToggle}
          className="w-full p-5 border-b flex items-center justify-between hover:bg-white/10"
        >
          {!collapsed && (
            <div>
              <h2 className="text-lg font-extrabold">Super Admin Dashboard</h2>
              <p className="text-sm text-white/70">Welcome back</p>
            </div>
          )}
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>

        {/* MENU */}
        <div className="p-3 space-y-4 overflow-y-auto">
          {adminMenu.map(section => (
            <div key={section.label}>
              <button
                onClick={() => toggleSection(section.label)}
                className="w-full flex items-center gap-3 hover:text-orangeButton"
              >
                <section.icon className="w-5 h-5" />
                {!collapsed && (
                  <span className="text-sm font-medium">
                    {section.label}
                  </span>
                )}
              </button>

              {open.includes(section.label) && (
                <div className={` mt-2 space-y-1 ${collapsed ? "ml-0" : "ml-8"}`}>
                  {section.children?.map(item => {
                    const active = current === item.id;
                    return (
                      <Link
                        key={item.id}
                        href={`/admin/${item.id}`}
                        className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm
                          ${active
                            ? "text-orangeButton"
                            : "hover:text-orangeButton"
                          }`}
                      >
                        <item.icon className="w-4 h-4" />
                        
                      {!collapsed && <span>{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="w-10 pl-1 flex gap-1 mb-3">
        {/* System Settings */}
        <Button className="bg-blueButton text-white flex-1 flex gap-0 rounded-2xl justify-start">
          <Settings className="w-4 h-4" />
          {!collapsed && "System Settings"}
        </Button>

        {/* Logout */}
        <Button
          variant="outline"
          className="flex-1 flex gap-2 justify-start
           text-white bg-orange-600
            hover:bg-orange-600 hover:text-white 
            rounded-2xl border-none active:bg-orange-500
            active:text-white
          "
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && "Logout"}
        </Button>
      </div>
    </aside>
  );
}
