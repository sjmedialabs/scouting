"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { PiUsersThreeLight } from "react-icons/pi";
import { RiMessage2Line } from "react-icons/ri";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CompanyProfileEditor } from "@/components/provider/company-profile-editor";
import { BrowseRequirements } from "@/components/provider/browse-requirements";
import { SubmitProposalForm } from "@/components/provider/submit-proposal-form";
import { NotificationsWidget } from "@/components/provider/notifications-widget";
import { Input } from "@/components/ui/input";
import { authFetch } from "@/lib/auth-fetch";
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
} from "lucide-react";
import {
  mockNotifications,
  mockProviderProjects,
  mockProviderReviews,
  mockRequirements,
} from "@/lib/mock-data";
import {
  type Provider,
  type Requirement,
  type Notification,
  type Project,
  type Review,
  Proposal,
} from "@/lib/types";

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: "overview",
    label: "OVERVIEW",
    icon: Home,
    children: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      {
        id: "edit-profile",
        label: "Edit Profile",
        icon: User,
        children: [
          { id: "company-details", label: "Company Details", icon: Building2 },
          { id: "services", label: "Services", icon: Briefcase },
          { id: "team", label: "Team", icon: Users },
          { id: "contact-info", label: "Contact Info", icon: MessageCircle },
          { id: "certifications", label: "Certifications", icon: Award },
        ],
      },
      { id: "portfolio", label: "Portfolio", icon: Briefcase },
      { id: "reviews", label: "Reviews", icon: Star },
      { id: "messages", label: "Messages", icon: MessageSquare },
      { id: "project-inquiries", label: "Project Inquiries", icon: FileSearch },
      { id: "proposals", label: "Proposals", icon: FileText },
      { id: "projects", label: "Projects", icon: Briefcase },
    ],
  },
  {
    id: "performance",
    label: "PERFORMANCE",
    icon: BarChart3,
    children: [
      {
        id: "performance-analytics",
        label: "Performance Analytics",
        icon: TrendingUp,
      },
      { id: "audience-insights", label: "Audience Insights", icon: Eye },
      {
        id: "competitor-comparison",
        label: "Competitor Comparison",
        icon: GitCompare,
      },
    ],
  },
  {
    id: "marketing",
    label: "MARKETING",
    icon: Megaphone,
    children: [
      { id: "lead-generation", label: "Lead Management", icon: Download },
    ],
  },
  {
    id: "account-settings",
    label: "ACCOUNT & SETTINGS",
    icon: Settings,
    children: [
      {
        id: "billing-subscription",
        label: "Billing & Subscription",
        icon: CreditCard,
      },
      { id: "notifications", label: "Notifications", icon: Bell },
    ],
  },
];

// REMOVED LOCAL REQUIREMENTS ARRAY

