import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono,Plus_Jakarta_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Suspense } from "react"
import "./globals.css"
import ClientLayout from "./client-layout"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'], // Add 'latin-ext', 'vietnamese', etc. if needed
  variable: '--font-plus-jakarta', // CSS variable for easy use
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Spark - B2B Service Platform",
  description: "Connect service seekers with verified providers",
  generator: "Sj Media Labs",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${plusJakarta.variable}`}>
      <body className="font-sans antialiased">
<ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}