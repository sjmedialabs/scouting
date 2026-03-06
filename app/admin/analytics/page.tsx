"use client";

import { useState, useEffect } from "react";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import {
  mockAdminStats,
  mockSubscriptionStats,
  mockProvider,
  mockReportedContent,
} from "@/lib/mock-data";
import { User } from "@/lib/types";
import { AlertTriangle, FileText, Users } from "lucide-react";
import {
  type Provider,
  type Requirement,
  type Notification,
  type Project,
  type Review,
  Proposal,
} from "@/lib/types";
import { authFetch } from "@/lib/auth-fetch";
import { FaAws } from "react-icons/fa";

export default function AnalyticsPage() {
  const [stats, setStats] = useState(mockAdminStats);
  // const [subscriptionStats, setSubscriptionStats] = useState(
  //   mockSubscriptionStats,
  // );
  const [topProviders, setTopProviders] = useState([mockProvider]);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [reportedContent, setReportedContent] = useState(mockReportedContent);
  const [requirements, setRequirements] = useState([]);
  const [userDistribution, setUserDistribution] = useState({
    clientsCount: 0,
    clientsCountPercentage: 0,
    agenciesCount: 0,
    agenciesCountPercentage: 0,
    pendingApproval:0,
    monthlyRevenue:0,
    percentageIncrease:0
  });
  const [topPerformingAgencies, setTopPerformingAgencies] = useState<
    Provider[]
  >([]);

      const [subscriptionStats, setSubscriptionStats] = useState<{
      planId: string;
      planName: string;
      count: number;
      percentage: number;
    }[]>([]);

    const [freeTrialStats, setFreeTrialStats] = useState<{
      count: number;
      percentage: number;
    }>({ count: 0, percentage: 0 });

   const[bottomCardStats,setBottomCardStats]=useState({
         monthlyRecurringRevenue:0,
         activeSubscriberCount:0,
         avgRevenuePereUser:0,
         platformGrowthPercentage:0
   })
  // const[dynamicSubscriptionStats,setDynamicSubscriptionStats]=useState({

  // })

  const[reports,setReports]=useState([]);


  useEffect(() => {
    async function fetchDashboardData() {
      // To decrease server load, use a single aggregated endpoint
      // or Promise.all to fetch concurrently.
      try {
        setIsLoading(true);
        const [
          //statsRes, subRes,
          usersRes,
          requirementsRes,
          providersRes,
          paymentRes,
          subscriptionRes,
          reportsRes
        ] = await Promise.all([
          //   authFetch("/api/admin/stats"),
          //   authFetch("/api/admin/subscriptions"),
          authFetch("/api/users"),
          authFetch("/api/requirements"),
          authFetch("/api/providers"),
          authFetch("/api/payment"),
          authFetch("/api/subscription"),
          authFetch("/api/reported-content")
        ]);
        const usersData = await usersRes.json();
        let totalUsers = usersData.users.length;
        let clientCounts = usersData.users.filter(
          (eachItem) => eachItem.role === "client",
        ).length;
        let clientsCountPercentage =
          totalUsers > 0 ? Math.round((clientCounts / totalUsers) * 100) : 0;
        let agenciesCount = totalUsers - clientCounts;
        let agencyCountPercentage =
          totalUsers > 0 ? Math.round((agenciesCount / totalUsers) * 100) : 0;

        // console.log("Total users count::::", totalUsers);
        // console.log("clients counts::::", clientCounts);
        // console.log("clients counts percentage::::", clientsCountPercentage);
        // console.log("Agencies count:::::", agenciesCount);
        // console.log("Agencies percentage:::::", agencyCountPercentage);

        // setUserDistribution({
        //   clientsCount: clientCounts,
        //   clientsCountPercentage: clientsCountPercentage,
        //   agenciesCount: agenciesCount,
        //   agenciesCountPercentage: agencyCountPercentage,
        //   pendingApproval:usersData.users.filter((eachItem)=>!eachItem.isVerified).length
        // });

        setUsers(usersData.users.filter((item)=>item.role!=="admin"));

        const requirementsData = await requirementsRes.json();
        console.log("Fetched requirements data:", requirementsData);

        const providersData = await providersRes.json();
        const providers = providersData.providers || [];

        const topThreePerformers = providers
          .filter((p) => typeof p.rating === "number") // optional safety
          .sort((a, b) => b.rating - a.rating) // highest rating first
          .slice(0, 3);

        console.log("top performers::::::", topThreePerformers);
        setTopPerformingAgencies(topThreePerformers);
        setRequirements(requirementsData.requirements);

        //Monthly payment

        const paymentsData=await paymentRes.json();
        const payments=paymentsData.data;

        const successfulPayments = payments.filter(
          (p: any) => p.status === "success"
        )
        const now = new Date()

        const currentYear = now.getFullYear()
        const currentMonth = now.getMonth()

        const lastMonthDate = new Date(currentYear, currentMonth - 1)
        const lastMonth = lastMonthDate.getMonth()
        const lastMonthYear = lastMonthDate.getFullYear()

        const currentMonthRevenue = getMonthlyRevenue(
          successfulPayments,
          currentYear,
          currentMonth
        )

        const lastMonthRevenue = getMonthlyRevenue(
          successfulPayments,
          lastMonthYear,
          lastMonth
        )

        let revenueIncreasePercentage = 0

        if (lastMonthRevenue > 0) {
          revenueIncreasePercentage =
            ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        }

         setUserDistribution({
          clientsCount: clientCounts,
          clientsCountPercentage: clientsCountPercentage,
          agenciesCount: agenciesCount,
          agenciesCountPercentage: agencyCountPercentage,
          pendingApproval:providersData.providers.filter((eachItem)=>!eachItem.isVerified).length,
          monthlyRevenue:currentMonthRevenue,
          percentageIncrease:Number(revenueIncreasePercentage.toFixed(2)),
        });

        const subscriptionData=await subscriptionRes.json();
        const users = usersData.users;                 // all users
        const plans = subscriptionData;  // available plans

        const totalRegisteredUsers = users.length;

        const planCountMap: Record<string, number> = {};
        let freeTrialCount = 0;

        // Step 1: classify users
        users.forEach((user: any) => {
          if (user.subscriptionPlanId) {
            const planId = user.subscriptionPlanId._id;
            planCountMap[planId] = (planCountMap[planId] || 0) + 1;
          } else {
            freeTrialCount++;
          }
        });

        console.log("Plans Map is :::",planCountMap)

          // Step 2: build subscription plan stats
          const planStats = plans.map((plan: any) => {
            const count = planCountMap[plan._id] || 0;
            const percentage =
              totalRegisteredUsers > 0
                ? Number(((count / totalRegisteredUsers) * 100).toFixed(2))
                : 0;

            return {
              planId: plan._id,
              planName: plan.title,
              count,
              percentage,
            };
          });

          // Step 3: free trial stats
          const freeTrialPercentage =
            totalRegisteredUsers > 0
              ? Number(((freeTrialCount / totalRegisteredUsers) * 100).toFixed(2))
              : 0;
          
          
          setSubscriptionStats(()=>[...planStats,{
            planId:"123",
            planName:"Free trail",
            count:freeTrialCount,
            percentage:freeTrialPercentage
          }]);
          setFreeTrialStats({
            count: freeTrialCount,
            percentage: freeTrialPercentage,
          });

          //botom cards stats
          const currentMRR = getCurrentMonthMRR(payments)
          const arpu = getARPU(payments)
          const growth=lastMonthRevenue>0?((currentMonthRevenue- lastMonthRevenue) /lastMonthRevenue) * 100:0
          setBottomCardStats({
            monthlyRecurringRevenue:currentMRR,
            activeSubscriberCount:usersData.users.filter((eachItem)=>eachItem. subscriptionPlanId).length,
            avgRevenuePereUser:arpu,
            platformGrowthPercentage:growth.toFixed(2)
          })

          const reportsData=await reportsRes.json();
          setReports(reportsData.reports.filter((item)=>item.status==="pending"));




      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        // setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const pendingReports = reportedContent.filter(
    (r) => r.status === "pending",
  ).length;
  const pendingUsers = users.filter((u) => !u.isVerified).length;
  const activeRequirements = requirements.filter(
    (r) => r.status === "Allocated",
  ).length;
console.log("Subscription statst:::::::",subscriptionStats);
  function getMonthlyRevenue(payments: any[], year: number, month: number) {
  return payments
    .filter((p) => {
      const date = new Date(p.createdAt)
      return (
        date.getFullYear() === year &&
        date.getMonth() === month // 0-based
      )
    })
    .reduce((sum, p) => sum + p.amount, 0)
}

const percentage = userDistribution.percentageIncrease || 0

let helperText = "0%"
let helperColor = "text-orangeButton"

if (percentage > 0) {
  helperText = `${percentage}% growth`
  helperColor = "text-green-600"
} else if (percentage < 0) {
  helperText = `${Math.abs(percentage)}% drop`
  helperColor = "text-red-600"
}
const getCurrentMonthMRR = (payments) => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  return payments
    .filter(p => 
      p.status === "success" &&
      new Date(p.createdAt).getMonth() === currentMonth &&
      new Date(p.createdAt).getFullYear() === currentYear
    )
    .reduce((sum, p) => sum + p.amount, 0)
}
const getARPU = (payments) => {
  const successfulPayments = payments.filter(p => p.status === "success")

  const totalRevenue = successfulPayments.reduce(
    (sum, p) => sum + p.amount,
    0
  )

  const uniqueUsers = new Set(
    successfulPayments.map(p => p.userId)
  )

  return uniqueUsers.size === 0
    ? 0
    : Math.round( totalRevenue / uniqueUsers.size)
}




  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-orangeButton">
        Analytics Overview
      </h1>
      <p className="text-gray-500 text-xl">
        Key platform insights and performance metrics
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <DashboardCard
          title="Total Users"
          icon={<Users className="h-4 w-4 text-orangeButton" />}
          gradient="from-blue-100 to-blue-200"
          value={users.length}
          helper={`${userDistribution.pendingApproval} pending approval`}
        />

        {/* Active Projects */}
        <DashboardCard
          title="Active Projects"
          icon={<FileText className="h-4 w-4 text-orangeButton" />}
          gradient="from-green-100 to-green-200"
          value={activeRequirements}
          helper={`${requirements.length} requirements posted`}
        />

        {/* Pending Reports */}
        <DashboardCard
          title="Pending Reports"
          icon={<AlertTriangle className="h-4 w-4 text-orangeButton" />}
          gradient="from-orange-100 to-orange-200"
          value={pendingReports}
          helper="Require moderation"
        />

        {/* Monthly Revenue */}
        <DashboardCard
          title="Monthly Revenue"
          icon={
            <img
              src="/images/revenue-icon.png"
              className="h-4 w-4 text-orangeButton"
            />
          }
          gradient="from-purple-100 to-purple-200"
          value={`$${userDistribution.monthlyRevenue.toLocaleString()}`}
          helper={<span className={helperColor}>{helperText}</span>}
        />
      </div>
      <AnalyticsDashboard
        stats={userDistribution}
        subscriptionStats={subscriptionStats}
        topProviders={topPerformingAgencies}
      />
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Users */}
        <DashboardCard
          title="Average Revenue Per User"
          icon={<Users className="h-4 w-4 text-orangeButton" />}
          gradient="from-blue-100 to-blue-200"
          value={`${bottomCardStats.monthlyRecurringRevenue.toLocaleString() || 0}`}
          helper={`From ${bottomCardStats.activeSubscriberCount || 0} active subscriptions`}
        />

        {/* Average Revenue per user */}
        <DashboardCard
          title="Average Revenue Per User"
          icon={<FileText className="h-4 w-4 text-orangeButton" />}
          gradient="from-green-100 to-green-200"
          value={bottomCardStats.avgRevenuePereUser}
          helper={`Per paying user`}
        />

        {/* Platform Growth percentage */}
        <DashboardCard
          title="Platform Growth"
          icon={<AlertTriangle className="h-4 w-4 text-orangeButton" />}
          gradient="from-orange-100 to-orange-200"
          value={`${bottomCardStats.platformGrowthPercentage}%`}
          helper="Month over month growth"
        />
      </div>
    </div>
  );
}
/* ---------------------------------------------------------
   REUSABLE DASHBOARD CARD COMPONENT
--------------------------------------------------------- */
function DashboardCard({ title, value, icon, helper, gradient }: any) {
  return (
    <div
      className="group bg-white rounded-2xl p-6  shadow-lg
                 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-center justify-between pb-8">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
        </div>
        <div
          className={`p-2 rounded-full flex items-center justify-center shadow-md
          bg-[#EEF7FE] group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
      </div>

      <div className="text-2xl font-extrabold text-slate-800">{value}</div>
      <p className="text-xs text-orangeButton font-extralight mt-1">{helper}</p>
    </div>
  );
}
