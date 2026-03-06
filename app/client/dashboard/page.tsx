"use client";

import type React from "react";
import { authFetch } from "@/lib/auth-fetch";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PostRequirementForm } from "@/components/seeker/post-requirement-form";
import { RequirementList } from "@/components/seeker/requirement-list";
import { ProposalList } from "@/components/seeker/proposal-list";
import { RequirementDetailsModal } from "@/components/seeker/requirement-details-modal";
import { NegotiationChat } from "@/components/negotiation-chat";
import { FiltersPanel } from "@/components/filters-panel";
import { ProviderProfileModal } from "@/components/provider-profile-modal";
import { ProjectSubmissionForm } from "@/components/project-submission-form";
import { ReviewSubmissionForm } from "@/components/review-submission-form";
import { ProviderComparison } from "@/components/provider-comparison";
import { NotificationsWidget } from "@/components/seeker/notifications-widget";
import {
  Plus,
  FileText,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  Eye,
  Home,
  User,
  Briefcase,
  BarChart3,
  Settings,
  CreditCard,
  Bell,
  Shield,
  GitCompare,
  ChevronDown,
  ChevronRight,
  Edit,
  Save,
  X,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  MoreHorizontal,
  Trash2,
  DollarSign,
  Target,
  Heart,
  SeparatorVertical as Separator,
} from "lucide-react";
import {
  mockRequirements,
  mockProposals,
  mockProviders,
} from "@/lib/mock-data";
import type {
  Requirement,
  Proposal,
  Provider,
  Notification,
} from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaFileAlt } from "react-icons/fa";
import { BiHeartCircle } from "react-icons/bi";
import { BiDollarCircle } from "react-icons/bi";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LuTag } from "react-icons/lu";
import { PiCurrencyDollarBold } from "react-icons/pi";
import { CiCalendar } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { FaRegFileLines } from "react-icons/fa6";
import { set } from "mongoose";

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

interface ProjectProposal {
  id: string;
  projectId: string;
  providerId: string;
  providerName: string;
  providerRating: number;
  proposalAmount: number;
  timeline: string;
  description: string;
  submittedAt: string;
  status: "pending" | "shortlisted" | "accepted" | "rejected";
  coverLetter: string;
}

