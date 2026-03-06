"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authFetch } from "@/lib/auth-fetch";
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
import { MdLocationOn } from "react-icons/md";
const ClientAnalyticsPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [responseLoading, setResponseLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const [vendors, setVendors] = useState<Provider[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [costDistributionStats, setCostDistributionStats] = useState([
    {
      id: 1,
      range: "Under $30,000",
      value: 0,
      color: "bg-green-500",
      percentage: 0,
    },
    {
      id: 2,
      range: "$30,000 - $50,000",
      value: 0,
      color: "bg-blue-500",
      percentage: 0,
    },
    {
      id: 3,
      range: "$50,000 - $70,000",
      value: 0,
      color: "bg-yellow-500",
      percentage: 0,
    },
    {
      id: 4,
      range: "Over $70,000",
      value: 0,
      color: "bg-red-500",
      percentage: 0,
    },
  ]);
  const [costAnalyticsStats, setCostAnalyticsStats] = useState({
    avg: 0,
    median: 0,
    range: "$0-0$",
  });

  const [topVendorsLocations, setTopVendorsLocations] = useState([]);
  const [topVendorsServices, setTopVendorsServices] = useState([]);

  const loadData = async () => {
    setResponseLoading(true);
    setFailed(false);

    try {
      const [vendorsRes, proposalsRes, reqRes] = await Promise.all([
        authFetch("/api/providers"),
        fetch(`/api/proposals/${user?.id}`),
        fetch(`/api/requirements/${user?.id}`),
      ]);

      //  If ANY request failed → throw error

      const [vendorsData, reqData] = await Promise.all([
        vendorsRes.json(),

        reqRes.json(),
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

      setVendors(vendorsData.providers);
      setProposals(proposalsData.proposals);
      setRequirements(reqData.requirements);

      let underThirtyThousand = 0;
      let ThirtyToFiftyThousand = 0;
      let FiftyToSeventyThousand = 0;
      let proposalsMoreThanSeventyThousand = 0;

      proposalsData.proposals.map((item: any) => {
        if (
          (item.proposedBudget || 0) > 0 &&
          (item.proposedBudget || 0) <= 30000
        ) {
          underThirtyThousand += 1;
        }
        if (
          (item.proposedBudget || 0) > 30000 &&
          (item.proposedBudget || 0) <= 50000
        ) {
          ThirtyToFiftyThousand += 1;
        }
        if (
          (item.proposedBudget || 0) > 50000 &&
          (item.proposedBudget || 0) <= 70000
        ) {
          FiftyToSeventyThousand += 1;
        }
        if ((item.proposedBudget || 0) > 70000) {
          proposalsMoreThanSeventyThousand += 1;
        }
      });

      //  total proposals count
      const totalProposals =
        underThirtyThousand +
        ThirtyToFiftyThousand +
        FiftyToSeventyThousand +
        proposalsMoreThanSeventyThousand;

      // helper for percentage calculation
      const getPercentage = (count: number) =>
        totalProposals > 0 ? Math.round((count / totalProposals) * 100) : 0;

      setCostDistributionStats([
        {
          id: 1,
          range: "$0-$5k",
          value: underThirtyThousand,
          percentage: getPercentage(underThirtyThousand),
          color: "bg-green-500",
        },
        {
          id: 2,
          range: "$5k-$10k",
          value: ThirtyToFiftyThousand,
          percentage: getPercentage(ThirtyToFiftyThousand),
          color: "bg-blue-500",
        },
        {
          id: 3,
          range: "$10k-$20k",
          value: FiftyToSeventyThousand,
          percentage: getPercentage(FiftyToSeventyThousand),
          color: "bg-yellow-500",
        },
        {
          id: 4,
          range: "$20k+",
          value: proposalsMoreThanSeventyThousand,
          percentage: getPercentage(proposalsMoreThanSeventyThousand),
          color: "bg-red-500",
        },
      ]);

      const budgets = proposalsData.proposals
        .map((item: any) => item.proposedBudget)
        .filter((budget: number) => typeof budget === "number" && budget > 0);

      const average =
        budgets.length > 0
          ? Math.round(
              budgets.reduce((sum: number, val: number) => sum + val, 0) /
                budgets.length,
            )
          : 0;

      const sortedBudgets = [...budgets].sort((a, b) => a - b);

      let median = 0;
      if (sortedBudgets.length > 0) {
        const mid = Math.floor(sortedBudgets.length / 2);

        median =
          sortedBudgets.length % 2 !== 0
            ? sortedBudgets[mid]
            : Math.round((sortedBudgets[mid - 1] + sortedBudgets[mid]) / 2);
      }
      const range =
        sortedBudgets.length > 0
          ? sortedBudgets[sortedBudgets.length - 1] - sortedBudgets[0]
          : 0;

      console.log("sorted budgets are ::", sortedBudgets);

      setCostAnalyticsStats({
        avg: average,
        median: median,
        range: `$ ${sortedBudgets[0] || 0} - $ ${sortedBudgets[sortedBudgets.length - 1] || 0}`,
      });

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

      console.log("Top vendors services are :::", tempVendorServices);

      // console.log("Cost Distribbution :::",proposalsLessThanFiveThousand,proposalsLessThanTenThousand,proposalsLessThanTwentyThousand,proposalsMoreThanTwentyThousand)

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

  useEffect(() => {
    if (!loading && (!user || user.role !== "client")) {
      router.push("/login");
    }
    if (user && !loading) {
      loadData();
    }
  }, [user, loading, router]);

  if (loading || responseLoading) {
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
        <h1 className="text-2xl font-bold my-custom-class leading-6 text-[#F4561C]">
          Project Analytics
        </h1>
        <p className="text-[#656565] font-medium text-lg my-custom-class">
          Insights into vendor demographics and proposal trends
        </p>
      </div>

      {/* Top Locations Analytics */}
      <Card className="border-1 border-[#CFCACA] rounded-3xl px-2 md:px-8 bg-[#fff]">
        <CardHeader>
          <CardTitle className="flex items-center gap-0">
            <MdLocationOn className="h-6 w-9" color="#F54A0C" />
            <span className="text-2xl font-bold my-custom-class text-[#F54A0C]">
              {" "}
              Top Vendor Locations
            </span>
          </CardTitle>
          <p className="text-[#656565] my-custom-class ml-3 -mt-2">
            Geographic distribution of vendors responding to your projects
          </p>
        </CardHeader>
        <CardContent className="md:px-8">
          <div className="space-y-4">
            {(() => {
              const totalVendorsCount = (topVendorsLocations || []).reduce(
                (sum, item) => sum + (item.count || 0),
                0,
              );

              return (topVendorsLocations || []).map((location, index) => {
                const percentage =
                  totalVendorsCount === 0
                    ? 0
                    : Math.round((location.count / totalVendorsCount) * 100);

                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#6B6B6B] my-custom-class">
                          {location.locationName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#6B6B6B] my-custom-class">
                          {location.count}
                        </span>
                        <span className="text-xs font-bold text-[#6B6B6B] my-custom-class">
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
              });
            })()}
          </div>
        </CardContent>
      </Card>

      {/* Top Specialties Analytics */}
      <Card className="border-1 border-[#CFCACA] rounded-3xl bg-[#fff] px-2 md:px-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-8 w-8" color="#F54A0C" />
            <span className="text-2xl font-bold my-custom-class text-[#F54A0C]">
              Top Vendor Specialties
            </span>
          </CardTitle>
          <p className="text-[#656565] my-custom-class ml-2 -mt-2">
            Expertise areas of vendors responding to your projects
          </p>
        </CardHeader>
        <div className="space-y-4 md:px-8">
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
      </Card>

      {/* Cost Distribution */}
      <Card className="border-1 border-[#CFCACA] rounded-3xl bg-[#fff] px-0">
        <CardHeader className="px-8">
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 flex items-center justify-center border-2 border-[#F4561C]  rounded-md">
              <DollarSign className="h-5 w-5" color="#F4561C" />
            </div>
            <span className="text-2xl font-bold my-custom-class text-[#F54A0C]">
              Cost Distribution Analysis
            </span>
          </CardTitle>
          <p className="text-[#656565] my-custom-class  -mt-2">
            Budget ranges of proposals received vs. your stated budget
          </p>
        </CardHeader>
        <CardContent className="px-0">
          <div className="space-y-6  px-0 ">
            {/* <div className="py-4  rounded-lg px-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg text-[#000] font-bold my-custom-class">
                  Your Stated Budget
                </span>
                <span className="text-lg font-bold text-[#000] my-custom-class">
                  $50,000
                </span>
              </div>
            </div> */}
            <hr className="border-[1px] border-[#E4E4E4] w-full" />
            <div className="space-y-4 px-8">
              <h4 className="text-xl font-bold text-[#000] my-custom-class">
                Proposal Budget Ranges
              </h4>
              {(costDistributionStats || []).map((item) => (
                <div key={item.range} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-xs text-[#6B6B6B] my-custom-class">
                      {item.range}
                    </span>
                    <span className="font-bold text-xs text-[#6B6B6B] my-custom-class">
                      {item.count} proposals ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-[#DAEDF8] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-sm text-[#6B6B6B] my-custom-class font-bold">
                  Average
                </p>
                <p className="text-lg text-[#000] font-bold">
                  ${costAnalyticsStats.avg}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[#6B6B6B] my-custom-class font-bold">
                  Median
                </p>
                <p className="text-lg text-[#000] font-bold">
                  ${costAnalyticsStats.median}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-[#6B6B6B] my-custom-class font-bold">
                  Range
                </p>
                <p className="text-lg font-bold text-[#000]">
                  {costAnalyticsStats.range}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default ClientAnalyticsPage;
