"use client";

import { Search } from "lucide-react";
import { Filter } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { ProposalsHeader } from "@/components/requirements/ProposalsHeader";
import { ProposalCard } from "@/components/requirements/ProposalCard";
import { useEffect, useState } from "react";
import { Requirement } from "@/lib/types";
import { useRouter } from "next/navigation";
import ServiceDropdown from "@/components/select-category-filter";

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

const bannerData = {
  title: "Service Providers",
  description: "Find verified professionals for your next project",
  backgroundImageUrl: "/serviceProviderBanner.jpg",
};

export default function BrowsePage() {
  const [visibleCount, setVisibleCount] = useState(8);
  const searchParams = useSearchParams();
  const [requriments, setRequriments] = useState<Requirement[]>([]);
  const [filteredRequirements, setFilteredRequirements] = useState<
    Requirement[]
  >([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [resLoading, setResLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const router = useRouter();

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequirement, setSelectedRequirement] =
    useState<Requirement | null>(null);
    const handleClearFilters = () => {
  setSearchFilter("");
  setServiceType("");
  setBudgetRange("");
  setFilteredRequirements(requriments);
};



    useEffect(() => {
  setVisibleCount(8);
}, [filteredRequirements]);

  useEffect(() => {
    const fetchRequirements = async () => {
      setResLoading(true);
      setFailed(false);
      try {
        const res = await fetch("/api/requirements");
        console.log("Res from api", res);
        const data = await res.json();
        console.log("data from api", data.requirements);
        if (res.ok) {
          const mapped = data.requirements.filter(
            (eachItem) =>
              eachItem.status.toLowerCase() != "closed" &&
              eachItem.status.toLowerCase() != "allocated" &&
              eachItem.status.toLowerCase() != "underreview" &&
              eachItem.status.toLowerCase() !="notapproved"
          );
          setRequriments(mapped);

            const queryFromUrl = searchParams.get("q");

            if (queryFromUrl) {
              setSearchFilter(queryFromUrl);

              const autoFiltered = mapped.filter((item) =>
              item.category?.toLowerCase().includes(queryFromUrl.toLowerCase())
            );
              setFilteredRequirements(autoFiltered);
            } else {
              setFilteredRequirements(mapped);
            }

          setFailed(false);
          setResLoading(false);
        }
      } catch (e) {
        console.log("failed to fetch the data", e);
        setFailed(true);
      } finally {
        setResLoading(false);
      }
    };
    fetchRequirements();
  }, []);
  // const proposals = requriments || []

  const handleApllyFilter = () => {
    let filteredRequirementsTemp = [...requriments];
    if (searchFilter.trim()) {
  const query = searchFilter.trim().toLowerCase();

  filteredRequirementsTemp = filteredRequirementsTemp.filter((eachItem) =>
    eachItem.category?.toLowerCase().includes(query)
  );
}

    if (serviceType && serviceType !== "all") {
      filteredRequirementsTemp = filteredRequirementsTemp.filter((eachItem) =>
        eachItem.category.toLowerCase().includes(serviceType.toLowerCase()),
      );
    }
    if (budgetRange) {
      if (budgetRange === "0k-5k") {
        filteredRequirementsTemp = filteredRequirementsTemp.filter(
          (item) => item.budgetMax <= 5000,
        );
      } else if (budgetRange === "5k-10k") {
        filteredRequirementsTemp = filteredRequirementsTemp.filter(
          (item) => item.budgetMin >= 5000 && item.budgetMax <= 10000,
        );
      } else if (budgetRange === "10k-20k") {
        filteredRequirementsTemp = filteredRequirementsTemp.filter(
          (item) => item.budgetMin >= 10000 && item.budgetMax <= 20000,
        );
      } else if (budgetRange === "20k+") {
        filteredRequirementsTemp = filteredRequirementsTemp.filter(
          (item) => item.budgetMin > 20000,
        );
      }
    }

    setFilteredRequirements(filteredRequirementsTemp);
  };
  const handlePriceSorting = (recievedFilter: string) => {
    let filteredRequirementsTemp = [...filteredRequirements];
    console.log(recievedFilter);
    if (recievedFilter === "price_asc") {
      filteredRequirementsTemp.sort((a, b) => a.budgetMin - b.budgetMin);
    } else if (recievedFilter === "price_desc") {
      filteredRequirementsTemp.sort((a, b) => b.budgetMin - a.budgetMin);
    }

    setFilteredRequirements(filteredRequirementsTemp);
  };

  const handleViewDetails = (recievedId) => {
    // setSelectedRequirementId(recievedId);
    // setShowDetailsModal(true);
    const requirement = requriments.find((r) => r._id === recievedId);
    setSelectedRequirement(requirement || null);
    setShowDetailsModal(true);
  };
  console.log("Filtered Requirements::::", filteredRequirements);
  return (
    <div className="bg-background">
      {/*  HERO SECTION  */}
      <section
        className="relative w-full overflow-hidden"
        style={{
          backgroundImage: `url(${bannerData.backgroundImageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-white/35" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-16 sm:py-20">
          {/* TITLE */}
          <div className="text-center mb-10">
            <h1 className="text-[26px] sm:text-[32px] md:text-[40px] font-bold text-[#F54A0C]">
              Browse Requirements
            </h1>
            <p className="mt-[-10] text-sm sm:text-base text-[#9b9b9b] leading-tight">
              Discover opportunities from businesses looking for your services
            </p>
          </div>

          {/* FILTER BAR */}
          <div className="flex justify-center">
            <div
              className="w-full max-w-5xl bg-white rounded-[28px]
                   shadow-[0_20px_40px_rgba(0,0,0,0.08)]
                   px-6 py-5 border"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_auto] gap-6 items-center">
                {/* Search */}
                <div className="flex items-center gap-2 border-b border-[#dcdcdc] pb-2">
                  <Input
                    placeholder="Search Requirement"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleApllyFilter();
                      }
                    }}
                    className="border-0 p-0 h-auto text-[15px] placeholder:text-[#9b9b9b]
                focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                {/* Category */}
                {/* <Select
                  onValueChange={(value) => setServiceType(value)}
                  value={serviceType}
                >
                  <SelectTrigger
                    className="
                border-0 border-b border-[#dcdcdc] rounded-none px-0 pb-2
                text-[15px] font-normal
                focus-visible:ring-0 focus-visible:ring-offset-0
                cursor-pointer

                [&_span]:text-[#9b9b9b]
                [&_span]:text-[15px]
                [&_span]:font-normal
            "
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="web">Web Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select> */}

                <ServiceDropdown
                 value={serviceType}
                    onChange={(value) => setServiceType(value)}
                    triggerClassName="
                border-0 border-b border-[#dcdcdc] rounded-none px-0 pb-2
                text-[15px] font-normal
                focus-visible:ring-0 focus-visible:ring-offset-0
                cursor-pointer

                [&_span]:text-[#9b9b9b]
                [&_span]:text-[15px]
                [&_span]:font-normal
            "
                  />

                {/* Budget */}
                <Select
                  onValueChange={(value) => setBudgetRange(value)}
                  value={budgetRange}
                >
                  <SelectTrigger
                    className="
                border-0 border-b border-[#dcdcdc] rounded-none px-0 pb-2
                text-[15px] font-normal
                focus-visible:ring-0 focus-visible:ring-offset-0
                cursor-pointer

                [&_span]:text-[#9b9b9b]
                [&_span]:text-[15px]
                [&_span]:font-normal
            "
                  >
                    <SelectValue placeholder="Budget Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem 
                    className="cursor-pointer data-[highlighted]:bg-[#F54A0C] data-[highlighted]:text-white"
                    value="0k-5k">Under $5k</SelectItem>
                    <SelectItem 
                    className="cursor-pointer data-[highlighted]:bg-[#F54A0C] data-[highlighted]:text-white"
                    value="5k-10k">$5k – $10k</SelectItem>
                    <SelectItem 
                    className="cursor-pointer data-[highlighted]:bg-[#F54A0C] data-[highlighted]:text-white"
                    value="10k-20k">$10k – $20k</SelectItem>
                    <SelectItem 
                    className="cursor-pointer data-[highlighted]:bg-[#F54A0C] data-[highlighted]:text-white"
                    value="20k+">More than $20k</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                <Button
                  className="h-10 px-6 rounded-full bg-[#F54A0C] hover:bg-[#d93f0b]
                  text-white text-[14px] font-medium whitespace-nowrap"
                  onClick={handleApllyFilter}
                >
                  <Filter className="h-4 w-4" />
                  Apply
                </Button>

                <Button
                  variant="outline"
                  className="h-10 px-6 rounded-full text-[14px] hover:bg-black bg-gray-800 text-white whitespace-nowrap"
                  onClick={handleClearFilters}
                >
                  Clear
                </Button>
              </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {!resLoading && !failed && (
        <div className="px-4 py-10">
          <div className="max-w-6xl mx-auto">
            <ProposalsHeader
              title={`Requirements Found: ${filteredRequirements.length}`}
              onSortChange={(value) => handlePriceSorting(value)}
            />
            {/* Cards */}
            <div
                className={`grid gap-6 items-stretch ${
                  filteredRequirements.length === 1
                    ? "grid-cols-1"
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
              {(filteredRequirements || []).length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  No requirements found.
                </div>
              ) : (
                filteredRequirements?.slice(0, visibleCount).map((item) => (
                  <ProposalCard
                    key={item.id}
                    category={item.category}
                    title={item.category}
                    description={item.description}
                    budget={`${item.budgetMin} - ${item.budgetMax}`}
                    timeline={item.timeline}
                    location={item.client?.location || "Remote"}
                    postedAgo={item.createdAt}
                    onView={() => handleViewDetails(item._id)}
                    onSubmit={() =>
                      router.push(`/login?to=requirement-details&id=${item._id}`)
                    }
                  />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {visibleCount < filteredRequirements.length && (
        <div className="flex justify-center mt-2 mb-2">
          <Button
            onClick={() => setVisibleCount((prev) => prev + 8)}
            className="rounded-full px-6 bg-[#F54A0C] hover:bg-[#d93f0b] text-white"
          >
            Load More
          </Button>
        </div>
      )}


      {resLoading && (
        <div className=" mt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

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
