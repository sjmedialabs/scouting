"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/auth-fetch";

const CompetitorComparisonPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
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
      total: 55,
    },
    conversionFunnel: {
      views: 1247,
      contacts: 89,
      proposals: 25,
      won: 10,
    },
    reviewsAdded: 3,
    ratingsDistribution: {
      5: 57,
      4: 102,
      3: 86,
      2: 32,
      1: 27,
    },
  };

  const totalRatings = Object.values(monthlyReport.ratingsDistribution).reduce(
    (a, b) => a + b,
    0,
  );

  const [resLoading, setResLoading] = useState<boolean>(true);
  const [failed, setFailed] = useState<boolean>(false);

  const [providerData, setProviderData] = useState<any>({});
  const [searchesData, setSearchesData] = useState<any[]>([]);

  const [profilePerformceStats, setProfilePerformanceStats] = useState({
    totalProfileViews: 0,
    currentMonthProfileViews: 0,
    lastMonthProfileViews: 0,
    viewRateIncreasePercentage: 0,
  });
  const [categoryRankingTrend, setCategoryRankingTrend] = useState<any[]>([]);
  const [leadsGeneratedStats, setLeadsGeneratedStats] = useState({
    inquiries: 0,
    proposals: 0,
    leads: 0,
  });
  const [conversionFunnelStats, setConversionFunnelStats] = useState({
    views: 0,
    viewsPercenntage: 0,
    contacts: 0,
    contactsPercentage: 0,
    proposals: 0,
    proposalsPercentage: 0,
    won: 0,
    wonPercentage: 0,
  });

  const [reviewStats, setReviewStats] = useState({
    fiveStarCount: 0,
    fiveStarPercentage: 0,
    fourStarCount: 0,
    fourStarPercentage: 0,
    threeStarCount: 0,
    threeStarPercentage: 0,
    twoStarCount: 0,
    twoStarPercentage: 0,
    oneStarCount: 0,
    oneStarPercentage: 0,
    currentReviewCount: 0,
  });

  const normalize = (text: string) => text.toLowerCase().replace(/\s+/g, "");

  const loadData = async () => {
    setResLoading(true);
    setFailed(false);
    try {
      const [
        providerRes,
        searchesRes,
        proposalRes,
        requirementRes,
        reviewsRes,
      ] = await Promise.all([
        fetch(`/api/providers/${user?.id}`),
        authFetch("/api/search/track"),
        authFetch("/api/proposals"),
        authFetch("/api/requirements"),
        authFetch("/api/reviews"),
      ]);
      if (
        !providerRes.ok ||
        !searchesRes.ok ||
        !proposalRes.ok ||
        !requirementRes.ok ||
        !reviewsRes.ok
      ) {
        throw new Error("Failed to fetch data");
      }
      const [
        providerData,
        searchesData,
        proposalsData,
        requirementsData,
        reviewData,
      ] = await Promise.all([
        providerRes.json(),
        searchesRes.json(),
        proposalRes.json(),
        requirementRes.json(),
        reviewsRes.json(),
      ]);
      setProviderData(providerData.provider);
      setSearchesData(searchesData.trending);

      // profile performance stats
      let viewRate =
        providerData.provider?.lastMonthProfileViews !== 0
          ? Math.round(
              ((providerData.provider.currentMonthProfileViews -
                providerData.provider?.lastMonthProfileViews) /
                providerData.provider?.lastMonthProfileViews) *
                100,
            )
          : 0;

      setProfilePerformanceStats({
        totalProfileViews: providerData.provider.profileViews,
        currentMonthProfileViews:
          providerData.provider.currentMonthProfileViews,
        lastMonthProfileViews: providerData.provider.lastMonthProfileViews,
        viewRateIncreasePercentage: viewRate,
      });

      // setCategoryRankingTrend()

      const serviceRankMap = new Map<string, number>();

      searchesData.trending.forEach((item, index) => {
        const normalizedKeyword = normalize(item.keyword);

        providerData.provider.services.forEach((service: string) => {
          const normalizedService = normalize(service);

          if (
            normalizedKeyword.includes(normalizedService) ||
            normalizedService.includes(normalizedKeyword)
          ) {
            if (!serviceRankMap.has(service)) {
              serviceRankMap.set(service, index + 1);
            }
          }
        });
      });

      const trendingtemp = Array.from(serviceRankMap.entries()).map(
        ([service, rank]) => ({
          service,
          rank,
        }),
      );

      console.log("Trending Temp:", trendingtemp);
      setCategoryRankingTrend(trendingtemp);

      // leads generated stats
      setLeadsGeneratedStats({
        inquiries: requirementsData.requirements.length,
        proposals: proposalsData.proposals.length,
        leads: proposalsData.proposals.filter(
          (proposal: any) =>
            proposal.status.toLowerCase() === "accepted" ||
            proposal.status.toLowerCase() === "completed",
        ).length,
      });

      // conversion funnel stats

      let totalProposals = proposalsData.proposals.length;
      let views = proposalsData.proposals.filter(
        (proposal: any) => proposal.clientViewed,
      ).length;
      let contacts = proposalsData.proposals.filter(
        (proposal: any) => proposal.status.toLowerCase() !== "pending",
      ).length;
      let won = proposalsData.proposals.filter(
        (proposal: any) =>
          proposal.status.toLowerCase() === "accepted" ||
          proposal.status.toLowerCase() === "completed",
      ).length;

      console.log("Total Proposals:", totalProposals);
      console.log("Views:", views);
      console.log("Contacts:", contacts);
      console.log("Won:", won);
      setConversionFunnelStats({
        views: views,
        viewsPercenntage:
          totalProposals !== 0
            ? (((views / totalProposals) * 100).toFixed(1) as unknown as number)
            : 0,
        contacts: contacts,
        contactsPercentage:
          totalProposals !== 0
            ? (((contacts / totalProposals) * 100).toFixed(
                1,
              ) as unknown as number)
            : 0,
        proposals: totalProposals,
        proposalsPercentage:
          totalProposals !== 0
            ? (((totalProposals / totalProposals) * 100).toFixed(
                1,
              ) as unknown as number)
            : 0,
        won: won,
        wonPercentage:
          totalProposals !== 0
            ? (((won / totalProposals) * 100).toFixed(1) as unknown as number)
            : 0,
      });

      // review stats
      let totalReviews = reviewData.reviews.length;
      let fiveStarCount = reviewData.reviews.filter(
        (review: any) => review.rating >= 4.1,
      ).length;
      let fourStarCount = reviewData.reviews.filter(
        (review: any) => review.rating >= 3.1 && review.rating <= 4.0,
      ).length;
      let threeStarCount = reviewData.reviews.filter(
        (review: any) => review.rating >= 2.1 && review.rating <= 3.0,
      ).length;
      let twoStarCount = reviewData.reviews.filter(
        (review: any) => review.rating >= 1.1 && review.rating <= 2.0,
      ).length;
      let oneStarCount = reviewData.reviews.filter(
        (review: any) => review.rating <= 1.0,
      ).length;

      const now = new Date();
      const currentMonth = now.getMonth(); // 0–11
      const currentYear = now.getFullYear();

      const monthlyReviews = reviewData.reviews.filter((review: any) => {
        const reviewDate = new Date(review.createdAt);

        return (
          reviewDate.getMonth() === currentMonth &&
          reviewDate.getFullYear() === currentYear
        );
      });
      const monthlyReviewsCount = monthlyReviews.length;

      setReviewStats({
        fiveStarCount: fiveStarCount,
        fiveStarPercentage:
          totalReviews !== 0
            ? (((fiveStarCount / totalReviews) * 100).toFixed(
                1,
              ) as unknown as number)
            : 0,
        fourStarCount: fourStarCount,
        fourStarPercentage:
          totalReviews !== 0
            ? (((fourStarCount / totalReviews) * 100).toFixed(
                1,
              ) as unknown as number)
            : 0,
        threeStarCount: threeStarCount,
        threeStarPercentage:
          totalReviews !== 0
            ? (((threeStarCount / totalReviews) * 100).toFixed(
                1,
              ) as unknown as number)
            : 0,
        twoStarCount: twoStarCount,
        twoStarPercentage:
          totalReviews !== 0
            ? (((twoStarCount / totalReviews) * 100).toFixed(
                1,
              ) as unknown as number)
            : 0,
        oneStarCount: oneStarCount,
        oneStarPercentage:
          totalReviews !== 0
            ? (((oneStarCount / totalReviews) * 100).toFixed(
                1,
              ) as unknown as number)
            : 0,
        currentReviewCount: monthlyReviewsCount,
      });
    } catch (err) {
      setFailed(true);
    } finally {
      setResLoading(false);
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

  if (resLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  console.log("rating:::", reviewStats);
  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl h-8 font-bold text-orangeButton my-custom-class">
          Monthly Performance Report
        </h1>
        <p className="text-gray-500">
          Comprehensive overview of your agency&apos;s monthly performance
        </p>
      </div>

      {/* Profile Performance */}
      <Card className="rounded-3xl bg-white">
        <CardHeader>
          <CardTitle className="h-2">Profile Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Profile Views</p>
              <p className="text-2xl font-bold">
                {profilePerformceStats.totalProfileViews}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Profile Views This Month</p>
              <p className="text-2xl font-bold">
                {profilePerformceStats.currentMonthProfileViews}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Profile Views Last Month</p>
              <p className="text-2xl font-bold">
                {profilePerformceStats.lastMonthProfileViews}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">View Rate</p>
              <p className="text-2xl font-bold">
                {profilePerformceStats.viewRateIncreasePercentage}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Ranking Trend */}
      <Card className="rounded-3xl bg-white">
        <CardHeader>
          <CardTitle className="h-2">Category Ranking Trend</CardTitle>
        </CardHeader>
        {categoryRankingTrend.length !== 0 ? (
          <div>
            {(categoryRankingTrend || []).map((item: any, index: number) => (
              <CardContent className="space-y-4 mb-2">
                <div className="flex items-center py-2 justify-between p-4 border rounded-2xl">
                  <div>
                    <p className="text-sm font-bold">{item.service}</p>
                    <p className="text-2xl font-bold">Rank #{index + 1}</p>
                  </div>
                  {/* <div className="text-right">
                      <span className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-bold">
                        ↑{" "}
                        {monthlyReport.categoryRanking.previous -
                          monthlyReport.categoryRanking.current}{" "}
                        positions
                      </span>
                      <p className="text-xs text-center text-gray-500 mt-1">
                        Previous: #{monthlyReport.categoryRanking.previous}
                      </p>
                    </div> */}
                </div>
              </CardContent>
            ))}
          </div>
        ) : (
          <div>
            <CardContent className="space-y-4">
              <div className="text-center mt-10">
                <p className="text-gray-500  text-xl">
                  {" "}
                  No Services matched with the client searches{" "}
                </p>
              </div>
            </CardContent>
          </div>
        )}
      </Card>

      {/* Leads Generated */}
      <Card className="rounded-3xl bg-white">
        <CardHeader>
          <CardTitle className="h-1">Leads Generated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-2 h-16 border rounded-2xl text-center">
              <p className="text-2xl font-bold h-6">
                {leadsGeneratedStats.inquiries}
              </p>
              <p className="text-sm text-gray-500">Inquiries</p>
            </div>
            <div className="p-2 h-16 border rounded-2xl text-center">
              <p className="text-2xl font-bold h-6">
                {leadsGeneratedStats.proposals}
              </p>
              <p className="text-sm text-muted-foreground">Proposals</p>
            </div>
            <div className="p-2 h-16 border rounded-2xl text-center">
              <p className="text-2xl font-bold h-6">
                {leadsGeneratedStats.leads}
              </p>
              <p className="text-sm text-muted-foreground">Total Leads</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Funnel */}
      <Card className="rounded-3xl bg-white">
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription className="text-gray-500 h-4">
            View → Contact → Proposal → Won
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            {
              label: "Views",
              value: conversionFunnelStats.views,
              percent: conversionFunnelStats.viewsPercenntage,
              color: "bg-green-600",
              showValue: true,
            },
            {
              label: "Contacts",
              value: conversionFunnelStats.contacts,
              percent: conversionFunnelStats.contactsPercentage,
              color: "bg-blue-500",
              showValue: true,
            },
            {
              label: "Proposals",
              value: conversionFunnelStats.proposals,
              percent: conversionFunnelStats.proposalsPercentage,
              color: "bg-teal-400",
              showValue: true,
            },
            {
              label: "Won",
              value: conversionFunnelStats.won,
              percent: conversionFunnelStats.wonPercentage,
              color: "bg-purple-500",
              showValue: true,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-6 p-4 border rounded-2xl"
            >
              {/* Label */}
              <div className="w-20 font-semibold">{item.label}</div>

              {/* Bar */}
              <div className="flex-1">
                <div className="w-full bg-muted h-4 rounded-full">
                  <div
                    className={`${item.color} h-4 rounded-full flex items-center justify-center 
                            text-white text-[10px] font-medium px-3 whitespace-nowrap`}
                    style={{
                      width: `${item.percent}%`,
                      minWidth: "56px",
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              </div>

              {/* Percentage */}
              <div className="w-16 text-right font-semibold">
                {item.percent}%
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Reviews & Ratings */}
      <Card className="rounded-3xl bg-white">
        <CardHeader>
          <CardTitle className="h-2">
            Reviews Added & Ratings Distribution
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 items-start">
            {/* Reviews Count */}
            <div
              className="border rounded-2xl 
        px-6 py-4 
        max-w-xs 
        h-40
        flex flex-col items-center justify-center
        text-center"
            >
              <p className="text-4xl font-bold mb-2">
                {reviewStats.currentReviewCount}
              </p>
              <p className="text-sm text-gray-500 leading-tight">
                New Reviews This Month
              </p>
            </div>

            {/* Ratings Distribution */}
            <div className="space-y-2">
              {[
                {
                  rating: 5,
                  count: reviewStats.fiveStarCount,
                  percent: reviewStats.fiveStarPercentage,
                },
                {
                  rating: 4,
                  count: reviewStats.fourStarCount,
                  percent: reviewStats.fourStarPercentage,
                },
                {
                  rating: 3,
                  count: reviewStats.threeStarCount,
                  percent: reviewStats.threeStarPercentage,
                },
                {
                  rating: 2,
                  count: reviewStats.twoStarCount,
                  percent: reviewStats.twoStarPercentage,
                },
                {
                  rating: 1,
                  count: reviewStats.oneStarCount,
                  percent: reviewStats.oneStarPercentage,
                },
              ].map(({ rating, count, percent }) => (
                <div
                  key={rating}
                  className="grid grid-cols-[36px_1fr_30px] items-center gap-4"
                >
                  {/* Rating */}
                  <div className="flex items-center gap-1 text-[#f5a30c] font-medium">
                    <span>{rating}</span>
                    <Star className="h-4 w-4 fill-[#f5a30c] text-[#f5a30c]" />
                  </div>

                  {/* Bar */}
                  <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                    <div
                      className="h-3 bg-[#f9c666] rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Count */}
                  <div className="text-right text-sm text-muted-foreground">
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitorComparisonPage;
