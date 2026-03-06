"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ServiceDropdown from "@/components/select-category-filter";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Search, Star, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";
import RatingStars from "@/components/rating-star";
import { FaLocationDot } from "react-icons/fa6";
import { FaArrowRightLong } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/auth-fetch";
export default function ProvidersPage() {
  const providers = [
    {
      id: "1",
      image: "/provider1.jpg",
      name: "TechCraft Solutions",
      tagline: "Full-stack development experts",
      services: ["Web Development", "Mobile Apps", "API Development"],
      rating: 2.5,
      reviews: 127,
      location: "San Francisco, CA",
      verified: true,
      featured: true,
      completedProjects: 89,
      responseTime: "2 hours",
      startingPrice: "75",
    },
    {
      id: "2",
      name: "Creative Design Studio",
      image: "/provider2.jpg",
      tagline: "Bringing your vision to life",
      services: ["UI/UX Design", "Branding", "Graphic Design"],
      rating: 4.2,
      reviews: 89,
      location: "New York, NY",
      verified: true,
      featured: false,
      completedProjects: 156,
      responseTime: "4 hours",
      startingPrice: "60",
    },
    {
      id: "3",
      name: "Growth Marketing Pro",
      image: "/provider3.jpg",
      tagline: "Data-driven marketing solutions",
      services: ["Digital Marketing", "SEO", "Content Strategy"],
      rating: 4.7,
      reviews: 156,
      location: "Austin, TX",
      verified: true,
      featured: true,
      completedProjects: 203,
      responseTime: "1 hour",
      startingPrice: "85",
    },
    {
      id: "4",
      image: "/provider4.jpg",
      name: "DataViz Analytics",
      tagline: "Transform data into insights",
      services: ["Data Analytics", "Business Intelligence", "Reporting"],
      rating: 4.9,
      reviews: 74,
      location: "Seattle, WA",
      verified: true,
      featured: false,
      completedProjects: 67,
      responseTime: "3 hours",
      startingPrice: "90",
    },
    {
      id: "5",
      image: "/provider1.jpg",
      name: "CloudOps Specialists",
      tagline: "Scalable cloud infrastructure",
      services: ["DevOps", "Cloud Migration", "System Architecture"],
      rating: 4.8,
      reviews: 92,
      location: "Denver, CO",
      verified: true,
      featured: false,
      completedProjects: 134,
      responseTime: "2 hours",
      startingPrice: "95",
    },
    {
      id: "6",
      image: "/provider3.jpg",
      name: "Mobile First Design",
      tagline: "Mobile-first approach to everything",
      services: ["Mobile App Design", "Responsive Design", "User Research"],
      rating: 4.6,
      reviews: 108,
      location: "Los Angeles, CA",
      verified: false,
      featured: false,
      completedProjects: 78,
      responseTime: "6 hours",
      startingPrice: "55",
    },
  ];

  const bannerData = {
    title: "Service Providers",
    description: "Find verified professionals for your next project",
    backgroundImageUrl: "/serviceProviderBanner.jpg",
  };
  const [searchFilter, setSearchFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [filteredData, setFilteredData] = useState([]);
  const [providersData, setProvidersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Failed, setFailed] = useState(false);
  const router = useRouter();
  const [uniqueLocations, setUniqueLocations] = useState([]);
  const ITEMS_PER_LOAD = 8;
  const [sortValue, setSortValue] = useState("rating");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);

  const clearFilters = () => {
  setSearchFilter("");
  setServiceFilter("");
  setLocationFilter("all");
  setSortValue("rating");

  // Reset data immediately
  const resetData = [...providersData];

  // Apply default sorting
  resetData.sort((a, b) => b.rating - a.rating);

  setFilteredData(resetData);
  setVisibleCount(ITEMS_PER_LOAD);
};



  const handleViewProfile = async (recivedId) => {
    try {
      // 1️⃣ Track profile view
      await authFetch(`/api/providers/${recivedId}/profile-view`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Profile view tracking failed", error);
    }

    // 2️⃣ Navigate to profile
    router.push(`/provider/${recivedId}`);
  };

  useEffect(() => {
  setVisibleCount(ITEMS_PER_LOAD);
}, [filteredData]);

  useEffect(() => {
    loadData();
  }, []);
  console.log("Providers Datat::::::::::", providersData);

  useEffect(() => {
  if (!providersData.length) return;

  let sorted = [...providersData];

  switch (sortValue) {
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating);
      break;

    case "reviews":
      sorted.sort((a, b) => b.reviews - a.reviews);
      break;

    case "price-low":
      sorted.sort(
        (a, b) => Number(a?.hourlyRate || 0) - Number(b?.hourlyRate || 0)
      );
      break;

    case "price-high":
      sorted.sort(
        (a, b) => Number(b?.hourlyRate || 0) - Number(a?.hourlyRate || 0)
      );
      break;
  }

  setFilteredData(sorted);
}, [providersData, sortValue]);



  const loadData = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const response = await fetch("/api/providers");
      const data = await response.json();
      console.log("Fetched  Data:::", data);
      setProvidersData(data.providers);

      // Apply default sorting (rating) immediately
      const sortedByRating = [...data.providers].sort(
        (a, b) => b.rating - a.rating
      );


      
      const uniqueLocations = [
        ...new Set(
          data.providers
            .map((p) => p.location?.trim())
            .filter(
              (loc) =>
                loc &&
                !/not\s*specified/i.test(loc) &&
                loc.toLowerCase() !== "all" &&
                loc.toLowerCase() !== "all locations"
            ),
        ),
      ];


      setUniqueLocations(uniqueLocations);
      console.log("Unique locations are::::", uniqueLocations);

      setFilteredData(data.providers);
      setFailed(false);
    } catch (error) {
      console.log("Failded To retrive the data:::", error);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }; 

  const searchHandle = () => {
    console.log("Search Filter:::", searchFilter);
    console.log("Service Filter::", serviceFilter);
    console.log("Location Filter:::", locationFilter);
    let tempFilteredData = providersData;
    if (searchFilter.trim() != "") {
      tempFilteredData = tempFilteredData.filter(
        (item) =>
          item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
          item.tagline?.toLowerCase().includes(searchFilter.toLowerCase()),
      );
    }
    if (serviceFilter && serviceFilter.toLowerCase() !== "all") {
        tempFilteredData = tempFilteredData.filter((eachItem) =>
          eachItem.services?.some((service) =>
            service.toLowerCase().includes(serviceFilter.toLowerCase())
          )
        );
      }
          if (locationFilter !== "all") {
        tempFilteredData = tempFilteredData.filter((eachItem) =>
          eachItem.location
            ?.toLowerCase()
            .includes(locationFilter.toLowerCase())
        );
          }
    setFilteredData(tempFilteredData);
     setVisibleCount(ITEMS_PER_LOAD);

  };
  

  return (
    <div className="bg-background">
      {/*Hero section */}
      <div
        className="px-4 sm:px-6 md:px-10 
        pt-24 sm:pt-16 pb-12 overflow-hidden
        min-h-screen sm:min-h-[85vh] items-center 
        justify-start sm:justify-center"
        style={{
          backgroundImage: `url(${bannerData.backgroundImageUrl})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-7xl mx-auto text-center ">
          {/* Header */}
          <div className="mb-8 px-2 sm:px-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F54A0C] pt-6 sm:pt-10 mb-0">
              {bannerData.title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-[#b2b2b2] leading-sung px-3 sm:px-0">
              {bannerData.description}
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8 text-center rounded-3xl shadow-md sm:shadow-lg">
            <CardContent className="pt-6 pb-6 px-4 sm:px-6 md:px-9">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                {/* Search Input */}
                <div className="relative w-full min-w-0">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search providers..."
                    value={searchFilter}
                    className="pl-10 w-full placeholder:text-gray-500 text:sm md:text-base border-0 border-b-2 border-b-[#b2b2b2] 
                    bg-transparent rounded-none shadow-none focus:outline-none focus:ring-0 focus:border-[#F54A0C]"
                    onChange={(e) => setSearchFilter(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") searchHandle();
                    }}
                />

                </div>
                <div className="w-full min-w-0">
                  <ServiceDropdown
                  value={serviceFilter}
                  onChange={(value) => setServiceFilter(value)}
                  triggerClassName="
                    mt-1
                    border-0
                    border-b-2
                    border-b-[#b2b2b2]
                    rounded-none
                    shadow-none
                    focus:outline-none
                    focus:ring-0
                    cursor-pointer
                    px-0
                    w-full
                    text-sm md:text-base
                    h-12
                    [&_span]:text-gray-500
                  "
                />
                </div>
                <div className="w-full min-w-0">
                  <Select 
                    value={locationFilter}
                  onValueChange={(value) => setLocationFilter(value)}>
                    <SelectTrigger
                      className="
                              mt-1
                              border-0 
                              border-b-2 
                              border-b-[#b2b2b2]
                              rounded-none
                              shadow-none
                              focus:outline-none
                              focus:ring-0 
                              cursor-pointer
                              focus:ring-offset-0
                              px-0 [&>span]:text-gray-500
                              w-full text-sm md:text-base h-12
                            "
                    >
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem 
                      className="cursor-pointer data-[highlighted]:bg-[#F54A0C] data-[highlighted]:text-white"
                      value="all">All Locations</SelectItem>
                      {(uniqueLocations || []).map((eachItem, index) => (
                        <SelectItem 
                        value={eachItem} 
                        key={index}
                        className="cursor-pointer data-[highlighted]:bg-[#F54A0C] data-[highlighted]:text-white"
                        >
                          {eachItem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-center lg:justify-end gap-2">
                  <Button
                    className="w-full sm:w-[150px] lg:w-[120px] h-10 mt-2 lg:mt-1
                    rounded-3xl bg-[#F54A0C] text-white
                    hover:bg-[#d93f0b]"
                    onClick={searchHandle}
                  >
                    Search Now
                  </Button>

                  <Button
                    variant="outline"
                    className="h-10 mt-2 lg:mt-1 bg-black text-white rounded-3xl"
                    onClick={clearFilters}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="py-2 px-4 lg:px-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center my-4">
              <div className="text-lg text-gray-600">
                Agencies Found:
                <span className="font-semibold text-gray-700 ml-2">
                  {filteredData.length}
                </span>
              </div>

            <Select
                value={sortValue}
                onValueChange={(value) => {
                  setSortValue(value);
                
                }}
              >
              <SelectTrigger
                className="
                bg-[#f5f5f5]
                h-12
                w-[180px]
                rounded-full
                shadow-none
                border border-[#e5e5e5]
                text-[#555]
                px-4
                cursor-pointer
                focus:outline-none
                focus:ring-0
                focus:ring-offset-0
                focus:border-[#e5e5e5]
              "
              >
                <SelectValue placeholder="Highest Rating" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem className="cursor-pointer data-[highlighted]:bg-[#F54A0C] data-[highlighted]:text-white" value="rating">
                  Highest Rating
                </SelectItem>

                <SelectItem className="cursor-pointer data-[highlighted]:bg-[#F54A0C] data-[highlighted]:text-white" value="reviews">
                  Most Reviews
                </SelectItem>

                <SelectItem className="cursor-pointer data-[highlighted]:bg-[#F54A0C] data-[highlighted]:text-white" value="price-low">
                  Price: Low to High
                </SelectItem>

                <SelectItem className="cursor-pointer data-[highlighted]:bg-[#F54A0C] data-[highlighted]:text-white" value="price-high">
                  Price: High to Low
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Providers Grid */}
          {Failed && (
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
          )}
          {loading && (
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredData.length != 0 && !loading && !Failed ? (
              // (filteredData.map((provider) => (
              filteredData.slice(0, visibleCount).map((provider) => (
                <Card
                  key={provider._id}
                  className="rounded-2xl py-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  {/* Image */}
                  <div className="w-full">
                    <img
                      src={
                        provider?.coverImage ||
                        "/uploads/15ac2d8f-31f9-48ac-aadd-b67ba9f4d860-Artificial-intelligence-platforms-copy.jpg"
                      }
                      alt={provider.name}
                      className="w-full h-[200px] sm:h-[240px] md:h-[300px] object-cover block"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-4 sm:p-6 flex flex-col flex-1 sm:pt-0">
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
                          {/* {provider.isFeatured && (
                            <Badge className="bg-[#F54A0C] text-white h-7 px-3 rounded-2xl">
                              Featured
                            </Badge>
                          )} */}
                        </div>

                        <div className="flex items-center gap-1 text-sm">
                          <RatingStars rating={provider.rating} />
                          <span className="font-semibold">
                            {provider.rating}
                          </span>
                          
                        </div>
                      </div>

                      {/* Title + description */}
                      <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="mt-2 text-xl sm:text-2xl font-semibold text-left">
                        {provider.name}
                      </h3>

                      <span className="text-muted-foreground">
                            Reviews: ({provider.reviewCount})
                          </span>
                          </div>
                      <p className="line-clamp-1 text-sm text-[#b2b2b2] text-left">
                        {provider.tagline}
                      </p>

                      {/* Tags */}
                      <div className="mt-2 mb-2">
                        {provider.services?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {provider.services.slice(0, 2).map((service) => (
                              <Badge
                                key={service}
                                variant="outline"
                                className="h-7 px-3 rounded-2xl bg-[#f2f2f2] text-[#000] text-xs sm:text-sm"
                              >
                                {service}
                              </Badge>
                            ))}

                            {provider.services.length > 2 && (
                              <Badge
                                variant="outline"
                                className="h-7 px-3 rounded-2xl bg-[#eaeaea] text-[#555] text-xs sm:text-sm"
                              >
                                +{provider.services.length - 2} more
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <div className="text-center mx-auto">
                            <p className="text-xl my-1 text-gray-400">
                              No Services
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 🔽 BOTTOM CONTENT (sticks to bottom) */}
                    <div className="mt-auto">
                      {/* Info row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2 text-xs sm:text-sm">
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
                         <span className="inline-flex items-center font-bold text-[#808080] gap-2">
                        <Users className="h-5 w-5 font-bold sm:h-5 sm:w-5 text-orangeButton" />
                        Team: {provider?.teamSize || "Not specified"}
                          </span>
                        </div>
                      </div>
                      <p className="text-[#808080] text-sm sm:text-base font-semibold mb-3">
                        Starting From: {provider?.hourlyRate || 0}$/hour
                      </p>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          className="w-full sm:w-[140px] cursor-pointer bg-[#2C34A1] hover:bg-[#2C34A1] rounded-3xl text-white"
                          onClick={() => handleViewProfile(provider.id)}
                        >
                          View Profile
                        </Button>

                        <Button
                          className="w-full sm:w-[160px] bg-[#4d4d4d] cursor-pointer rounded-3xl text-white"
                          onClick={() => {
                            window.location.href = `mailto:${provider.email}?subject=Service Inquiry&body=Hi ${provider.name},%0D%0A%0D%0AI am interested in your services.`;
                          }}
                        >
                          Contact Provider
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="mx-auto">
                <p className="text-lg">No Providers Matched</p>
              </div>
            )}
          </div>

          {/* Load More */}

          {visibleCount < filteredData.length && (
            <div className="flex justify-center mt-4">
              <Button
                className="
                      rounded-full
                      px-8
                      py-3
                      text-base
                      font-semibold
                      bg-orangeButton
                      text-white
                      hover:bg-gray-200
                      transition-all
                    "
                onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_LOAD)}
              >
                Load More Providers
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