export default function AgencyDashboard() {
  console.log("[v0] Agency dashboard rendering");
  const { user, loading } = useAuth();
  const router = useRouter();
  // Changed initial activeSection state to "overview"
  const [activeSection, setActiveSection] = useState("overview");

  const [projectTab, setProjectTab] = useState<
    "active" | "completed" | "invitations"
  >("active");
  const [provider, setProvider] = useState<Provider>({
    id: "1",
    name: "Jane Smith",
    email: "jane@sparkdev.com",
    subscriptionTier: "standard", // Changed from "basic" to "standard"
    isVerified: true,
    isFeatured: true,
    profileCompletion: 85,
    totalProjects: 47,
    activeProjects: 8,
    completedProjects: 39,
    totalEarnings: 125000,
    monthlyEarnings: 12500,
    rating: 4.9,
    responseTime: "2 hours",
    successRate: 98,
    minimumBudget: 500,
    hourlyRate: { min: 25, max: 150 },
  });

  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [projects] = useState<Project[]>(mockProviderProjects);
  const [reviews, setReviews] = useState<Review[]>(mockProviderReviews);
  const [selectedRequirement, setSelectedRequirement] =
    useState<Requirement | null>(null);
  const [showProposalForm, setShowProposalForm] = useState(false);

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const [selectedConversation, setSelectedConversation] =
    useState<string>("john-doe");
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState([
    {
      id: "john-doe",
      name: "John Doe",
      initials: "JD",
      message: "Thanks for the proposal. When can we start?",
      time: "2m ago",
      project: "E-commerce",
      unread: true,
      color: "bg-blue-500",
      messages: [
        {
          id: "1",
          sender: "client",
          content:
            "Hi! I'm interested in your e-commerce development services. Could you provide a quote for a full online store?",
          timestamp: "Yesterday, 2:30 PM",
          avatar: "JD",
        },
        {
          id: "2",
          sender: "agency",
          content:
            "Hello John! Thanks for reaching out. I'd be happy to help with your e-commerce project. Could you share more details about your requirements?",
          timestamp: "Yesterday, 3:00 PM",
          avatar: "S",
        },
        {
          id: "3",
          sender: "client",
          content:
            "I need a store with about 200 products, payment integration, inventory management, and mobile-responsive design. What would be your timeline and pricing?",
          timestamp: "Yesterday, 4:15 PM",
          avatar: "JD",
        },
        {
          id: "4",
          sender: "agency",
          content:
            "Perfect! Based on your requirements, I can provide a comprehensive solution. I'll send you a detailed proposal with timeline and pricing within 24 hours.",
          timestamp: "Yesterday, 5:30 PM",
          avatar: "S",
        },
        {
          id: "5",
          sender: "client",
          content: "Thanks for the proposal. When can we start?",
          timestamp: "2 minutes ago",
          avatar: "JD",
        },
      ],
    },
    {
      id: "sarah-wilson",
      name: "Sarah Wilson",
      initials: "SW",
      message: "Could you provide more details about the timeline?",
      time: "1h ago",
      project: "Mobile App",
      unread: true,
      color: "bg-purple-500",
      messages: [
        {
          id: "1",
          sender: "client",
          content: "Could you provide more details about the timeline?",
          timestamp: "1 hour ago",
          avatar: "SW",
        },
      ],
    },
    {
      id: "tech-startup",
      name: "Tech Startup Inc",
      initials: "TS",
      message: "We're interested in your web development services",
      time: "3h ago",
      project: "Web Development",
      unread: false,
      color: "bg-orange-500",
      messages: [
        {
          id: "1",
          sender: "client",
          content: "We're interested in your web development services",
          timestamp: "3 hours ago",
          avatar: "TS",
        },
      ],
    },
    {
      id: "marketing-pro",
      name: "Marketing Pro",
      initials: "MP",
      message: "The design looks great! Let's proceed.",
      time: "1d ago",
      project: "Branding",
      unread: false,
      color: "bg-green-500",
      messages: [
        {
          id: "1",
          sender: "client",
          content: "The design looks great! Let's proceed.",
          timestamp: "1 day ago",
          avatar: "MP",
        },
      ],
    },
    {
      id: "david-chen",
      name: "David Chen",
      initials: "DC",
      message: "Can we schedule a call to discuss the project?",
      time: "2d ago",
      project: "Consulting",
      unread: true,
      color: "bg-red-500",
      messages: [
        {
          id: "1",
          sender: "client",
          content: "Can we schedule a call to discuss the project?",
          timestamp: "2 days ago",
          avatar: "DC",
        },
      ],
    },
  ]);

  const [providerDetails, setProviderDetails] = useState<Provider[]>();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [dynamicStats, setDynamicStats] = useState({
    profileViews: 0,
    profileViewsPercentage: 0,
    websiteClicks: 0,
    websiteClicksPercentage: 0,
    proposals: 0,
    proposalResponses: 0,
    conversionPercentage: 0,
    leadsPercentage: 0,
    leads: 0,
  });
  const [activeProjects, setActiveProjects] = useState<Requirement[]>([]);
  const [dynamicNotifications, setDynamicNotifications] = useState<
    Notification[]
  >([]);
  const [resLoading, setResLoading] = useState(false);
  const loadData = async () => {
    setResLoading(true);
    try {
      const [providerDetailRes, proposalRes, requirementRes, notificationRes] =
        await Promise.all([
          authFetch(`/api/providers/${user?.id}`, {}),
          authFetch("/api/proposals", {}),
          authFetch("/api/requirements", {}),
          authFetch("/api/notifications", {}),
        ]);
      if (
        providerDetailRes.ok &&
        proposalRes.ok &&
        requirementRes.ok &&
        notificationRes.ok
      ) {
        const [
          providerDetailsData,
          proposalData,
          requirementData,
          notificationsData,
        ] = await Promise.all([
          providerDetailRes.json(),
          proposalRes.json(),
          requirementRes.json(),
          notificationRes.json(),
        ]);
        console.log("Provider Details Data::::", providerDetailsData);
        console.log("Proposals Data:::", proposalData);
        console.log("Requirements Data::::", requirementData);
        console.log("fetched Notifications:::::", notificationsData);
        let profileViewPercentage =
          providerDetailsData.provider.currentMonthProfileViews > 0
            ? Math.round(
                (providerDetailsData.provider.currentMonthProfileViews /
                  providerDetailsData.provider.profileViews) *
                  100,
              )
            : 0;
        let websiteClicksPercentage =
          providerDetailsData.provider.currentMonthWebsiteClicks > 0
            ? Math.round(
                (providerDetailsData.provider.currentMonthWebsiteClicks /
                  providerDetailsData.provider.websiteClicks) *
                  100,
              )
            : 0;
        let responsesCount = proposalData.proposals.filter(
          (eachItem) => eachItem.status != "pending",
        ).length;
        let totalProjectsDone = requirementData.requirements.filter(
          (eachItem) => eachItem?.allocatedToId === user?.id,
        );
        let conversionPercentage =
          proposalData.proposals.length > 0
            ? Math.round(
                (totalProjectsDone.length / proposalData.proposals.length) *
                  100,
              )
            : 0;

        console.log("percntage of profile views", profileViewPercentage);
        console.log("percntage of website clicks", websiteClicksPercentage);
        console.log("response Count is::::", responsesCount);
        console.log("total Project allocated::::", totalProjectsDone);
        console.log("conversion percentage is:::", conversionPercentage);

        setDynamicStats({
          profileViews: providerDetailsData.provider.profileViews,
          profileViewsPercentage: profileViewPercentage,
          websiteClicks: providerDetailsData.provider.websiteClicks,
          websiteClicksPercentage: websiteClicksPercentage,
          proposals: proposalData.proposals.length,
          proposalResponses: responsesCount,
          conversionPercentage: conversionPercentage,
          leadsPercentage: 0,
          leads: totalProjectsDone.length,
        });

        let currentActiveProjects = proposalData.proposals.filter(
          (eachItem: any) => eachItem.status === "accepted",
        );
        console.log("current active projects::::", currentActiveProjects);

        setActiveProjects(currentActiveProjects);
        //unread notifications
        setDynamicNotifications(
          notificationsData.data.filter((eachitem) => !eachitem.isRead),
        );
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log("Failed to fetch the data:::");
    } finally {
      setResLoading(false);
    }
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
    // Mark conversation as read
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, unread: false } : conv,
      ),
    );
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const selectedConv = conversations.find(
      (c) => c.id === selectedConversation,
    );
    if (!selectedConv) return;

    const newMsg = {
      id: Date.now().toString(),
      sender: "agency" as const,
      content: newMessage,
      timestamp: "Just now",
      avatar: "S",
    };

    // Update conversations with new message
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation
          ? {
              ...conv,
              messages: [...conv.messages, newMsg],
              message: newMessage,
              time: "Just now",
            }
          : conv,
      ),
    );

    setNewMessage("");

    // TODO: Send to backend API
    try {
      const response = await authFetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedConversation,
          message: newMessage,
          sender: "agency",
        }),
      });

      if (!response.ok) {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedConv = conversations.find((c) => c.id === selectedConversation);
  const unreadCount = conversations.filter((c) => c.unread).length;

  const handleProposalSubmit = (requirement: Requirement) => {
    // Placeholder for handleProposalSubmit logic
    console.log("Proposal submitted for requirement:", requirement.id);
    setShowProposalForm(false);
    setSelectedRequirement(null);
  };

  const handleMarkNotificationAsRead = async (
    notificationId: string,
    redirectionUrl: string,
  ) => {
    try {
      const res = await authFetch(
        `/api/notifications/${notificationId}`,
        { method: "PUT" },
        user?.token,
      );
      console.log("response of the mark as read::", res);
      if (res.ok) {
        setDynamicNotifications((prev) =>
          prev.filter((eachItem) => eachItem._id !== notificationId),
        );
      }
    } catch (error) {
      console.log("Failed to update the status of the notification::", error);
    }
    router.push(redirectionUrl);
  };

  const handleDismissNotification = (notificationId: string) => {
    // Placeholder for handleDismissNotification logic
  };

  const handleSaveProfile = (updatedProvider: Provider) => {
    setProvider(updatedProvider);
  };

  const handleRespondToReview = (review: Review) => {
    setSelectedReview(review);
    setShowRespondToReview(true);
  };

  // ADDED HANDLER FOR VIEWING REQUIREMENT DETAILS
  const handleViewRequirementDetails = (requirementId: string) => {
    const requirement = mockRequirements.find((r) => r.id === requirementId);
    if (requirement) {
      setSelectedRequirement(requirement);
      // For now, just show the proposal form - later we can add a details modal
      setShowProposalForm(true);
    }
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== "agency")) {
      router.push("/login");
    }
    if (user && user.role === "agency") {
      loadData();
    }
  }, [user, loading, router]);

  if (loading || resLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== "agency") {
    return null;
  }

  const stats = {
    totalProposals: 15,
    activeProjects: projects.filter((p) => p.status === "active").length,
    completedProjects: 12,
    averageRating:
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length || 0,
  };

  const analyticsData = {
    profileViews: 1247,
    profileViewsChange: 12,
    clicksToWebsite: 342,
    clicksChange: 8,
    impressions: 5680,
    impressionsChange: 15,
    projectInvitations: 23,
    invitationsChange: 5,
    proposalSubmissions: 15,
    proposalResponses: 8,
    conversionRate: 53,
    leadsGenerated: 34,
    leadsChange: 18,
    leadToClientRate: 23.5,
    premiumImpact: 45,
  };

  const searchQueries = [
    { keyword: "Web Development", count: 234, trend: "up" },
    { keyword: "E-commerce Solutions", count: 189, trend: "up" },
    { keyword: "Mobile App Development", count: 156, trend: "stable" },
    { keyword: "UI/UX Design", count: 142, trend: "up" },
    { keyword: "Digital Marketing", count: 98, trend: "down" },
  ];

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
  };

  const monthlyReport = {
    profileImpressions: 5680,
    profileViews: 1247,
    categoryRanking: {
      current: 12,
      previous: 18,
      category: "Web Development",
    },
    leadsGenerated: {
      inquiries: 34,
      proposals: 15,
      total: 49,
    },
    conversionFunnel: {
      views: 1247,
      contacts: 89,
      proposals: 15,
      won: 5,
    },
    reviewsAdded: 3,
    ratingsDistribution: {
      5: 12,
      4: 5,
      3: 2,
      2: 0,
      1: 0,
    },
  };

  // Added state for project tab navigation
  // const [projectTab, setProjectTab] = useState<"active" | "completed" | "invitations">("active")

  if (showProposalForm && selectedRequirement) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <SubmitProposalForm
          requirement={selectedRequirement}
          onSubmit={handleProposalSubmit}
          onCancel={() => {
            setShowProposalForm(false);
            setSelectedRequirement(null);
          }}
        />
      </div>
    );
  }
  const calculateProgress = (milestones = []) => {
    if (!milestones.length) return 0;

    const completedCount = milestones.filter(
      (milestone) => milestone.completed === true,
    ).length;

    return Math.round((completedCount / milestones.length) * 100);
  };

  return (
    <div>
      <div className="space-y-3">
        <div>
          <h1 className="text-2xl font-bold text-orangeButton my-custom-class">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-xl my-custom-class">
            Quick stats and recent activity
          </p>
          <div className="mt-4 h-px bg-border" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* LEFT */}
          <div className="space-y-3">
            {/* Visibility */}
            <div>
              <h3 className="text-lg font-semibold text-orangeButton my-custom-class mb-2">
                Visibility & Engagement
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
                {[
                  {
                    label: "Profile Views",
                    value: dynamicStats.profileViews,
                    footer: `+${dynamicStats.profileViewsPercentage}% this month`,
                    icon: PiUsersThreeLight,
                  },
                  // {
                  //   label: "Impressions",
                  //   value: analyticsData.impressions,
                  //   footer: `+${analyticsData.impressionsChange}% this month`,
                  //   icon: TrendingUp,
                  // },
                  {
                    label: "Website Clicks",
                    value: dynamicStats.websiteClicks,
                    footer: `+${dynamicStats.websiteClicksPercentage}% this month`,
                    icon: RiMessage2Line,
                  },
                  // {
                  //   label: "Invitations",
                  //   value: analyticsData.projectInvitations,
                  //   footer: `+${analyticsData.invitationsChange} this month`,
                  //   icon: UserPlus,
                  // },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="
                        rounded-xl bg-white relative
                        px-2 py-3
                        shadow-[0_6px_22px_rgba(0,0,0,0.08)]
                        flex flex-col gap-1.5
                        max-w-[190px]
                      "
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-medium my-custom-class leading-sung">
                          {item.label}
                        </span>
                        <div className=" absolute top-2 right-1 h-5 w-5 rounded-full bg-[#eef7fe] flex items-center justify-center">
                          <Icon className="h-3 w-3 text-orangeButton" />
                        </div>
                      </div>
                      <div className="text-[16px] font-semibold leading-tight">
                        {item.value}
                      </div>
                      <p className="text-[10px] text-green-500 mt-auto">
                        {item.footer}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Performance */}
            <div>
              <h3 className="text-lg font-semibold text-orangeButton my-custom-class mb-4">
                Performance Metrics
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
                {[
                  {
                    label: "Proposals",
                    value: dynamicStats.proposals,
                    footer: `${dynamicStats.proposalResponses} responses`,
                    icon: FileText,
                  },
                  {
                    label: "Conversion",
                    value: `${dynamicStats.conversionPercentage}%`,
                    footer: "Proposal to project",
                    icon: TrendingUp,
                  },
                  // {
                  //   label: "Leads",
                  //   value: dynamicStats.leads,
                  //   footer: `+${analyticsData.leadsChange}% this month`,
                  //   icon: PiUsersThreeLight,
                  // },
                  {
                    label: "Client Rate",
                    value: `${analyticsData.leadToClientRate}%`,
                    footer: "Lead to client",
                    icon: Award,
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="
                        rounded-xl bg-white relative
                        px-2 py-3
                        shadow-[0_6px_22px_rgba(0,0,0,0.08)]
                        flex flex-col gap-1.5
                        max-w-[190px]
                      
                      "
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-medium my-custom-class leading-sung">
                          {item.label}
                        </span>
                        <div className="absolute top-2 right-1 h-5 w-5 rounded-full bg-[#eef7fe] flex items-center justify-center">
                          <Icon className="h-3 w-3 text-orangeButton" />
                        </div>
                      </div>

                      <div className="text-[16px] font-semibold leading-tight">
                        {item.value}
                      </div>

                      <p className="text-[10px] text-green-500 whitespace-nowrap">
                        {item.footer}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Projects */}
            <Card className="rounded-2xl shadow-lg bg-white p-3 pl-0">
              <CardHeader className="h-8">
                <CardTitle className="text-lg h-5 text-orangeButton my-custom-class">
                  Active Projects
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Your current ongoing projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activeProjects.length !== 0 ? (
                    <div>
                      {activeProjects.map((project) => (
                        <div
                          key={project.id}
                          className="shadow-md rounded-2xl pt-1 mb-4 p-5"
                        >
                          <div className="flex justify-between mb-2">
                            <h4 className="font-bold my-custom-class">
                              {project.requirement.title}
                            </h4>
                            <Badge
                              className="bg-[#cae5c0] text-green-500"
                              variant="outline"
                            >
                              active
                            </Badge>
                          </div>
                          <div className="flex gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2 text-gray-500">
                              <DollarSign className="h-4 w-4 text-orangeButton" />
                              {project.proposedBudget.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2 text-gray-500">
                              <Calendar className="h-4 w-4 text-orangeButton" />
                              {project.proposedTimeline}
                            </div>
                          </div>
                          {/* PROGRESS */}
                          <div>
                            <div className="flex justify-between h-5 text-sm mb-1">
                              <span>
                                {`progress ${project.milestones.filter((eachItem) => eachItem.completed).length}/${project.milestones.length}`}{" "}
                              </span>
                              <span>
                                {calculateProgress(project.milestones) || 0}%
                                Complete
                              </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{
                                  width: `${calculateProgress(project.milestones) || 0}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-500 mt-4 text-xl">
                        {" "}
                        No active projects{" "}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT – Notifications */}
          <div className="lg:sticky lg:top-6 self-start">
            <NotificationsWidget
              notifications={dynamicNotifications}
              onMarkAsRead={handleMarkNotificationAsRead}
              onDismiss={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
