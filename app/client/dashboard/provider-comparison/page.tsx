"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { authFetch } from "@/lib/auth-fetch";

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
  Search,
} from "lucide-react";
import { useState, useEffect, Provider } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/ui/star-rating";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RatingStars from "@/components/rating-star";
import { toast } from "@/lib/toast";
import { RxCross2 } from "react-icons/rx";
import { FaRegTimesCircle } from "react-icons/fa";
interface Provider {
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
const ProviderComparisonPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showVendorModal, setShowVendorModal] = useState(false);

  const [providers, setProviders] = useState<Provider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);

  const [projectTitles, setProjectTitles] = useState<String[]>([]);

  const [selectedVendor, setSelectedVendor] = useState<Provider[]>([]);

  const [loadingResponse, setLoadingResponse] = useState(false);
  const [failed, setFailed] = useState(false);

  const [filterStatus, setFilterStatus] = useState("lowToHigh");

  const [searchFilter, setSearchFilter] = useState("");

  const getBgColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "accepted":
        return "bg-[#39A935] text-[#fff]";
      case "shortlisted":
        return "bg-[#1C96F4] text-[#fff]";
      case "negotiation":
        return "bg-[#FCF6E3] text-[#AF905D]";
      case "rejected":
        return "bg-[#FF0000] text-[#fff]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  useEffect(() => {
    if (!loading && (!user || user.role !== "client")) {
      router.push("/login");
    }
    if (!loading && user) {
      loadData();
    }
  }, [user, loading, router]);

  useEffect(() => {
    applyFilters("", "lowToHigh");
  }, [providers]);
  const loadData = async () => {
    //fetch proposals from API
    setLoadingResponse(true);
    setFailed(false);
    try {
      const response = await authFetch("/api/providers", {
        credentials: "include",
      });
      const data = await response.json();
      const vendorsResponse = await authFetch(`/api/comparision/${user?.id}`, {
        credentials: "include",
      });
      const vendorsData = await vendorsResponse.json();
      // console.log("fetched Vendors Data:::",vendorsData)
      if (response.ok) {
        console.log("Fetched providers:", data.providers);
        setFailed(false);
        setProviders(data.providers);
        setFilteredProviders(data.providers);
        // setFilteredProposals(data.proposals);
        setSelectedVendor(vendorsData.data);
        // setProjectTitles(Array.from(
        //   new Set(data.proposals.map(item => item.requirement?.title))
        // ))
      }
    } catch (error) {
      console.error("Error fetching proposals:", error);
      setFailed(true);
    } finally {
      setLoadingResponse(false);
    }
  };

  const addToCompare = async (recievdProviderId: any) => {
    console.log("Added proposal is:::", recievdProviderId);
    try {
      const payload = {
        agencyId: recievdProviderId,
      };
      const response = await authFetch("/api/comparision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      const data = await response.json();
      console.log("added comparision response:::", data);
      if (response.ok) {
        setSelectedVendor((prev) => [...(prev || []), data.data]);
        // loadData()
        toast.success("added to compare");
      } else {
        toast.error(`failed to add compare ${data.message}`);
      }
    } catch (error) {
      console.log("Failed to fetch the  data", error);
      toast.error("failed to add compare page");
    }
  };

  const removeVendorHandle = async (recievedProposal: any) => {
    console.log("Recievd Id to remove the proposal:::", recievedProposal);
    try {
      const response = await authFetch(
        `/api/comparision/${recievedProposal._id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      const data = await response.json();
      if (response.ok) {
        setSelectedVendor((prev) =>
          prev.filter((eachItem) => eachItem._id !== recievedProposal._id),
        );
        toast.success("Removed vendor from the comparision page");
      } else {
        toast.error(`failed ${data.mesage}`);
      }
    } catch (error) {
      console.log("failed to delete the vendor");
      toast.error(`failed ${data.mesage}`);
    }
  };

  console.log("Selected Providers::::", selectedVendor);

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    applyFilters(searchFilter, value);
  };
  const applyFilters = (searchValue: string, sortValue: string) => {
    let data = [...providers];

    // 🔍 Search
    if (searchValue) {
      data = data.filter((item) =>
        item.name.toLowerCase().includes(searchValue.toLowerCase()),
      );
    }

    // ⭐ Sort
    if (sortValue === "lowToHigh") {
      data.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
    }

    if (sortValue === "highToLow") {
      data.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }

    setFilteredProviders(data);
  };

  const handleAddtoFavourite = async (recievdId: string) => {
    console.log("Id for the add to wishlist:::", recievdId);
    const provider = (selectedVendor || []).find(
      (eachItem: any) => eachItem.agency._id === recievdId,
    );
    console.log("data to be add::", provider);

    try {
      const comparisonRes = await authFetch(
        `/api/comparision/${provider?._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isFavourite: !provider?.isFavourite }),
          credentials: "include",
        },
      );
      if (!provider?.isFavourite) {
        const wishlistRes = await authFetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agencyId: recievdId }),
          credentials: "include",
        });
      }
      if (provider?.isFavourite) {
        const wishlistRes = await authFetch(`/api/wishlist/${recievdId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
      }
      if (comparisonRes.ok) {
        setSelectedVendor((prev) =>
          prev.map((eachItem) =>
            eachItem.agency._id === recievdId
              ? { ...eachItem, isFavourite: !eachItem.isFavourite }
              : eachItem,
          ),
        );
      }
    } catch (error) {
      console.log(
        "Failed to add to the wishlist the provider::",
        error?.message,
      );
    }
  };

  if (loadingResponse || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="flex flex-col justify-center items-center text-center">
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
    <div className="space-y-6 p-3 md:p-6">
      <div>
        <h1 className="text-3xl text-[#F4561C] my-custom-class leading-6">
          Provider Comparison
        </h1>
        <p className="text-lg text-[#656565] my-custom-class mt-0">
          Compare vendors side-by-side to make informed decisions
        </p>
      </div>

      {/* Vendor Selection */}
      <Card className="border-[1px] border-[#D1CBCB] rounded-3xl bg-[#fff] shadow-none w-auto">
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <div>
              <CardTitle className="text-[#333333] text-2xl font-bold my-custom-class leading-6">
                Select Vendors to Compare
              </CardTitle>
              <CardDescription className="text-md text-[#333333] font-normal my-custom-class">
                Choose up to 4 vendors to compare their ratings and proposals
              </CardDescription>
            </div>
            <div>
              <Button
                variant="outline"
                onClick={() => setShowVendorModal(true)}
                size="sm"
                className="border-[1px] border-[#DEDEDE] rounded-full bg-[#EDEDED] text-[#000] hover:text-[#000] active:bg-[#EDEDED] hover:bg-[#EDEDED]"
              >
                Add Vendor
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {(selectedVendor || []).length !== 0 &&
              selectedVendor.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  size="sm"
                  className="border-[1px] border-[#DEDEDE] rounded-full bg-[#EDEDED] text-[#000] hover:text-[#000] active:bg-[#EDEDED] hover:bg-[#EDEDED]"
                >
                  {item.agency.name}
                </Button>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Side-by-Side Comparison */}
      {(selectedVendor || []).length !== 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {(selectedVendor || []).map((proposal) => (
            <Card
              key={proposal.id}
              className="relative px-0 py-3 border-[1px] shadow-none rounded-2xl bg-[#fff]  border-[#EBEBEB]  "
            >
              <CardHeader className="px-0 py-0 mb-0">
                <div className="flex justify-end mr-5">
                  <FaRegTimesCircle
                    className="h-5 w-5 cursor-pointer"
                    color="#000"
                    onClick={() => removeVendorHandle(proposal)}
                  />
                </div>
                <div className="flex items-start justify-start gap-2 p-4 pt-0 bg-[#fff]">
                  <div className="items-center">
                    <img
                      src={proposal.agency?.logo || "/demilogo.png"}
                      alt={proposal.providerName}
                      className=" min-w-18 h-[70px] max-w-23 object-contain mb-2"
                    />
                  </div>
                  <div className="items-center mt-2">
                    <CardTitle className="text-lg font-bold text-[#000]">
                      {proposal.agency.name}
                    </CardTitle>
                    <div className="flex items-center  mt-1">
                      <StarRating rating={proposal.agency.rating || 0} />
                      <span className="text-sm ml-1  font-bold text-[#000]">{` (${proposal.agency.reviewCount || 0})`}</span>
                    </div>
                  </div>
                  {/* <Button variant="ghost" size="sm">
                        <X className="h-4 w-4" />
                      </Button> */}
                </div>
              </CardHeader>
              <CardContent className="space-y-0 mb-1 px-0 py-0">
                {/* Proposal Details */}
                <div className="space-y-0 bg-[#DBE8F2]  -mt-8 p-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#000] text-xl font-bold">
                      Proposal Amount
                    </span>
                    <span className="font-bold text-lg">
                      ${proposal.agency.minAmount?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#000] text-xl font-bold">
                      Timeline
                    </span>
                    <span className="font-bold text-lg">
                      {proposal.agency.minTimeLine}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#000] text-xl font-bold">
                      Location
                    </span>
                    <span className="font-bold text-lg">
                      {proposal.agency.location || "Remote"}
                    </span>
                  </div>
                </div>

                {/* Rating Breakdown */}
                <div className="space-y-0 bg-[#E9F5FF] p-6">
                  <h4 className="text-[#F54A0C] text-xl mb-3 font-bold -ml-2">
                    Rating Breakdown
                  </h4>

                  {/* Quality Rating */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B6B6B] font-bold text-md my-custom-class">
                        Quality
                      </span>
                      <span className="font-bold text-[#6B6B6B] text-md">
                        {proposal.agency.qualityRating || 0}/5.0
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00C951]"
                        style={{
                          width: `${(proposal.agency.qualityRating / 5) * 100 || 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Schedule Rating */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B6B6B] font-bold text-md my-custom-class">
                        Schedule
                      </span>
                      <span className="font-bold text-[#6B6B6B] text-md">
                        {proposal.agency.scheduleRating || 0}/5.0
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2B7FFF]"
                        style={{
                          width: `${(proposal.agency.scheduleRating / 5) * 100 || 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Cost Rating */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B6B6B] font-bold text-md my-custom-class">
                        Cost
                      </span>
                      <span className="font-bold text-[#6B6B6B] text-md">
                        {proposal.agency.costRating || 0}/5.0
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#F0B100]"
                        style={{
                          width: `${(proposal.agency.costRating / 5) * 100 || 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Willing to Refer */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#6B6B6B] font-bold text-md my-custom-class">
                        Willing to Refer
                      </span>
                      <span className="font-bold text-[#6B6B6B] text-md">
                        {Math.round((proposal.agency.willingToReferRating / 5) * 100 )|| 0}{" "}
                        %
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#34359B]"
                        style={{
                          width: `${(proposal.agency.willingToReferRating / 5) * 100 || 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Key Strengths */}
                <div className="space-y-2 bg-[#fffff] p-6">
                  {/* <h4 className="text-[#F54A0C] font-bold text-lg">
                    Key Strengths
                  </h4> */}
                  <div className="flex flex-wrap gap-2">
                    {/* <Badge variant="secondary" className="bg-[#1C96F4] rounded-full text-xs my-custom-class min-h-[40px] min-w-[100px] text-[#fff]">Fast Delivery</Badge>
                        <Badge variant="secondary" className="bg-[#1C96F4] rounded-full text-xs my-custom-class min-h-[40px] min-w-[100px] text-[#fff]">Great Communication</Badge>
                        <Badge variant="secondary" className="bg-[#1C96F4] rounded-full text-xs my-custom-class min-h-[40px] min-w-[100px] text-[#fff]">High Quality</Badge> */}
                    {(proposal.keyHighlights || []).map((item) => (
                      <Badge
                        variant="secondary"
                        className="bg-[#1C96F4] rounded-full text-xs my-custom-class min-h-[40px] min-w-[100px] text-[#fff]"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 p-6 pt-0 bg-[#fff]">
                  <a
                    href={`/provider/${proposal.agency._id}`}
                    target="_blank"
                    className="w-full"
                  >
                    <Button
                      className="flex-1 bg-[#2C34A1] w-full rounded-full min-h-[40px]"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </a>
                  <Button
                    variant="outline"
                    onClick={() => handleAddtoFavourite(proposal.agency._id)}
                    size="sm"
                    className={`items-center ${proposal.isFavourite ? "bg-red-500" : "bg-[#000]"} rounded-full mt-0 min-h-[40px]`}
                  >
                    <Heart className="h-8 w-8" color="#fff" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedVendor.length === 0 && (
        <div className="flex justify-center items-center mt-10 mb-10 min-h-[200px]">
          <p className="text-xl text-[#656565] font-bold">
            Venders are not added
          </p>
        </div>
      )}

      {/* Comparison Summary Table*/}
      <h1 className="text-xl text-[#F54A0C] font-bold mb-1 my-custom-class">
        Comparison Summary
      </h1>
      {(selectedVendor || []).length !== 0 && (
        <Card className="bg-[#fff] mt-2 rounded-xl border-[1px] border-[#E6E6E6]">
          {/* ⚠️ Important: NO overflow on CardContent */}
          <CardContent className="p-0 font-bold text-black text-sm">
            {/* Scroll wrapper */}
            <div className="relative w-full overflow-x-auto">
              <table className="w-full  border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-bold">Criteria</th>
                    {selectedVendor.map((item) => (
                      <th
                        key={item._id}
                        className="text-center p-3 font-bold text-black"
                      >
                        {item.agency.name}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-bold">Overall Rating</td>
                    {selectedVendor.map((p) => (
                      <td key={p._id} className="text-center p-3 font-medium">
                        {p.agency.rating}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="p-3 font-bold">Proposal Amount</td>
                    {selectedVendor.map((p) => (
                      <td key={p._id} className="text-center p-3 font-medium">
                        ${p.agency?.minAmount.toLocaleString()}
                      </td>
                    ))}
                  </tr>

                  <tr className="border-b">
                    <td className="p-3 font-bold">Timeline</td>
                    {selectedVendor.map((p) => (
                      <td key={p._id} className="text-center p-3 font-medium">
                        {p.agency.minTimeLine}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/*Vendor modal */}
      {showVendorModal && (
        <Dialog open={showVendorModal} onOpenChange={setShowVendorModal}>
          <DialogContent className="max-h-[90vh] p-0 flex flex-col sm:min-w-3xl">
            {/* 🔹 HEADER (Fixed) */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h1 className="text-xl text-[#F4561C] font-normal">
                Select Vendor to compare
              </h1>
            </div>

            {/* 🔹 FILTER + CONTENT (Scrollable) */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Filter */}
              <div className="grid grid-cols-2 gap-5 w-full">
                <div className="relative w-full min-w-0">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search providers..."
                    className="
                    pl-10 text-sm md:text-base
                    border-0 border-b-2 border-b-[#b2b2b2]
                    bg-transparent rounded-none shadow-none
                    focus:outline-none focus:ring-0
                    focus-visible:outline-none focus-visible:ring-0
                    focus:border-[#F54A0C]
                  "
                    value={searchFilter}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchFilter(value);
                      applyFilters(value, filterStatus);
                    }}
                  />
                </div>
                <Select onValueChange={handleFilterChange} value={filterStatus}>
                  <SelectTrigger
                    className="
                  mt-1
                  border-0
                  border-2
                  border-[#b2b2b2]
                  rounded-full
                  shadow-none
                  focus:outline-none focus:ring-0
                  focus-visible:outline-none focus-visible:ring-0
                  focus:border-[#b2b2b2]
                  placeholder:text-[#b2b2b2]
                  px-6
                  w-[160px]
        
                  h-12
                  text-sm
                  md:text-base
                "
                  >
                    <SelectValue placeholder="Rating" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="lowToHigh">Low To High</SelectItem>
                    <SelectItem value="highToLow">High To Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Proposals */}
              {(filteredProviders || []).length !== 0 ? (
                <div className="mt-4 grid sm:grid-cols-2 gap-4">
                  {filteredProviders.map((provider) => (
                    <Card
                      key={provider.id}
                      className="rounded-4xl mb-2 overflow-hidden border-2 border-[#E0E0E0]  py-0 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Image flush to top */}
                      <div className="w-full">
                        <img
                          src={provider?.coverImage || "/uploads/15ac2d8f-31f9-48ac-aadd-b67ba9f4d860-Artificial-intelligence-platforms-copy.jpg"}
                          alt={provider.name}
                          className="w-full h-[200px] sm:h-[240px] md:h-[300px] object-cover block"
                        />
                      </div>

                       {/* CONTENT */}
                        <div className="p-4 sm:p-6 flex flex-col flex-1">
                          {/* 🔝 TOP CONTENT (normal flow) */}
                          <div>
                            {/* Badges + rating */}
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div className="flex flex-wrap gap-2">
                                {provider.isVerified && (
                                  <Badge className="bg-[#2C34A1] text-white h-7 px-3 rounded-2xl">
                                    Verified
                                  </Badge>
                                )}
                                {provider.isFeatured && (
                                  <Badge className="bg-[#F54A0C] text-white h-7 px-3 rounded-2xl">
                                    Featured
                                  </Badge>
                                )}
                              </div>
      
                              <div className="flex items-center gap-1 text-sm">
                                <RatingStars rating={provider.rating} />
                                <span className="font-semibold">
                                  {provider.rating}
                                </span>
                                <span className="text-muted-foreground">
                                  ({provider.reviewCount})
                                </span>
                              </div>
                            </div>
      
                            {/* Title + description */}
                            <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-left">
                              {provider.name}
                            </h3>
                            <p className="mt-1 text-sm text-[#b2b2b2] text-left">
                              {provider.tagline}
                            </p>
      
                            {/* Tags */}
                            <div className="mt-3 mb-4">
                              {provider.services.length !== 0 ? (
                                <div className="flex flex-wrap gap-2">
                                  {provider.services.map((service) => (
                                    <Badge
                                      key={service}
                                      variant="outline"
                                      className="h-7 px-3 rounded-2xl bg-[#f2f2f2] text-[#000] text-xs sm:text-sm"
                                    >
                                      {service}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center mx-auto">
                                  <p className="text-xl my-6 text-gray-400">
                                    No Services
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
      
                          {/* 🔽 BOTTOM CONTENT (sticks to bottom) */}
                          <div className="mt-auto">
                            {/* Info row */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs sm:text-sm">
                              <div className="flex items-center gap-2">
                                <img src="/location-filled.jpg" className="h-4 w-4" />
                                <span className="text-[#808080] font-semibold break-words">
                                  {provider?.location || "N/A"}
                                </span>
                              </div>
      
                              <div className="flex items-center gap-2">
                                <img src="/briefcase.jpg" className="h-4 w-4" />
                                <span className="text-[#808080] font-semibold">
                                  {provider.projectsCompleted} projects
                                </span>
                              </div>
      
                              <div className="flex items-center gap-2">
                                <img
                                  src="/chat-operational.jpg"
                                  className="h-4 w-4"
                                />
                                <span className="text-[#808080] font-semibold">
                                  Response: {provider?.responseTime || "2 hrs"}
                                </span>
                              </div>
                            </div>
                            <p className="text-[#808080] text-sm sm:text-base font-semibold mb-3">
                              From: {provider?.hourlyRate || 0}/hour
                            </p>
      
                            <div className="mt-3 flex flex-col sm:flex-row gap-2">
                              <Button
                                className="w-full sm:w-[140px] bg-[#2C34A1] hover:bg-[#2C34A1] rounded-3xl text-white"
                                onClick={() => addToCompare(provider.id)}
                              >
                                Compare
                              </Button>
                              
                            </div>
                          </div>
                        </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="mt-6">
                  <p className="text-center text-[#000]">
                    No vendors available to display.
                  </p>
                </div>
              )}
            </div>

            {/* 🔹 FOOTER (Fixed) */}
            <div className="px-6 py-4 border-t">
              <DialogClose asChild>
                <Button className="bg-[#000] rounded-full hover:bg-[#000] active:bg-[#000]">
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
export default ProviderComparisonPage;