const mockProjectProposals: ProjectProposal[] = [
  {
    id: "pp1",
    projectId: "proj1",
    providerId: "prov1",
    providerName: "TechSolutions Inc",
    providerRating: 4.8,
    proposalAmount: 15000,
    timeline: "8 weeks",
    description:
      "We propose to develop a comprehensive e-commerce platform using React, Node.js, and MongoDB. Our team has extensive experience in building scalable web applications with modern technologies. We'll implement advanced features like real-time inventory management, secure payment processing, and analytics dashboard.",
    submittedAt: "2024-01-15",
    status: "pending",
    coverLetter:
      "We are excited to work on your e-commerce project and deliver a high-quality solution that meets your business needs. Our portfolio includes 20+ successful e-commerce projects.",
  },
  {
    id: "pp2",
    projectId: "proj1",
    providerId: "prov2",
    providerName: "WebCraft Studios",
    providerRating: 4.6,
    proposalAmount: 12000,
    timeline: "10 weeks",
    description:
      "Our approach focuses on creating a user-friendly e-commerce platform with advanced features like real-time inventory management, payment gateway integration, and responsive design. We'll use Next.js for optimal performance and SEO.",
    submittedAt: "2024-01-16",
    status: "shortlisted",
    coverLetter:
      "With 5+ years of e-commerce development experience, we're confident in delivering exceptional results for your project. We guarantee 99.9% uptime and mobile-first design.",
  },
  {
    id: "pp3",
    projectId: "proj1",
    providerId: "prov3",
    providerName: "Digital Commerce Pro",
    providerRating: 4.7,
    proposalAmount: 18000,
    timeline: "6 weeks",
    description:
      "Premium e-commerce solution with AI-powered recommendations, advanced analytics, multi-vendor support, and integrated CRM. We'll deliver a future-ready platform that scales with your business.",
    submittedAt: "2024-01-18",
    status: "pending",
    coverLetter:
      "We specialize in enterprise-level e-commerce solutions and have helped 100+ businesses increase their online revenue by 300% on average.",
  },
  {
    id: "pp4",
    projectId: "proj2",
    providerId: "prov4",
    providerName: "MobileFirst Dev",
    providerRating: 4.9,
    proposalAmount: 8000,
    timeline: "6 weeks",
    description:
      "We specialize in React Native development and will create a cross-platform mobile app with native performance, push notifications, offline capabilities, and seamless user experience across iOS and Android.",
    submittedAt: "2024-01-17",
    status: "accepted",
    coverLetter:
      "Our team has developed 50+ mobile apps with excellent user ratings. We're excited to bring your vision to life with cutting-edge mobile technology.",
  },
  {
    id: "pp5",
    projectId: "proj2",
    providerId: "prov5",
    providerName: "AppCrafters",
    providerRating: 4.5,
    proposalAmount: 9500,
    timeline: "8 weeks",
    description:
      "Native iOS and Android development with Flutter framework. We'll create a high-performance mobile app with custom animations, biometric authentication, and cloud synchronization.",
    submittedAt: "2024-01-19",
    status: "shortlisted",
    coverLetter:
      "We're a team of certified mobile developers with expertise in Flutter, React Native, and native development. Your app will be optimized for performance and user engagement.",
  },
  {
    id: "pp6",
    projectId: "proj3",
    providerId: "prov6",
    providerName: "BrandVision Agency",
    providerRating: 4.8,
    proposalAmount: 5000,
    timeline: "4 weeks",
    description:
      "Complete brand identity package including logo design, color palette, typography, brand guidelines, business cards, letterheads, and social media templates. We'll create a memorable brand that resonates with your target audience.",
    submittedAt: "2024-01-20",
    status: "pending",
    coverLetter:
      "We've created successful brand identities for 200+ companies across various industries. Our designs are modern, timeless, and strategically crafted to drive business growth.",
  },
  {
    id: "pp7",
    projectId: "proj3",
    providerId: "prov7",
    providerName: "Creative Minds Studio",
    providerRating: 4.6,
    proposalAmount: 4500,
    timeline: "3 weeks",
    description:
      "Professional brand identity design with focus on minimalist aesthetics and strong visual impact. Includes logo variations, brand style guide, and application mockups across different mediums.",
    submittedAt: "2024-01-21",
    status: "rejected",
    coverLetter:
      "Our award-winning design team specializes in creating distinctive brand identities that stand out in competitive markets. We guarantee unlimited revisions until you're 100% satisfied.",
  },
  {
    id: "pp8",
    projectId: "proj4",
    providerId: "prov8",
    providerName: "DataFlow Solutions",
    providerRating: 4.9,
    proposalAmount: 25000,
    timeline: "12 weeks",
    description:
      "Enterprise CRM system with advanced analytics, automated workflows, customer segmentation, email marketing integration, and comprehensive reporting dashboard. Built with scalability and security in mind.",
    submittedAt: "2024-01-22",
    status: "shortlisted",
    coverLetter:
      "We're CRM specialists with 10+ years of experience building enterprise solutions for Fortune 500 companies. Our systems handle millions of customer records with 99.99% uptime.",
  },
  {
    id: "pp9",
    projectId: "proj4",
    providerId: "prov9",
    providerName: "Enterprise Tech Hub",
    providerRating: 4.7,
    proposalAmount: 22000,
    timeline: "10 weeks",
    description:
      "Custom CRM solution with AI-powered lead scoring, automated sales pipeline management, integration with popular tools (Salesforce, HubSpot), and mobile app for field sales teams.",
    submittedAt: "2024-01-23",
    status: "pending",
    coverLetter:
      "We understand the complexity of enterprise CRM requirements and have successfully delivered 30+ CRM projects. Our solution will streamline your sales process and boost productivity by 40%.",
  },
  {
    id: "pp10",
    projectId: "proj5",
    providerId: "prov10",
    providerName: "EduTech Innovators",
    providerRating: 4.8,
    proposalAmount: 18000,
    timeline: "10 weeks",
    description:
      "Comprehensive learning management system with video streaming, interactive quizzes, progress tracking, certificate generation, discussion forums, and mobile-responsive design for seamless learning experience.",
    submittedAt: "2024-01-24",
    status: "pending",
    coverLetter:
      "We specialize in educational technology and have built LMS platforms for universities and corporate training programs. Our solutions support 10,000+ concurrent users with excellent performance.",
  },
];

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
      { id: "profile", label: "Profile", icon: User },
      { id: "requirements", label: "My Requirements", icon: FileText },
      { id: "proposals", label: "Proposals", icon: MessageSquare },
      { id: "projects", label: "Projects", icon: Briefcase },
      { id: "providers", label: "Find Agencies", icon: Users },
    ],
  },
  {
    id: "performance",
    label: "PERFORMANCE",
    icon: BarChart3,
    children: [
      { id: "analytics", label: "Project Analytics", icon: TrendingUp },
      { id: "spending", label: "Spending Insights", icon: Eye },
      {
        id: "provider-comparison",
        label: "Provider Comparison",
        icon: GitCompare,
      },
    ],
  },
  {
    id: "account-settings",
    label: "ACCOUNT & SETTINGS",
    icon: Settings,
    children: [
      { id: "billing", label: "Billing & Payments", icon: CreditCard },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "account-settings", label: "Account Settings", icon: Shield },
    ],
  },
];

