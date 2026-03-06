"use client"

import { useState } from "react"
import { LogOut, PanelLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import {
  ChevronDown,
  ChevronRight,
  Plus,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { RiVerifiedBadgeFill } from "react-icons/ri"

interface MenuItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path?: string
  children?: MenuItem[]
}

import {
  Home,
  User,
  FileText,
  MessageSquare,
  Briefcase,
  Users,
  TrendingUp,
  Eye,
  GitCompare,
  Bell,
  Settings,
  BarChart3,
} from "lucide-react"

const menuItems: MenuItem[] = [
  {
    id: "overview",
    label: "OVERVIEW",
    icon: Home,
    children: [
      { id: "dashboard", label: "Dashboard", icon: Home, path: "/client/dashboard" },
      { id: "profile", label: "Profile", icon: User, path: "/client/dashboard/profile" },
      { id: "requirements", label: "My Requirements", icon: FileText, path: "/client/dashboard/requirements" },
      { id: "proposals", label: "Proposals", icon: MessageSquare, path: "/client/dashboard/proposals" },
      { id: "projects", label: "Projects", icon: Briefcase, path: "/client/dashboard/projects" },
      { id: "providers", label: "Find Agencies", icon: Users, path: "/client/dashboard/providers" },
      { id: "messages", label: "Messages", icon: MessageSquare, path: "/client/dashboard/message" },
    ],
  },
  {
    id: "performance",
    label: "PERFORMANCE",
    icon: BarChart3,
    children: [
      { id: "analytics", label: "Project Analytics", icon: TrendingUp, path: "/client/dashboard/analytics" },
      { id: "provider-comparison", label: "Provider Comparison", icon: GitCompare, path: "/client/dashboard/provider-comparison" },
      { id: "wishlist", label: "Wish List", icon: Eye, path: "/client/dashboard/wishlist" },
    ],
  },
  {
    id: "account-settings",
    label: "ACCOUNT & SETTINGS",
    icon: Settings,
    children: [
      { id: "notifications", label: "Notifications", icon: Bell, path: "/client/dashboard/notifications" },
    ],
  },
]

export default function ClientSidebar({
  user,
  isOpen,
  onClose,
}: {
  user: any
  isOpen: boolean
  onClose: () => void
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { logout } = useAuth()

  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [collapsed, setCollapsed] = useState(false)

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleMenuClick = (item: MenuItem) => {
    router.push(item.path!)
    onClose()
  }

  const handleLogout = async () => {
    await logout()
    router.replace("/login")
  }

  return (
    <>
      {/* Overlay (mobile only) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed z-50 inset-y-0 left-0 bg-card border-r border-border flex flex-col transform transition-all duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:static lg:z-auto",
          collapsed ? "lg:w-20" : "lg:w-80",
          "w-80"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-border bg-[#3C3A3E] flex justify-between items-start">
          {!collapsed && (
            <div>
              <h2 className="text-xl font-bold text-white">
                Client Dashboard
              </h2>
              <p className="text-sm text-[#8B8585]">
                Welcome back, {user.name}
              </p>

              <div className="flex items-center gap-2 mt-3">
                <Badge
                  className={`${user.isActive ? "bg-[#39A935]" : "bg-red-500"} min-w-[80px] text-white rounded-full min-h-[30px]`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>

                {user.isVerified && (
                  <Badge
                    variant="secondary"
                    className="bg-white min-h-[30px] rounded-full text-[#2C34A1]"
                  >
                    <RiVerifiedBadgeFill
                      className="h-5 w-5"
                      color="#2C34A1"
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:block cursor-pointer"
            >
              <PanelLeft className="h-5 w-5 text-white" />
            </button>

            <button onClick={onClose} className="lg:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#3C3A3E] 
          [scrollbar-width:none] 
          [-ms-overflow-style:none]        
          [&::-webkit-scrollbar]:hidden"
        >
          <nav className="space-y-2">
            {menuItems.map((section) => (
              <div key={section.id}>
                {/* Parent */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full cursor-pointer flex items-center justify-between p-3 text-sm font-medium rounded-lg"
                >
                  <div className={cn(
                    "flex items-center gap-3 text-white",
                    collapsed && "justify-center w-full"
                  )}>
                    <section.icon className="h-4 w-4" />
                    {!collapsed && section.label}
                  </div>

                  {!collapsed &&
                    (expandedSections.includes(section.id) ? (
                      <ChevronDown className="h-4 w-4 text-white" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-white" />
                    ))}
                </button>

                {/* Children */}
                {section.children &&
                  expandedSections.includes(section.id) && (
                    <div
                      className={cn(
                        "mt-2 space-y-1",
                        collapsed ? "flex flex-col items-center ml-5" : "ml-4"
                      )}
                    >
                      {section.children.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleMenuClick(item)}
                          className={cn(
                            "cursor-pointer flex items-center gap-3 p-2 text-sm rounded-lg text-white",
                            pathname === item.path
                              ? "text-[#F54A0C]"
                              : "",
                            collapsed
                              ? "justify-center w-full"
                              : "w-full"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {!collapsed && item.label}
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#3C3A3E] flex flex-col gap-2">
          <Button
            size="sm"
            className={cn(
              "rounded-2xl bg-[#2C34A1] text-white border-none hover:bg-[#232a85] flex items-center justify-center",
              collapsed ? "w-12 h-12 p-0" : "w-full"
            )}
            onClick={() => {
              if (collapsed) setCollapsed(false)
              router.push("/client/dashboard/post-requirement")
              onClose()
            }}
          >
            <Plus className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Post Requirement</span>}
          </Button>

          <Button
            size="sm"
            onClick={handleLogout}
            className={cn(
              "rounded-2xl bg-orangeButton text-white border-none flex items-center justify-center",
              collapsed ? "w-12 h-12 p-0" : "w-full"
            )}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </aside>
    </>
  )
}
