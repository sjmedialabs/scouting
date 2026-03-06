"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/auth-fetch";
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
import { FiltersPanel } from "@/components/filters-panel";
import { RequirementList } from "@/components/seeker/requirement-list";
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

const RequirementsPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [requirements, setRequirements] =
    useState<Requirement[]>(mockRequirements);
  const [filteredRequirements, setFilteredRequirements] =
    useState<Requirement[]>(mockRequirements);
  const [selectedRequirementId, setSelectedRequirementId] = useState<
    string | null
  >(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] =
    useState<Requirement | null>(null);
  const [responseLoading, setResponseLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  console.log("user Details::::", user);

  const loadData = async (userId: string) => {
    setResponseLoading(true);
    try {
      const response = await authFetch(`/api/requirements/${userId}`);
      const data = await response.json();
      setRequirements(data.requirements);
      setFilteredRequirements(data.requirements);
      setFailed(false);
    } catch (error) {
      setFailed(true);
      console.log("Failed to fetch the  data");
    } finally {
      setResponseLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && (!user || user.role !== "client")) {
      router.push("/login");
    }
    if (!loading && user) {
      loadData(user.id);
    }
  }, [user, loading, router]);

  console.log("Fetched Requirements::::", requirements);

  const normalize = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ""); // removes space, -, _, etc.

  const handleFiltersChange = (filters: any) => {
    let filtered = [...requirements];
    console.log("Applied filters:::::", filters);

    if (filters.serviceType) {
      filtered = filtered.filter((r) => r.category === filters.serviceType);
    }

    if (filters.status) {
      filtered = filtered.filter(
        (r) => r.status.toLowerCase() === filters.status.toLowerCase(),
      );
    }

    if (filters.budgetRange) {
      filtered = filtered.filter(
        (r) =>
          r.budgetMin >= filters.budgetRange[0] &&
          r.budgetMax <= filters.budgetRange[1],
      );
    }
    if (filters.title) {
  const search = normalize(filters.title);

  filtered = filtered.filter((eachItem) =>
    normalize(eachItem.title).includes(search)
  );
}

    setFilteredRequirements(filtered);
  };

  const handleViewDetails = (recievedId) => {
    setSelectedRequirementId(recievedId);
    setShowDetailsModal(true);
    const requirement = requirements.find((r) => r._id === recievedId);
    setSelectedRequirement(requirement || null);
  };
  const handleViewProposals = (recievedId) => {
    console.log("Recieved Requirement ID::::", recievedId);
    router.push(`/client/dashboard/proposals?requirementId=${recievedId}`);
  };
  const getFileNameFromUrl = (url?: string) => {
    if (!url) return "";
    return url.split("/").pop();
  };
  if (loading || responseLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (failed) {
    return (
      <div className="flex flex-col justify-center items-center text-center min-h-100">
        <h1 className="text-center font-semibold">
          Failed to Retrive the data
        </h1>
        <Button
          onClick={loadData}
          className="h-[40px] mt-2 w-[90px] bg-[#2C34A1] text-[#fff]"
        >
          Reload
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="my-custom-class">
        <h1 className="text-3xl font-bold text-[#F4561C] tracking-tight">
          My Requirements
        </h1>
        <p className="text-[#656565] text-xl font-light ">
          Manage all your posted requirements
        </p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <FiltersPanel onFiltersChange={handleFiltersChange} />
        </div>
        <div className="lg:col-span-3">
          <Card className="bg-[#fff] rounded-[16px] py-1 px-0 p-0 min-h-100">
            <CardContent className="max-h-[600px] overflow-y-auto p-6">
              {filteredRequirements && (
                <RequirementList
                  requirements={filteredRequirements}
                  onViewProposals={handleViewProposals}
                  onViewDetails={handleViewDetails}
                />
              )}
              {filteredRequirements.length === 0 && (
                <div className="flex justify-center items-center">
                  <p className="text-xl font-light text-[#000]">
                    No Requirements with these applied filters
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
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
};
export default RequirementsPage;
