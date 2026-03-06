"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  MessageSquareMore,
  Building,
  Star,
  MapPin,
  Calendar,
  Award,
  MessageCircle,
  ExternalLink,
  Users,
  Clock,
  DollarSign,
  CheckCircle2,
  Globe,
  Mail,
  Phone,
  Briefcase,
  CircleUser,
  Share2,
} from "lucide-react";
import { FaCircleUser } from "react-icons/fa6";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockProviders } from "@/lib/mock-data";
import RatingStars from "@/components/rating-star";
import { useEffect, useState } from "react";
import { authFetch } from "@/lib/auth-fetch";

export default function ProviderProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // Find provider by ID
  const provider = mockProviders.find((p) => p.id === id);
  const [serviceFilter, setServiceFilter] = useState("");
  const [sortByFilter, setSortByFilter] = useState("");
  const [providerDetails, setProviderDetails] = useState({});
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  
  useEffect(() => {
    loadData();
  }, []);
  const loadData = async () => {
    setLoading(true);
    setFailed(false);
    try {
      const response = await fetch(`/api/providers/${id}`);
      const data = await response.json();
      const reviewsResponse = await fetch(
        `/api/reviews/${data.provider.userId}`,
      );
      const reviewsdata = await reviewsResponse.json();
      console.log("Fetched Reviews are the::::", reviewsdata);
      setProviderDetails(data.provider);
      setReviews(reviewsdata.reviews);
      setFailed(false);
    } catch (error) {
      console.log("Failed to get the data error:::", error);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  };
  const mockReviews = [
    {
      id: 1,
      project: {
        title: "The Project",
        type: "UX/UI Design Web Design Web Development",
        timeline: "July 2024 - Oct. 2025",
        budget: "$50,000 to $199,999",
        summary:
          "Goji Labs has been hired by an investment firm to build their website. The team has been tasked with creating solutions for the client’s unique requests.",
      },
      review: {
        quote:
          "They are fantastic in almost every aspect and my experience so far has been great.",
        date: "May 31, 2025",
        summary:
          "Goji Labs has successfully built the website and helped the client solve real-world problems through digital means. The team has been transparent and communicative throughout the collaboration. Overall, their strategic planning and problem-solving skills have pleased the client.",
      },
      rating: {
        overall: 4.5,
        totalReviews: 357,
        quality: 5.0,
        cost: 4.5,
        schedule: 4.2,
        refer: 5.0,
      },
      reviewer: {
        name: "Sudheer uppuluri",
        role: "Founder, Investment Firm",
        industry: "Advertising & marketing",
        location: "New Delhi",
        employees: "1-10 Employees",
        reviewType: "Online Review",
        verified: true,
      },
    },
    {
      id: 2,
      project: {
        title: "The Project",
        type: "UX/UI Design Web Design Web Development",
        timeline: "July 2024 - Oct. 2025",
        budget: "$50,000 to $199,999",
        summary:
          "Goji Labs has been hired by an investment firm to build their website. The team has been tasked with creating solutions for the client’s unique requests.",
      },
      review: {
        quote:
          "They are fantastic in almost every aspect and my experience so far has been great.",
        date: "May 31, 2025",
        summary:
          "Goji Labs has successfully built the website and helped the client solve real-world problems through digital means. The team has been transparent and communicative throughout the collaboration. Overall, their strategic planning and problem-solving skills have pleased the client.",
      },
      rating: {
        overall: 4.5,
        totalReviews: 357,
        quality: 5.0,
        cost: 4.5,
        schedule: 4.2,
        refer: 5.0,
      },
      reviewer: {
        name: "Sudheer uppuluri",
        role: "Founder, Investment Firm",
        industry: "Advertising & marketing",
        location: "New Delhi",
        employees: "1-10 Employees",
        reviewType: "Online Review",
        verified: true,
      },
    },
  ];

  console.log("Providers Details are :::", providerDetails);

  if (!providerDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Provider Not Found</h1>
          <p className="text-muted-foreground">
            The provider you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
  };

  const stats = [
    { label: "Year founded", value: providerDetails.foundedYear || "N/A" },
    { label: "Team Size", value: providerDetails.teamSize || 0 },
    { label: "Projects", value: providerDetails.projectsCompleted || 0 },
    { label: "Min Project Size", value: providerDetails.minProjectSize || 0 },
    { label: "Hourly rate", value: `${providerDetails.hourlyRate}$/hr` || 0 },
  ];

  useEffect(() => {
    let tempFilteredReviews = [...reviews];

    // 🔹 Service filter
    if (serviceFilter && serviceFilter !== "all") {
      tempFilteredReviews = tempFilteredReviews.filter((eachItem) =>
        eachItem.project.category
          .toLowerCase()
          .includes(serviceFilter.toLowerCase()),
      );
    }

    // 🔹 Rating sort
    if (sortByFilter) {
      if (sortByFilter === "low-to-high") {
        tempFilteredReviews.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
      }

      if (sortByFilter === "high-to-low") {
        tempFilteredReviews.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      }
    }

    setFilteredReviews(tempFilteredReviews);
  }, [serviceFilter, sortByFilter, reviews]);

  const webisteClickHandle = async (e, id) => {
    e.preventDefault();
    console.log(providerDetails.websiteClicks + 1);

    try {
      await authFetch(`/api/providers/${id}/website-clicks`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Failed to update click count", err);
    }

    window.open(providerDetails.website, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (failed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-lg mb-2 font-medium">Failed to get the data</h1>
        <Button
          className="h-[30px] w-[80px] bg-[#2C34A1] hover:bg-[#2C34A1] active:bg-[#2C34A1]"
          onClick={loadData}
        >
          Reload
        </Button>
      </div>
    );
  }

  // Group reviews by service & calculate avg rating
const serviceRatings = {};

reviews.forEach((review) => {
  const service = review.project?.category || "Other";
  if (!serviceRatings[service]) {
    serviceRatings[service] = {
      total: 0,
      count: 0,
    };
  }

  serviceRatings[service].total += review.rating || 0;
  serviceRatings[service].count += 1;
});

// Convert to array with avg rating
const topServices = Object.keys(serviceRatings)
  .map((service) => ({
    name: service,
    value:
      serviceRatings[service].total /
      serviceRatings[service].count,
  }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 5);


  return (
    <div className="min-h-screen mt-0 bg-[#fff]">
      {/* Hero Section */}
      <div
        className="text-white py-10 pb-10"
        style={{
          backgroundImage: `url(/ProviderDetailBanner.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          height: "350px",
        }}
      >
        <div className="max-w-7xl mx-auto px-8 py-12 lg:px-30">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div>
              <img
                src={providerDetails.logo || "/provider4.jpg"}
                className="h-45 w-48  rounded-2xl"
              />
            </div>
            <div className="flex-1">
              <div className="mb-0">
                {providerDetails.isVerified && (
                  <Badge className="bg-[#2C34A1] backdrop-blur-sm rounded-2xl mr-3">
                    <CheckCircle2 className="h-3 w-3 mr-0.2" />
                    Verified
                  </Badge>
                )}
                {/* {providerDetails.isFeatured && (
                  <Badge className="bg-[#e84816]  backdrop-blur-sm rounded-2xl">
                    <Star className="h-3 w-3 mr-1 fill-white" />
                    Featured
                  </Badge>
                )} */}
                <h1 className="text-4xl font-extrabold mt-1 tracking-widest">
                  {providerDetails.name.toUpperCase()}
                </h1>
              </div>
              <p className="text-lg text-white/90 mb-2">
                {providerDetails.tagline || "Professional service provider"}
              </p>
              <div className="grid grid-cols-3 gap-1 mb-3 text-sm">
                <div className="flex items-center gap-2">
                  <img
                    src="/ProviderDetailPageBannerIconLoactionFilled.png"
                    className="h-5 w-4"
                  />

                  <span className="text-[#fff] font-semibold text-sm">
                    {providerDetails.location}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="/ProviderDetailPageBannerIconBriefCase.png"
                    className="h-5 w-5"
                  />
                  <span className="text-[#fff] font-semibold text-sm">
                    {providerDetails.projectsCompleted} projects
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="/ProviderDetailPageBannerIconChatOperational.png"
                    className="h-5 w-5"
                  />
                  <span className="text-[#fff] font-semibold text-sm">
                    Response: {providerDetails?.responseTime || "2 hrs"}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <RatingStars rating={providerDetails.rating} />
                  <span className="font-semibold text-lg">
                    {providerDetails.rating}
                  </span>
                  <span className="text-white/80">
                    ({providerDetails.reviewCount} reviews)
                  </span>
                </div>

                {/* <Badge className="bg-[#fff] text-[#000] rounded-2xl backdrop-blur-sm border-white/30 capitalize">
                  {providerDetails.subscriptionPlanId || "Basic"} Plan
                </Badge> */}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <a href={`mailto:${providerDetails.email}`}>
                <Button
                  size="lg"
                  className="bg-white text-[#2C34A1] hover:bg-white/90 text-sm font-semibold  active:bg-white  rounded-3xl"
                >
                  <img
                    src="/providerDetailPageBannerButton.jpg"
                    className="h-4 w-4 mr-0.5"
                  />
                  Contact Provider
                </Button>
              </a>
              {providerDetails.website && (
                <a href={`${providerDetails.website}`} target="_blank">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white rounded-3xl w-48 mt-2 font-semibold text-white hover:bg-white/10 bg-transparent  active:bg-transparent"
                    onClick={(e) => webisteClickHandle(e, id)}
                  >
                    <ExternalLink className="mr-0.5" height={16} width={16} />
                    View Website
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6 space-x-6">
            {/* About Section */}
            <div className="pt-0">
              <h1 className="text-2xl font-bold">Over View</h1>
              <p className="text-sm text-[#b2b2b2] mt-0.5">
                {providerDetails.description}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-2">
                {stats.map((item, index) => (
                  <div
                    key={index}
                    className="
                      border border-gray-300 
                      rounded-2xl 
                      px-2 py-1 
                      flex flex-col 
                      items-center
                      bg-white
                    "
                  >
                    <span className="text-sm text-[#000] font-medium">
                      {item.label}
                    </span>
                    <span className="text-xs text-[#b2b2b2] font-normal mt-0">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Section */}

            <h1 className="text-2xl font-bold mb-1 pt-0">Services Offered</h1>

            <div>
              {providerDetails.services.length != 0 ? (
                <div className="flex flex-row flex-wrap gap-3">
                  {providerDetails.services.map((service, index) => (
                    <div
                      key={index}
                      className="p-3 text-center rounded-xl bg-[#d9e4f6]"
                    >
                      <span className="font-medium text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-500 text-xl my-10">
                    No Services Offered
                  </p>
                </div>
              )}
            </div>

            {/* Portfolio Section */}

            <h1 className="text-2xl font-bold">Portfolio & Awards</h1>

            <div className="grid sm:grid-cols-2 gap-6">
              {providerDetails?.portfolio?.length > 0 ? (
                providerDetails.portfolio.map((item) => (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-video overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                      <img
                        src={
                          item.image ||
                          `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(item.title)}`
                        }
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    <div className="p-4">
                      <Badge
                        variant="outline"
                        className="mb-2 bg-[#ebecee] rounded-2xl text-[12px] text-[#000]"
                      >
                        {item.category}
                      </Badge>

                      <h4 className="font-semibold text-md mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm text-[#b2b2b2] line-clamp-2 mb-3">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.technologies.slice(0, 3).map((tech, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs bg-[#d9e4f6] text-[#000] rounded-2xl"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-lg font-semibold text-gray-600">
                    No Portfolio & Awards
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    This provider hasn’t added any portfolio items yet.
                  </p>
                </div>
              )}
            </div>

            {/* Client Testimonials */}
            {/* <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Client Testimonials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="p-6 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{testimonial.client}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.company}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground italic mb-2">"{testimonial.comment}"</p>
                    <p className="text-xs text-muted-foreground">{testimonial.date}</p>
                  </div>
                ))}
              </CardContent>
            </Card> */}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 sticky">
            {/* Company Stats */}
            {/* <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Company Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Founded</span>
                  </div>
                  <span className="font-semibold">{companyStats.founded}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span className="text-sm">Team Size</span>
                  </div>
                  <span className="font-semibold">{companyStats.teamSize}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span className="text-sm">Projects</span>
                  </div>
                  <span className="font-semibold">{companyStats.projectsCompleted}+</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Star className="h-4 w-4" />
                    <span className="text-sm">Rating</span>
                  </div>
                  <span className="font-semibold">{companyStats.clientRating}/5.0</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Response Time</span>
                  </div>
                  <span className="font-semibold">{companyStats.responseTime}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm">Success Rate</span>
                  </div>
                  <span className="font-semibold text-green-600">{companyStats.successRate}</span>
                </div>
              </CardContent>
            </Card> */}

           


            {/* Contact Info */}
            {/* <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {provider.salesEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 shrink-0" />
                    <a href={`mailto:${provider.salesEmail}`} className="text-sm hover:underline break-all">
                      {provider.salesEmail}
                    </a>
                  </div>
                )}
                {provider.adminContactPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 shrink-0" />
                    <a href={`tel:${provider.adminContactPhone}`} className="text-sm hover:underline">
                      {provider.adminContactPhone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="text-sm">{provider.location}</span>
                </div>
                {provider.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 shrink-0" />
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline break-all"
                    >
                      {provider.website}
                    </a>
                  </div>
                )}
                <Button className="w-full mt-4 bg-white text-blue-600 hover:bg-white/90">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card> */}

            {/* Pricing */}
            {/* {providerDetails.hourlyRate && (
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="flex items-baseline justify-center gap-2 mb-2">
                      <DollarSign className="h-6 w-6 text-muted-foreground" />
                      <span className="text-4xl font-bold text-blue-600">{providerDetails.hourlyRate}</span>
                      <span className="text-muted-foreground">/hour</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Starting rate</p>
                  </div>
                </CardContent>
              </Card>
            )} */}
          </div>
        </div>

        {/*Filter s header */}
        <div className="flex flex-col lg:flex-row justify-between my-8">
          <h1 className="text-3xl text-[#000] mb-4 lg:mb-0">
            Creative Design Studios Reviews
          </h1>
          <div className="flex gap-2 items-center mb-4 lg:mb-0">
            <span className="text-md font-semibold">Services:</span>
            <Select
              onValueChange={(value) => setServiceFilter(value)}
              value={serviceFilter}
            >
              <SelectTrigger
                className="
                bg-[#f5f5f5]
                h-14
                w-[160px]
                rounded-full
                shadow-none
                border border-[#e5e5e5]
                cursor-pointer
                text-[#555]
                px-4
                focus:outline-none
                focus:ring-0
                focus:ring-offset-0
                focus:border-[#e5e5e5]
              "
              >
                <SelectValue placeholder="Select Services" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-md font-semibold">Sortby:</span>
            <Select
              onValueChange={(value) => setSortByFilter(value)}
              value={sortByFilter}
            >
              <SelectTrigger
                className="
                bg-[#f5f5f5]
                h-14
                w-[160px]
                cursor-pointer
                rounded-full
                shadow-none
                border border-[#e5e5e5]
                text-[#555]
                px-4
                focus:outline-none
                focus:ring-0
                focus:ring-offset-0
                focus:border-[#e5e5e5]
              "
              >
                <SelectValue placeholder="Rating" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="low-to-high">Low to high</SelectItem>
                <SelectItem value="high-to-low">High to low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/*Reviews contenet */}
        {filteredReviews.length !== 0 ? (
          <div>
            {filteredReviews.map((review) => (
              <div className="border border-gray-300 rounded-3xl  bg-white max-w-6xl mx-auto mb-5">
                <div className="w-full rounded-3xl border border-[#e6e6e6] bg-white p-8">
                  {/* TOP SECTION */}
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* LEFT — REVIEW CONTENT */}
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-black">
                        The Review
                      </h2>

                      <p className="text-sm text-[#b2b2b2] mt-0">
                        {formatDate(review.createdAt)}
                      </p>

                      <h4 className="text-md font-semibold mt-2">
                        Feed back summary
                      </h4>

                      <p className="text-sm text-[#9c9c9c] leading-relaxed mt-0">
                        {review.content}
                      </p>
                    </div>

                    {/* RIGHT — RATING */}
                    <div className="flex flex-col items-end min-w-[120px]">
                      <span className="text-5xl font-bold text-[#898383]">
                        {review.rating || 0}
                      </span>

                      <RatingStars rating={review.rating || 0} />

                      <p className="text-sm mt-1">
                        <span className="font-semibold text-black">
                          {review.rating || 0}
                        </span>{" "}
                        <span className="text-[#898383]">
                          {`(${reviews.length})`}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* BOTTOM SECTION */}
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* LEFT — REVIEWER */}
                    <div>
                      <h3 className="text-md font-bold mt-4">The Reviewer</h3>

                      <p className="text-sm text-[#b2b2b2] mt-0">
                        {review.client.position}
                      </p>

                      <div className="flex items-center gap-2 mt-0 text-[#bdbdbd]">
                        <FaCircleUser className="h-5 w-5" />
                        <span className="text-sm font-medium">
                          {review.client.name}
                        </span>
                      </div>
                    </div>

                    {/* RIGHT — META INFO */}
                    <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#9c9c9c]">
                      {/* <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {review.reviewer.industry}
                      </div>

                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {review.reviewer.location}
                      </div>

                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {review.reviewer.employees}
                      </div>

                      <div className="flex items-center gap-1">
                        <MessageSquareMore className="h-4 w-4" />
                        {review.reviewer.reviewType}
                      </div>

                      {review.reviewer.verified && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          Verified
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-20">
            <p className="text-xl">No Reviews for this provider</p>
          </div>
        )}
      </div>
    </div>
  );
}
