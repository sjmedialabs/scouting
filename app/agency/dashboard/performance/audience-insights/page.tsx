"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Building2,
  FileText,
  Star,
  TrendingUp,
  DollarSign,
  Calendar,
  MessageSquare,
  Award,
  Edit,
  Settings,
  BarChart3,
  Users,
  Megaphone,
  CreditCard,
  Bell,
  UserPlus,
  ChevronDown,
  ChevronRight,
  Home,
  User,
  Briefcase,
  MessageCircle,
  FileSearch,
  Eye,
  GitCompare,
  Download,
  Phone,
  Video,
  Paperclip,
  Send,
  Mail,
  Clock,
  CheckCircle,
  X,
  Target,
  Handshake,
} from "lucide-react"
import { mockNotifications, mockProviderProjects, mockProviderReviews, mockRequirements } from "@/lib/mock-data"
import type { Provider, Requirement, Notification, Project, Review } from "@/lib/types"
import { useState } from "react"

const AudienceInsightsPage=()=>{
    const marketInsights = {
    topIndustries: [
      { name: "E-commerce", percentage: 35, projects: 12 },
      { name: "SaaS", percentage: 28, projects: 9 },
      { name: "Healthcare", percentage: 18, projects: 6 },
      { name: "Finance", percentage: 12, projects: 4 },
      { name: "Education", percentage: 7, projects: 3 },
    ],
    topGeographies: [
      { location: "United States", percentage: 45, projects: 15 },
      { location: "United Kingdom", percentage: 22, projects: 7 },
      { location: "Canada", percentage: 15, projects: 5 },
      { location: "Australia", percentage: 10, projects: 3 },
      { location: "Germany", percentage: 8, projects: 4 },
    ],
  }
    return(
      <div className="space-y-6">
        <div>
        <h1 className="text-3xl font-bold mb-2">Market Insights</h1>
        <p className="text-muted-foreground">Industries and geographies where you're most competitive</p>
        </div>

        {/* Top Industries */}
        <Card>
        <CardHeader>
            <CardTitle>Top Industries</CardTitle>
            <CardDescription>Industries where you're winning the most projects</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            {marketInsights.topIndustries.map((industry, index) => (
                <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="font-medium">{industry.name}</span>
                    <span className="text-sm text-muted-foreground">
                    {industry.projects} projects • {industry.percentage}%
                    </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${industry.percentage}%` }} />
                </div>
                </div>
            ))}
            </div>
        </CardContent>
        </Card>

        {/* Top Geographies */}
        <Card>
        <CardHeader>
            <CardTitle>Top Geographies</CardTitle>
            <CardDescription>Locations where your services are in highest demand</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            {marketInsights.topGeographies.map((geo, index) => (
                <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                    <span className="font-medium">{geo.location}</span>
                    <span className="text-sm text-muted-foreground">
                    {geo.projects} projects • {geo.percentage}%
                    </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-teal-500 h-2 rounded-full" style={{ width: `${geo.percentage}%` }} />
                </div>
                </div>
            ))}
            </div>
        </CardContent>
        </Card>

        {/* Competitive Positioning */}
        <Card>
        <CardHeader>
            <CardTitle>Competitive Positioning</CardTitle>
            <CardDescription>Your strengths in different market segments</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Strongest Segments</h4>
                <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    E-commerce Development
                </li>
                <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    SaaS Solutions
                </li>
                <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Mobile App Design
                </li>
                </ul>
            </div>
            <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Growth Opportunities</h4>
                <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Healthcare Tech
                </li>
                <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Financial Services
                </li>
                <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Education Platforms
                </li>
                </ul>
            </div>
            </div>
        </CardContent>
        </Card>
    </div>
    )
}
export default AudienceInsightsPage;