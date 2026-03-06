import {
  Home, Users, Shield, BarChart3, FileText, Database,
  MessageSquare, Building2, Activity, UserCheck, AlertTriangle,
  CreditCard, DollarSign, TrendingUp, Eye, Bell, Settings,
  Globe
} from "lucide-react";

export const adminMenu = [
  {
    id: "overview",
    label: "OVERVIEW",
    icon: Home,
    children: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "analytics", label: "Analytics", icon: BarChart3 },
      { id: "reports", label: "Reports", icon: FileText },
    ],
  },
  {
    id: "user-management",
    label: "USER MANAGEMENT",
    icon: Users,
    children: [
      { id: "users", label: "All Users", icon: Users },
      // { id: "role-management", label: "Role Management", icon: Shield },
       { id: "user-verification", label: "User Verification", icon: UserCheck },
      // { id: "user-activity", label: "User Activity", icon: Activity },
    ],
  },
  {
    id: "subscription-management",
    label: "SUBSCRIPTIONS",
    icon: CreditCard,
    children: [
      { id: "subscribers", label: "Subscribers Management", icon: Users },
      { id: "subscription-plans", label: "Subscription Plans", icon: CreditCard },
      // { id: "billing", label: "Billing & Invoices", icon: FileText },
      // { id: "payment-methods", label: "Payment Methods", icon: DollarSign },
    ],
  },
  {
    id: "revenue-tracking",
    label: "REVENUE & ANALYTICS",
    icon: DollarSign,
    children: [
      { id: "revenue-dashboard", label: "Revenue Dashboard", icon: DollarSign },
      { id: "financial-reports", label: "Financial Reports", icon: BarChart3 },
      // { id: "growth-metrics", label: "Growth Metrics", icon: TrendingUp },
      // { id: "performance-insights", label: "Performance Insights", icon: Eye },
    ],
  },
  {
    id: "content-moderation",
    label: "CONTENT & MODERATION",
    icon: Shield,
    children: [
      { id: "moderation", label: "Content Moderation", icon: AlertTriangle },
      { id: "reported-content", label: "Reported Content", icon: FileText },
      { id: "content-policies", label: "Content Policies", icon: Shield },
      // { id: "automated-filters", label: "Automated Filters", icon: Database },
      { id: "contentMang", label: "Web Content Management", icon: Database },
    ],
  },
  {
    id: "platform-management",
    label: "PLATFORM",
    icon: Globe,
    children: [
      // { id: "settings", label: "Platform Settings", icon: Settings },
      { id: "categories", label: "Category Management", icon: Building2 },
      // { id: "notifications", label: "System Notifications", icon: Bell },
       { id: "careers", label: "Careers", icon: Shield },
    ],
  },
  // {
  //   id: "communication",
  //   label: "COMMUNICATION",
  //   icon: MessageSquare,
  //   children: [
  //     { id: "announcements", label: "Announcements", icon: Bell },
  //     { id: "support-tickets", label: "Support Tickets", icon: MessageSquare },
  //     { id: "email-campaigns", label: "Email Campaigns", icon: FileText },],
  // },
];
