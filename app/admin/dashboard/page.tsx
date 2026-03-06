"use client";

import { useState, useEffect } from "react";
import {
  mockAdminStats,
  mockReportedContent,
  mockSubscriptionStats,
} from "@/lib/mock-data";
import { authFetch } from "@/lib/auth-fetch";
import {
  Users,
  FileText,
  AlertTriangle,
  TriangleAlert,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Provider, User } from "@/lib/types";
import { Switch } from "@radix-ui/react-switch";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState(mockAdminStats);
  const [subscriptionStats, setSubscriptionStats] = useState(
    mockSubscriptionStats,
  );
  const [users, setUsers] = useState<User[]>([]);
  const[providers,setProviders]=useState<Provider[]>([]);
  const [reportedContent, setReportedContent] = useState([]);
  const [requirements, setRequirements] = useState([]);

  const[revenue,setRevenue]=useState([]);
  const[revenueStats,setRevenueStats]=useState({
    monthlyRevenue:0,
    increasedPercentageThanLastMonth:0
  });

  useEffect(() => {
    async function fetchDashboardData() {
      // To decrease server load, use a single aggregated endpoint
      // or Promise.all to fetch concurrently.
      try {
        setIsLoading(true);
        const [
          
          usersRes,
          requirementsRes,
          reportsRes,
          providersRes,
          paymentRes,
        ] = await Promise.all([
          authFetch("/api/users"),
          authFetch("/api/requirements"),
          authFetch("/api/reported-content"),
          authFetch("/api/providers"),
          authFetch("/api/payment")
        ]);
        const usersData = await usersRes.json();
        setUsers(usersData.users.filter((item)=>item.role!=="admin"));

        const reportedData=await reportsRes.json();
        setReportedContent(reportedData.reports)

        const requirementsData = await requirementsRes.json();
        console.log("Fetched requirements data:", requirementsData);
        setRequirements(requirementsData.requirements);

        const providersData=await providersRes.json();
        setProviders(providersData.providers)

        const paymentsData=await paymentRes.json();
        setRevenue(paymentsData.data);

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  {/*Revenue stats caluclation */}
  useEffect(() => {
  if (revenue.length === 0) return;

  const now = new Date();

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const lastMonthDate = new Date(currentYear, currentMonth - 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  let currentMonthRevenue = 0;
  let lastMonthRevenue = 0;

  revenue.forEach(item => {
    if (item.status !== "success") return;

    const date = new Date(item.createdAt);
    const month = date.getMonth();
    const year = date.getFullYear();

    if (month === currentMonth && year === currentYear) {
      currentMonthRevenue += item.amount;
    }

    if (month === lastMonth && year === lastMonthYear) {
      lastMonthRevenue += item.amount;
    }
  });

  const increasedPercentageThanLastMonth =
    lastMonthRevenue === 0
      ? currentMonthRevenue > 0
        ? 100
        : 0
      : ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

  setRevenueStats({
    monthlyRevenue: currentMonthRevenue,
    increasedPercentageThanLastMonth: Number(
      increasedPercentageThanLastMonth.toFixed(2)
    ),
  });
}, [revenue]);

  const pendingReports = reportedContent.filter(
    (r) => r.status === "pending",
  ).length;
  const pendingUsers = providers.filter((u) => !u.isVerified).length;
  const activeRequirements = requirements.filter(
    (r) => r.status === "Allocated",
  );
  console.log("ACtive Requirements are ::::::::",activeRequirements)

  const now = new Date();

const usersRegisteredThisMonth = users.filter(user => {
  const date = new Date(user.createdAt);
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
})

const reportsInThisMonth=(reportedContent || []).filter(report => {
  const date = new Date(report.createdAt);
  return (
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
})

if(isLoading){
  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
}


  return (
    <div className="space-y-10">
      {/* Page Heading */}
      <div className="py-4 border-b border-slate-300 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-orangeButton">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-xl">
            Platform management and insights
          </p>
        </div>
        {/* <div className="flex flex-row justify-center items-center gap-4">
          <Button className="bg-orangeButton rounded-full text-white mt-4 hover:bg-orange-600 flex items-center gap-2">
            <TriangleAlert className="h-4 w-4" /> Reports
          </Button>
          <Button className="bg-[#278DEC] rounded-full text-white mt-4 hover:bg-blue-800 flex items-center gap-2">
            <Users className="h-4 w-4" /> Pending
          </Button>
        </div> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users */}
        <DashboardCard
          title="Total Users"
          icon={<Users className="h-4 w-4 text-orangeButton" />}
          gradient="from-blue-100 to-blue-200"
          value={users.length}
          helper={`${pendingUsers} pending approval`}
        />

        {/* Active Projects */}
        <DashboardCard
          title="Active Projects"
          icon={<FileText className="h-4 w-4 text-orangeButton" />}
          gradient="from-green-100 to-green-200"
          value={activeRequirements.length}
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
          value={`$${revenueStats.monthlyRevenue.toLocaleString()}`}
          helper={`+${revenueStats.increasedPercentageThanLastMonth}% growth`}
        />
      </div>

      {/* Recent activity  */}
      <div className="flex flex-col lg:flex-row gap-6 h-full w-full">
        <RecentUserActivityCard recentUsers={usersRegisteredThisMonth} />
        <ContentReportsCard reportContent={reportsInThisMonth}/>
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

function RecentUserActivityCard({recentUsers}) {
  return (
    <div className="w-full h-full">
      <div className="bg-white rounded-2xl shadow-md p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-lg font-extrabold text-orangeButton">
            Recent User Activity
          </h3>
          <p className="text-sm text-gray-500">
            Latest user registrations and status changes
          </p>
        </div>

        {/* User List */}
        <div className="space-y-3">
          {/* User Item */}
          {
            (recentUsers || []).length!==0?
           <div>
            {
              recentUsers.slice(0,4).map((eachItem)=>(
                 <div className="flex items-center justify-between border mb-3 rounded-xl px-4 py-3">
                  <div>
                    <p className="font-semibold text-orangeButton">{eachItem.name}</p>
                    <p className="text-sm text-gray-500">{eachItem.email}</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-lg bg-green-100 text-green-700">
                  {eachItem.role}
                  </span>
                </div>
              ))
            }
           </div>
            :
            <div className="text-center ">
              <p className="text-sm text-gray-500">No users registered in this month</p>
            </div>
          }

          
        </div>
      </div>
    </div>
  );
}
function ContentReportsCard({reportContent}) {
  const getReportStatusColor = (receivedStatus: string): string => {
  switch (receivedStatus.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "resolved":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
  return (
    <div className="w-full h-full">
      <div
        className="
          bg-white rounded-2xl p-6
          shadow-md hover:shadow-xl
          transition-all duration-300 ease-in-out
          hover:-translate-y-1
        "
      >
        {/* Header */}
        <div className="mb-5">
          <h3 className="text-lg font-bold text-orangeButton">
            Content Reports
          </h3>
          <p className="text-sm text-gray-500">
            Recent content moderation requests
          </p>
        </div>

        {/* Report List */}
        <div className="space-y-3">
          {/* Item */}
          {
            (reportContent || []).length!==0?
             <div>
              {
                reportContent.slice(0,4).map((item)=>(
                  <div className="flex items-center justify-between border  mb-3 rounded-xl px-4 py-3">
                    <div>
                      <p className="font-semibold text-orangeButton">
                        {item.reason}
                      </p>
                      <p className="text-sm text-gray-500">{item.reportedTo.email}</p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-lg ${getReportStatusColor(item.status)}`}>
                    {item.status}
                    </span>
                  </div>
                ))
              }
             </div>
            :
            <div className="text-center">
               <p className="text-gray-500 text-xl">Their is no recent reports in this month </p>
            </div>

          }

          
          

          
        </div>
      </div>
    </div>
  );
}