export default function ClientDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("dashboard"); // Set initial state to "dashboard" so content shows by default

  const [showPostForm, setShowPostForm] = useState(false);
  const [requirements, setRequirements] =
    useState<Requirement[]>(mockRequirements);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedRequirement, setSelectedRequirement] = useState<string | null>(
    null,
  );
  const [selectedRequirementForDetails, setSelectedRequirementForDetails] =
    useState<Requirement | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const [filteredRequirements, setFilteredRequirements] =
    useState<Requirement[]>(mockRequirements);

  const [responseLoading, setResponseLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const [vendors, setVendors] = useState<Provider[]>([]);

  const [statsValues, setStatsValues] = useState({
    matchedVendors: 0,
    proposalCount: 0,
    shorlistedVendors: 0,
    avgProposalAmount: 0,
  });

  const [costDistributionStats, setCostDistributionStats] = useState([
    {
      id: 1,
      range: "$0-$5k",
      value: 0,
    },
    {
      id: 2,
      range: "$5k-$10k",
      value: 0,
    },
    {
      id: 3,
      range: "$10k-$20k",
      value: 0,
    },
    {
      id: 4,
      range: "$20k+",
      value: 0,
    },
  ]);

  const [topVendorsLocations, setTopVendorsLocations] = useState([]);
  const [topVendorsServices, setTopVendorsServices] = useState([]);

  const [selectedRequirementId, setSelectedRequirementId] = useState("");

  const loadData = async () => {
    setResponseLoading(true);
    setFailed(false);

    try {
      const [
        notificationsRes,
        vendorsRes,
        proposalsRes,
        reqRes,
        shortlistVendorsRes,
      ] = await Promise.all([
        authFetch("/api/notifications", { credentials: "include" }),
        authFetch("/api/providers", { credentials: "include" }),
        authFetch(`/api/proposals/${user?.id}`, { credentials: "include" }),
        authFetch(`/api/requirements/${user?.id}`, { credentials: "include" }),
        authFetch("/api/wishlist", { credentials: "include" }),
      ]);

      //  If ANY request failed → throw error
      // if (!notificationsRes.ok || !vendorsRes.ok || !proposalsRes.ok) {
      //   throw new Error("One or more requests failed")
      // }

      const [notificationsData, vendorsData, reqData, shortlistVendorsData] =
        await Promise.all([
          notificationsRes.json(),
          vendorsRes.json(),
          reqRes.json(),
          shortlistVendorsRes.json(),
        ]);
      let proposalsData = { proposals: [] };

      if (proposalsRes.ok) {
        proposalsData = await proposalsRes.json();
      } else if (proposalsRes.status === 404) {
        // New user → no proposals yet
        proposalsData = { proposals: [] };
      } else {
        throw new Error("Failed to fetch proposals");
      }

      console.log(
        "Shortlisted vendors data:::::",
        shortlistVendorsData.data.length,
      );

      setNotifications(
        notificationsData.data.filter((item: any) => !item.isRead),
      );
      setVendors(vendorsData.providers);
      setProposals(proposalsData?.proposals || []);
      setRequirements(reqData.requirements);
      let uniqueRequirementCategories = new Set(
        reqData.requirements.map((item) => item.category),
      );

      let matchedVendors = 0;

      vendorsData.providers.forEach((eachItem) => {
        const hasMatch = eachItem.services.some((service) =>
          uniqueRequirementCategories.has(service),
        );

        if (hasMatch) {
          matchedVendors += 1;
        }
      });

      const avgBudget =
        proposalsData.proposals.length === 0
          ? 0
          : proposalsData.proposals.reduce(
              (sum, p) => sum + (p.proposedBudget ?? 0),
              0,
            ) / proposalsData.proposals.length;

      setStatsValues((prev) => ({
        ...prev,
        matchedVendors: matchedVendors,
        proposalCount: proposalsData.proposals.length,
        avgProposalAmount: avgBudget,
        shorlistedVendors: shortlistVendorsData.data.length,
      }));

      let proposalsLessThanFiveThousand = 0;
      let proposalsLessThanTenThousand = 0;
      let proposalsLessThanTwentyThousand = 0;
      let proposalsMoreThanTwentyThousand = 0;

      proposalsData.proposals.map((item: any) => {
        if (
          (item.proposedBudget || 0) > 0 &&
          (item.proposedBudget || 0) <= 5000
        ) {
          proposalsLessThanFiveThousand += 1;
        }
        if (
          (item.proposedBudget || 0) > 5000 &&
          (item.proposedBudget || 0) <= 10000
        ) {
          proposalsLessThanTenThousand += 1;
        }
        if (
          (item.proposedBudget || 0) > 10000 &&
          (item.proposedBudget || 0) <= 20000
        ) {
          proposalsLessThanTwentyThousand += 1;
        }
        if ((item.proposedBudget || 0) > 20000) {
          proposalsMoreThanTwentyThousand += 1;
        }
      });

      setCostDistributionStats([
        { id: 1, range: "$0-$5k", value: proposalsLessThanFiveThousand },
        { id: 2, range: "$5k-$10k", value: proposalsLessThanTenThousand },
        { id: 3, range: "$10k-$20k", value: proposalsLessThanTwentyThousand },
        { id: 4, range: "$20k+", value: proposalsMoreThanTwentyThousand },
      ]);

      let topVendors = vendorsData.providers.filter((item) => item.rating >= 3);
      let topVendorsUniqueLocations = new Set(
        (topVendors || []).map((item: any) => item.location),
      );
      const topVendorsUniqueServices = new Set(
        (topVendors || []).flatMap((item: any) => item.services),
      );

      let tempVendorLocations = [];
      topVendorsUniqueLocations.forEach((item: any) => {
        let temp = {
          count: 0,
          locationName: item,
        };
        topVendors.map((vendor: any) => {
          if (
            vendor.location.trim().toLowerCase() === item.trim().toLowerCase()
          ) {
            temp.count = temp.count + 1;
          }
        });
        if (!item.trim().toLowerCase().includes("not specified")) {
          tempVendorLocations.push(temp);
        }
      });
      setTopVendorsLocations(tempVendorLocations);

      let tempVendorServices: any[] = [];

      topVendorsUniqueServices.forEach((service: any) => {
        let temp = {
          serviceName: service,
          count: 0,
          percentage: 0,
        };

        topVendors.forEach((vendor: any) => {
          if (
            vendor.services?.some(
              (s: string) =>
                s.trim().toLowerCase() === service.trim().toLowerCase(),
            )
          ) {
            temp.count = temp.count + 1;
          }
        });

        // optional filter like "not specified"
        if (!service.trim().toLowerCase().includes("not specified")) {
          tempVendorServices.push(temp);
        }
      });

      const totalServiceCount = tempVendorServices.reduce(
        (sum, item) => sum + item.count,
        0,
      );

      tempVendorServices = tempVendorServices.map((item) => ({
        ...item,
        percentage:
          totalServiceCount === 0
            ? 0
            : Math.round((item.count / totalServiceCount) * 100),
      }));

      setTopVendorsServices(tempVendorServices);

      console.log("Top vendors locations are :::", tempVendorLocations);

      console.log(
        "Cost Distribbution :::",
        proposalsLessThanFiveThousand,
        proposalsLessThanTenThousand,
        proposalsLessThanTwentyThousand,
        proposalsMoreThanTwentyThousand,
      );
      console.log("Fetched Data", notificationsData.data);
      console.log("Vendors fetched Data::", vendorsData.providers);
      console.log("Proposals fetched data::", proposalsData.proposals);
      console.log("Requirements fetched data:::", reqData.requirements);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setFailed(true);
    } finally {
      setResponseLoading(false);
    }
  };

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const costAnalytics = {
    avgProposalAmount: Math.round(
      mockProjectProposals.reduce((sum, p) => sum + p.proposalAmount, 0) /
        mockProjectProposals.length,
    ),
    minProposalAmount: Math.min(
      ...mockProjectProposals.map((p) => p.proposalAmount),
    ),
    maxProposalAmount: Math.max(
      ...mockProjectProposals.map((p) => p.proposalAmount),
    ),
    budgetRanges: [
      {
        range: "$0-$5k",
        count: mockProjectProposals.filter((p) => p.proposalAmount < 5000)
          .length,
      },
      {
        range: "$5k-$10k",
        count: mockProjectProposals.filter(
          (p) => p.proposalAmount >= 5000 && p.proposalAmount < 10000,
        ).length,
      },
      {
        range: "$10k-$20k",
        count: mockProjectProposals.filter(
          (p) => p.proposalAmount >= 10000 && p.proposalAmount < 20000,
        ).length,
      },
      {
        range: "$20k+",
        count: mockProjectProposals.filter((p) => p.proposalAmount >= 20000)
          .length,
      },
    ],
  };

  const locationAnalytics = [
    { location: "San Francisco, CA", count: 3, percentage: 30 },
    { location: "New York, NY", count: 2, percentage: 20 },
    { location: "Austin, TX", count: 2, percentage: 20 },
    { location: "Seattle, WA", count: 2, percentage: 20 },
    { location: "Boston, MA", count: 1, percentage: 10 },
  ];

  const specialtyAnalytics = [
    { specialty: "Web Development", count: 4, percentage: 40 },
    { specialty: "Mobile Development", count: 2, percentage: 20 },
    { specialty: "UI/UX Design", count: 2, percentage: 20 },
    { specialty: "Enterprise Solutions", count: 2, percentage: 20 },
  ];

  useEffect(() => {
    if (!loading && (!user || user.role !== "client")) {
      router.push("/login");
    }
    if (user && !loading) {
      loadData();
    }
  }, [user, loading, router]);

  const handlePostRequirement = async (newRequirement: any) => {
    try {
      if (!user || user.role !== "client") {
        alert("Only clients can post requirements.");
        return;
      }

      // Prepare payload for API
      const payload = {
        title: newRequirement.title,
        image: newRequirement.image,
        category: newRequirement.category,
        budgetMin: newRequirement.budgetMin,
        budgetMax: newRequirement.budgetMax,
        timeline: newRequirement.timeline,
        description: newRequirement.description,
        createdBy: user.id, // depends on your auth context
      };
      console.log("Requirement payload on main parent:", payload);
      // API CALL
      // const res = await authFetch("/api/requirements", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // })

      const res = await authFetch(
        "/api/requirements",
        {
          method: "POST",
          body: JSON.stringify(payload),
        },
        token,
      );

      const data = await res.json();
      console.log("Requirement created on main parent:", data);
      if (!res.ok) {
        console.error(data.error);
        alert(data.error || "Failed to create requirement");
        return;
      }

      // Use the requirement returned from API
      const created = {
        id: data.requirement._id,
        title: data.requirement.title,
        image: data.requirement.image,
        category: data.requirement.category,
        budgetMin: data.requirement.budgetMin,
        budgetMax: data.requirement.budgetMax,
        timeline: data.requirement.timeline,
        description: data.requirement.description,
        status: data.requirement.status,
        postedDate: "Today",
        proposals: data.requirement.proposals || 0,
      };

      // Update UI lists
      setRequirements((prev) => [created, ...prev]);
      setFilteredRequirements((prev) => [created, ...prev]);

      // Close the form
      setShowPostForm(false);
      setActiveSection("requirements");
    } catch (error) {
      console.error("Error posting requirement:", error);
      alert("Something went wrong!");
    }
  };

  const handleViewProposals = (recievedId: string) => {
    console.log("Recieved Requirement ID::::", recievedId);
    router.push(`/client/dashboard/proposals?requirementId=${recievedId}`);
  };

  const handleViewDetails = (recievedId: string) => {
    setSelectedRequirementId(recievedId);
    setShowDetailsModal(true);
    const requirement = requirements.find((r) => r._id === recievedId);
    setSelectedRequirement(requirement || null);
  };
  const getFileNameFromUrl = (url?: string) => {
    if (!url) return "";
    return url.split("/").pop();
  };

  const handleMarkNotificationAsRead = async (notificationId: string) => {
    console.log("notification Id recievd:::", notificationId);
    const filteredNotification = notifications.find(
      (item) => item._id === notificationId,
    );
    try {
      // const res=await authFetch(`/api/notifications/${notificationId}`,{
      //   method:"PUT",
      //   headers:{
      //     "Content-Type":"application/json"
      //   }
      // })

      await authFetch(
        `/api/notifications/${notificationId}`,
        { method: "PUT" },
        token,
      );
      console.log("response of the mark as read::", res);
      if (res.ok) {
        setNotifications((prev) =>
          prev.filter((eachItem) => eachItem._id !== notificationId),
        );
      }
    } catch (error) {
      console.log("Failed to update the status of the notification::", error);
    }
    if (filteredNotification) {
      router.push(filteredNotification?.linkUrl);
    }
  };

  const handleDismissNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  if (loading || responseLoading) {
    return (
      <div className="bg-background flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user || user.role !== "client") {
    return null;
  }

  // if(failed){
  //     return(
  //       <div className="flex flex-col justify-center items-center text-center">
  //         <h1 className="text-center font-semibold">Failed  to Retrive the data</h1>
  //         <Button onClick={loadData} className="h-[40px] mt-2 w-[90px] bg-[#2C34A1] text-[#fff]">Reload</Button>
  //       </div>
  //     )
  // }

  if (showPostForm) {
    return (
      <div className="bg-background">
        <div className="container mx-auto max-w-7xl py-8 px-4">
          <PostRequirementForm
            onSubmit={handlePostRequirement}
            onCancel={() => setShowPostForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Left Sidebar */}

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          <div className="border-b boreder-[1px] border-[#707070] pb-8">
            <h1 className="text-3xl font-bold text-[#F4561C] my-custom-class leading-5">
              Dashboard Overview
            </h1>
            <p className="text-lg text-[#656565] font-xl">
              Welcome to your client dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-[#fff]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium my-custom-class text-[#000]">
                  Vendor Matches
                </CardTitle>
                <div className=" h-8 w-8 flex items-center justify-center rounded-full bg-[#EEF7FE]">
                  <Users className="h-4 w-4" color="#F54A0C" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#000]">
                  {statsValues.matchedVendors}
                </div>
                <p className="text-xs text-[#F4561C] font-normal">
                  Providers matched to projects
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#fff]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium my-custom-class text-[#000]">
                  Proposal Count
                </CardTitle>
                <div className=" h-8 w-8 flex items-center justify-center rounded-full bg-[#EEF7FE]">
                  <FaFileAlt className="h-4 w-4" color="#F54A0C" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#000]">
                  {statsValues.proposalCount}
                </div>
                <p className="text-xs text-[#F4561C] font-normal my-custom-class">
                  Vendors submitted proposals
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#fff]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium my-custom-class text-[#000]">
                  Shortlisted Vendors
                </CardTitle>
                <div className=" h-8 w-8 flex items-center justify-center rounded-full bg-[#EEF7FE]">
                  <BiHeartCircle className="h-4 w-4" color="#F54A0C" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsValues.shorlistedVendors}
                </div>
                <p className="text-xs text-[#F4561C] font-normal my-custom-class">
                  Agencies shortlisted
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[#fff]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium my-custom-class text-[#000]">
                  Avg Proposal
                </CardTitle>
                <div className=" h-8 w-8 flex items-center justify-center rounded-full bg-[#EEF7FE]">
                  <BiDollarCircle className="h-4 w-4" color="#F54A0C" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${statsValues.avgProposalAmount.toLocaleString()}
                </div>
                <p className="text-xs text-[#F4561C] font-normal my-custom-class">
                  Average proposal amount
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#fff] rounded-2xl">
              <CardHeader>
                <CardTitle className="font-bold text-[#F4561C] text-xl leading-4 my-custom-class">
                  Vendor Comparison
                </CardTitle>
                <CardDescription className="text-md my-custom-class text-[#656565] font-normal">
                  Compare vendors side-by-side with rating breakdown
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-2 text-xs font-medium text-muted-foreground pb-2 px-6">
                    <div className="font-bold text-sm text-[#6B6B6B] my-custom-class">
                      Vendor
                    </div>
                    <div className="text-center font-bold text-sm text-[#6B6B6B] my-custom-class">
                      Quality
                    </div>
                    <div className="text-center font-bold text-sm text-[#6B6B6B] my-custom-class">
                      Schedule
                    </div>
                    <div className="text-center font-bold text-sm text-[#6B6B6B] my-custom-class">
                      Cost
                    </div>
                    <div className="text-center font-bold text-sm text-[#6B6B6B] my-custom-class">
                      Refer
                    </div>
                  </div>

                  {vendors.slice(0, 4).map((vendor) => (
                    <div
                      key={vendor.id}
                      className="grid  border-t-[1px] px-6 pt-4 border-[#E3E3E3] grid-cols-5 gap-2 items-center text-sm"
                    >
                      <div className="font-medium teext-sm text-[#6B6B6B] my-custom-class">
                        {vendor.name}
                      </div>
                      <div className="text-center">
                        <Badge
                          variant="secondary"
                          className="text-xs border-1 border-[#B4D2F4] rounded-full bg-[#F2F2F2] min-w-[40px] text-[#000]"
                        >
                          {vendor?.qualityRating?.toFixed(1) || 0}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <Badge
                          variant="secondary"
                          className="text-xs border-1 border-[#B4D2F4] rounded-full bg-[#F2F2F2] min-w-[40px] text-[#000]"
                        >
                          {vendor?.scheduleRating?.toFixed(1) || 0}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <Badge
                          variant="secondary"
                          className="text-xs border-1 border-[#B4D2F4] rounded-full bg-[#F2F2F2] min-w-[40px] text-[#000]"
                        >
                          {vendor?.costRating?.toFixed(1) || 0}
                        </Badge>
                      </div>
                      <div className="text-center">
                        <Badge
                          variant="secondary"
                          className="text-xs border-1 border-[#B4D2F4] rounded-full bg-[#F2F2F2] min-w-[40px] text-[#000]"
                        >
                          {vendor?.willingToRefer?.toFixed(1) || 0}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#fff] rounded-2xl">
              <CardHeader>
                <CardTitle className="font-bold text-[#F4561C] text-xl leading-4 my-custom-class">
                  Cost Distribution
                </CardTitle>
                <CardDescription className="text-md my-custom-class text-[#656565] font-normal">
                  Proposal budget ranges vs your stated budget
                </CardDescription>
              </CardHeader>
              <CardContent className="px-0 py-0 mb-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm px-6">
                    <span className="text-[#6B6B6B] font-bold text-sm">
                      Budget Range
                    </span>
                    <span className="text-[#6B6B6B] font-bold text-sm">
                      Proposals
                    </span>
                  </div>
                  {costDistributionStats.map((range, index) => (
                    <div key={index} className="space-y-1 px-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#6B6B6B] font-bold text-sm">
                          {range.range}
                        </span>
                        <span className="text-[#6B6B6B] font-bold text-sm">
                          {range.value}
                        </span>
                      </div>
                      <div className="w-full bg-[#DAEDF8] rounded-full h-2">
                        <div
                          className="bg-[#1C96F4] rounded-full h-2 transition-all"
                          style={{
                            width: `${
                              proposals.length === 0
                                ? 0
                                : (range.value / proposals.length) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t-[1px] mt-8 border-[#E3E3E3] px-6 pb-0 mb-0">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B6B6B] text-sm font-bold">
                        Range
                      </span>
                      <span className="text-[#6B6B6B] text-sm font-bold">
                        ${costAnalytics.minProposalAmount.toLocaleString()} - $
                        {costAnalytics.maxProposalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/*Top vendor locations */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#fff] rounded-2xl">
              <CardHeader>
                <CardTitle className="font-bold text-[#F4561C] text-xl leading-4 my-custom-class">
                  Top Vendor Locations
                </CardTitle>
                <CardDescription className="text-md my-custom-class text-[#656565] font-normal">
                  Geographic distribution of responding vendors
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {(() => {
                    const totalVendorsCount = (
                      topVendorsLocations || []
                    ).reduce((sum, item) => sum + (item.count || 0), 0);

                    return (topVendorsLocations || []).map(
                      (location, index) => {
                        const percentage =
                          totalVendorsCount === 0
                            ? 0
                            : Math.round(
                                (location.count / totalVendorsCount) * 100,
                              );

                        return (
                          <div key={index} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-normal text-[#6B6B6B] my-custom-class">
                                  {location.locationName}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-sm font-normal text-[#6B6B6B] my-custom-class">
                                  {location.count}
                                </span>
                                <span className="text-xs font-normal text-[#6B6B6B] my-custom-class">
                                  ({percentage}%)
                                </span>
                              </div>
                            </div>

                            <div className="w-full bg-[#DAEDF8] rounded-full h-2">
                              <div
                                className="bg-[#1C96F4] rounded-full h-2 transition-all"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      },
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#fff] rounded-2xl">
              <CardHeader>
                <CardTitle className="font-bold text-[#F4561C] text-xl leading-4 my-custom-class">
                  Top Vendor Specialties
                </CardTitle>
                <CardDescription className="text-md my-custom-class text-[#656565] font-normal">
                  Expertise areas of responding vendors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topVendorsServices.map((specialty, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-normal text-[#6B6B6B] my-custom-class">
                            {specialty.serviceName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-normal text-[#6B6B6B] my-custom-class">
                            {specialty.count}
                          </span>
                          <span className="text-xs font-normal text-[#6B6B6B] my-custom-class">
                            ({specialty.percentage}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-[#DAEDF8] rounded-full h-2">
                        <div
                          className="bg-[#1C96F4] rounded-full h-2 transition-all"
                          style={{ width: `${specialty.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/*Requirement cards Notifications*/}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-[#fff] rounded-2xl">
                <CardContent>
                  {(requirements || []).length !== 0 ? (
                    <RequirementList
                      requirements={requirements.slice(0, 3)}
                      onViewProposals={handleViewProposals}
                      onViewDetails={handleViewDetails}
                    />
                  ) : (
                    <p className="text-center">No Posted requirements</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div>
              <NotificationsWidget
                notifications={notifications}
                onMarkAsRead={handleMarkNotificationAsRead}
                onDismiss={handleDismissNotification}
              />
            </div>
          </div>
        </div>
      </div>

      {showDetailsModal && selectedRequirement && (
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="sm:max-w-[520px] rounded-2xl p-0 overflow-hidden">
            {/* Header */}
            <div className="p-6 pb-0  mt-4 relative">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold my-custom-class text-[#F4561C]">
                  {selectedRequirement.title}
                </h2>

                <span className="text-xs px-3 py-1 rounded-lg bg-green-100 text-green-700">
                  Open
                </span>
              </div>

              <p className="text-sm text-[#686868] my-custom-class font-normal mt-1">
                Posted on{" "}
                {new Date(selectedRequirement.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Body */}
            <div className="p-6 pt-0 space-y-5">
              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 border-2 border-[#F0F0F0] rounded-lg px-3 py-2">
                  <LuTag className="w-5 h-5" color="#000" />
                  <span className="my-custom-class font-bold text-xs text-[#000]">
                    Category: {selectedRequirement.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                  <PiCurrencyDollarBold className="w-5 h-5" color="#000" />
                  <span className="my-custom-class font-semibold text-xs text-[#000]">
                    Budget: ${selectedRequirement.budgetMin} - $
                    {selectedRequirement.budgetMax}
                  </span>
                </div>

                <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                  <CiCalendar className="w-5 h-5" color="#000" />
                  <span className="my-custom-class font-semibold text-xs text-[#000]">
                    Timeline: {selectedRequirement.timeline}
                  </span>
                </div>

                <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
                  <CiLocationOn className="w-5 h-5" color="#000" />
                  <span className="my-custom-class font-semibold text-xs text-[#000]">
                    Location: {selectedRequirement.location || "Remote"}
                  </span>
                </div>
              </div>

              <hr className="border-1 border-[#E4E4E4] my-6" />

              {/* Description */}
              <div className="border-b-2 border-[#E4E4E4] pb-6">
                <h3 className="font-semibold text-[#F4561C] my-custom-class text-lg mb-1">
                  Description
                </h3>
                <p className="text-sm text-[#656565] leading-relaxed">
                  {selectedRequirement.description}
                </p>
              </div>

              {selectedRequirement.documentUrl && (
                <div className="flex flex-row justify-start items-center p-4 border rounded-xl shadow gap-3">
                  <div className="flex justify-center items-center bg-[#EEF7FE] shrink-0 rounded-full h-10 w-10">
                    <FaRegFileLines className="h-6 w-6" color="#F54A0C" />
                  </div>
                  <h1 className="text-md font-normal text-[#686868]">
                    {getFileNameFromUrl(selectedRequirement.documentUrl)}
                  </h1>
                </div>
              )}

              {/* Attachments */}
              {/* {selectedRequirement.attachments?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-[#F4561C] text-lg mb-2">Attachments</h3>

                        <div className="space-y-2">
                          {selectedRequirement.attachments.map((file: any, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 border rounded-lg px-3 py-2"
                            >
                              📄
                              <span className="text-sm text-gray-700">{file.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )} */}
            </div>

            {/* Footer */}
            <div className="p-6 pt-4 border-t flex justify-start gap-4">
              <Button
                className="bg-[#2C34A1] hover:bg-[#2C34A1] text-white rounded-full px-6 flex items-center gap-2"
                onClick={() => handleViewProposals(selectedRequirement._id)}
              >
                View Proposal →
              </Button>
              <DialogClose asChild>
                <Button
                  variant="default"
                  className="bg-[#000] hover:bg-[#000] w-[100px] rounded-full px-6"
                >
                  Close
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
