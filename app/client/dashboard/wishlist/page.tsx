"use client";
import { authFetch } from "@/lib/auth-fetch";
import { useEffect, useState } from "react";

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
  Search,
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
import Link from "next/link";
import RatingStars from "@/components/rating-star";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { CiCalendar } from "react-icons/ci";
import { Content } from "next/font/google";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FaArrowRightLong } from "react-icons/fa6";
import { toast } from "@/lib/toast";

const WishListPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [wishListData, setWishListData] = useState([]);

  const loadData = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const response = await authFetch("/api/wishlist", {
        credentials: "include",
      });
      const data = await response.json();
      console.log("Fetched  Data:::", data);
      setWishListData(data.data);
      setFailed(false);
    } catch (error) {
      console.log("Failded To retrive the data:::", error);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);
  const handleRemove = async (recievedId: string) => {
    try {
      const res = await authFetch(`/api/wishlist/${recievedId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        setWishListData((prev) =>
          prev.filter((eachItem) => eachItem.agency._id !== recievedId),
        );
        toast.success("Successfully removed from the wishlist");
      }
    } catch (error) {
      console.log("Failed to delete the provider from");
      // toast.error(`Failed to remove the provider ${error.message}`)
    }
  };
  const handleViewProfile = async (providerId: string) => {
    try {
      // fire analytics update
      await authFetch(`/api/providers/${providerId}/profile-view`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to update profile view", err);
    }

    // open profile page
    window.open(`/provider/${providerId}`, "_blank");
  };

  console.log("Fetched Wish list data is:::", wishListData);
  return (
    <div className="space-y-6 p-3 md:p-6">
      <div>
        <h1 className="text-3xl text-[#F4561C] my-custom-class leading-6">
          Wish List
        </h1>
        <p className="text-lg text-[#656565] my-custom-class mt-0">
          Compare vendors side-by-side to make informed decisions
        </p>
      </div>

      {(wishListData || []).length === 0 && !loading && !failed && (
        <div>
          <p className="text-xl text-[#6b6b6b] font-medium">
            No providers are added to wishlist
          </p>
        </div>
      )}
      {loading && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      {!loading && failed && (
        <div className="flex flex-col min-h-[100vh] justify-center items-center text-center">
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
      )}

      {(wishListData || []).length !== 0 && !loading && !failed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {wishListData.map((provider) => (
            <Card
              key={provider._id}
              className="rounded-4xl flex flex-col overflow-hidden border-2 border-[#E0E0E0]  py-0 shadow-sm hover:shadow-md transition-shadow"
            >
              
              {/* Image flush to top */}
              <div className="w-full">
                <img
                  src={provider?.coverImage || "/uploads/15ac2d8f-31f9-48ac-aadd-b67ba9f4d860-Artificial-intelligence-platforms-copy.jpg"}
                  alt={provider.name}
                  className="w-full h-[200px] sm:h-[240px] md:h-[300px] object-cover block"
                />
              </div>

              <div className="p-4 sm:p-6">
                {/* Badges + rating */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {provider.agency.isVerified && (
                      <Badge className="bg-[#2C34A1] text-white h-7 px-3 rounded-2xl">
                        Verified
                      </Badge>
                    )}
                    {provider.agency.isFeatured && (
                      <Badge className="bg-[#F54A0C] text-white h-7 px-3 rounded-2xl">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-sm">
                    <RatingStars rating={provider.agency.rating} />
                    <span className="font-semibold">
                      {provider.agency.rating}
                    </span>
                    <span className="text-muted-foreground">
                      ({provider.agency.reviewCount})
                    </span>
                  </div>
                </div>

                {/* Title + description (left aligned) */}
                <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-left">
                  {provider.agency.name}
                </h3>
                <p className="mt-1 text-sm text-[#b2b2b2] text-left">
                  {provider.agency.tagline}
                </p>

                {/* Tags – tighter gap to description */}
                <div className="flex flex-wrap gap-2 mt-3 sm:mt-3 mb-4">
                  {provider.agency.services.map((service) => (
                    <Badge
                      key={service}
                      variant="outline"
                      className="h-7 px-3 rounded-2xl bg-[#f2f2f2] text-[#000] text-xs sm:text-sm"
                    >
                      {service}
                    </Badge>
                  ))}
                </div>
                </div>

                {/* Info row */}
                <div className="justify-end mt-auto px-4 mb-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs sm:text-sm">
                
                  <div className="flex items-center gap-2">
                    <img src="/location-filled.jpg" className="h-5 w-4" />
                    <span className="text-[#808080] font-semibold break-words">
                      {provider?.agency.location || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="/briefcase.jpg" className="h-4 w-4" />
                    <span className="text-[#808080] font-semibold">
                      {provider.agency.projectsCompleted} projects
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <img src="/chat-operational.jpg" className="h-4 w-4" />
                    <span className="text-[#808080] font-semibold">
                      Response: {provider?.agency.responseTime || "2 hrs"}
                    </span>
                  </div>
                </div>

                {/* Price + buttons */}
                <p className="text-[#808080] text-sm sm:text-base font-semibold">
                  From: {provider.agency.hourlyRate}/hour
                </p>

                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <Button
                    className="w-full sm:w-30 bg-[#2C34A1] hover:bg-[#2C34A1] rounded-3xl text-white"
                    onClick={() => handleViewProfile(provider.agency._id)}
                  >
                    View Profile
                  </Button>

                  <Button
                    className="w-full sm:w-30 bg-[#4d4d4d] rounded-3xl text-white"
                    onClick={() => {
                      window.location.href = `mailto:${provider.email}`;
                    }}
                  >
                    Contact Provider
                  </Button>
                  <Button
                    className="rounded-full bg-red-500 text-[#fff] hover:bg-red-500 active:bg-red-500"
                    onClick={() => handleRemove(provider.agency._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default WishListPage;
