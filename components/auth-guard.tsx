"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import type { UserRole } from "@/contexts/auth-context"

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
  redirectTo?: string
}

export function AuthGuard({
  children,
  allowedRoles,
  redirectTo = "/login",
}: AuthGuardProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname() ?? ""

  // ✅ PUBLIC ROUTES (VERY IMPORTANT)
  const isPublicPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password"

  useEffect(() => {
    if (loading || isPublicPage) return

    if (!isAuthenticated) {
      router.replace(redirectTo)
      return
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      switch (user.role) {
        case "client":
          router.replace("/client/dashboard")
          break
        case "agency":
          router.replace("/agency/dashboard")
          break
        case "admin":
          router.replace("/admin/dashboard")
          break
        default:
          router.replace("/")
      }
    }
  }, [
    loading,
    isAuthenticated,
    user,
    allowedRoles,
    router,
    redirectTo,
    isPublicPage,
  ])

  // ✅ PUBLIC PAGES SHOULD ALWAYS RENDER
  if (isPublicPage) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  if (allowedRoles && user && !allowedRoles.includes(user.role)) return null

  return <>{children}</>
}
