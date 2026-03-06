"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts"
import { Download, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import clsx from "clsx"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { User } from "@/lib/types";
import { authFetch } from "@/lib/auth-fetch"

/* ---------------- Tabs ---------------- */
const TABS = ["Overview", "Revenue", "Users", "Services"] as const
type Tab = (typeof TABS)[number]

/* ---------------- Data ---------------- */
const revenueData = [
  { month: "Jan", revenue: 50000 },
  { month: "Feb", revenue: 65000 },
  { month: "Mar", revenue: 30000 },
  { month: "Apr", revenue: 55000 },
  { month: "May", revenue: 62000 },
  { month: "Jun", revenue: 48000 },
  { month: "Jul", revenue: 35000 },
  { month: "Aug", revenue: 52000 },
  { month: "Sep", revenue: 68000 },
  { month: "Oct", revenue: 72000 },
  { month: "Nov", revenue: 65000 },
  { month: "Dec", revenue: 82000 },
]
const revenueTrendData = [
  { month: "Jan", revenue: 52000 },
  { month: "Feb", revenue: 68000 },
  { month: "Mar", revenue: 30000 },
  { month: "Apr", revenue: 56000 },
  { month: "May", revenue: 64000 },
  { month: "Jun", revenue: 58000 },
  { month: "Jul", revenue: 46000 },
  { month: "Aug", revenue: 62000 },
  { month: "Sep", revenue: 71000 },
  { month: "Oct", revenue: 74000 },
  { month: "Nov", revenue: 70000 },
  { month: "Dec", revenue: 82000 },
]

const userGrowthData = [
  { month: "Jan", users: 2000 },
  { month: "Feb", users: 2600 },
  { month: "Mar", users: 1000 },
  { month: "Apr", users: 1700 },
  { month: "May", users: 2100 },
  { month: "Jun", users: 1800 },
  { month: "Jul", users: 1200 },
  { month: "Aug", users: 2000 },
  { month: "Sep", users: 2600 },
  { month: "Oct", users: 2800 },
  { month: "Nov", users: 2500 },
  { month: "Dec", users: 3400 },
]
function UsersKPIs() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard title="Total Users" value="15,234" subtitle="+1200 this month" />
      <KPICard title="User Retention Rate" value="87.3%" subtitle="+2% last month" />
      <KPICard title="New User Signups" value="1,456" subtitle="+150 this month" />
      <KPICard title="Active Sessions" value="3,421" subtitle="Currently Active" />
    </div>
  )
}
function RevenueKPIs() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Total Revenue"
        value="$45,231.89"
        subtitle="+20.1% from last month"
      />
      <KPICard
        title="Active Users"
        value="234"
        subtitle="+12.5% from last month"
      />
      <KPICard
        title="Services Completed"
        value="03"
        subtitle="+9.3% from last month"
      />
      <KPICard
        title="Avg. Response Time"
        value="$23,700"
        subtitle="-15.8% improvement"
      />
    </div>
  )
}

function KPICard({
  title,
  value,
  subtitle,
}: {
  title: string
  value: string
  subtitle: string
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-xs text-green-500 mt-1">{subtitle}</p>
    </div>
  )
}
function RevenueTrendChart({lastTweleveMonthsRevenue}) {
  const maxRevenue= Math.max(...lastTweleveMonthsRevenue.map(d => d?.users),0)
  // const maxRevenue=20000;
  

const step = getYAxisStep(maxRevenue)

const yAxisMax = Math.ceil(maxRevenue / step) * step
const yAxisTicks = Array.from(
  { length: yAxisMax / step + 1 },
  (_, i) => i * step
)
  return (
    <ChartContainer
      className="h-72 w-full"
      config={{ revenue: { label: "Revenue" } }}
    >
      <BarChart data={lastTweleveMonthsRevenue}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="-13.56%" stopColor="#FD749B" />
            <stop offset="158.3%" stopColor="#281AC8" />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        <XAxis
          dataKey="month"
          axisLine
          tickLine={false}
          tick={{ fill: "#9CA3AF", fontSize: 10 }}
        />

        <YAxis
        domain={[0, yAxisMax]}
        ticks={yAxisTicks}
        allowDecimals={false}
        tick={{ fill: "#858585", fontSize: 10 }}
        axisLine={true}
        tickLine={false}
      />

        <ChartTooltip content={<ChartTooltipContent />} />

        <Bar
          dataKey="revenue"
          fill="url(#revenueGradient)"
          radius={[8, 8, 0, 0]}
          barSize={8}
        />
      </BarChart>
    </ChartContainer>
  )
}

function RevenueSummaryCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard
        title="Monthly Recurring Revenue"
        value="$15,600"
        subtitle="From 423 active subscriptions"
        icon="/images/admin-monthlyRevenue.png"
      />
      <SummaryCard
        title="Average Revenue Per User"
        value="$69"
        subtitle="Per paying user"
        icon="/images/admin-user.png"
      />
      <SummaryCard
        title="Platform Growth"
        value="+12.5%"
        subtitle="Month over month growth"
        icon="/images/admin-monthlyRevenue.png"
      />
    </div>
  )
}
function SummaryCard({
  title,
  value,
  subtitle,
  icon
}: {
  title: string
  value: string
  subtitle: string
  icon: string
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex flex-row justify-between">
        <p className="text-sm text-gray-500">{title}</p>
        <div className="rounded-full bg-[#EEF7FE] p-2"><img src={icon} alt="" className="h-4" /></div>
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-xs text-orange-500 mt-1">{subtitle}</p>
    </div>
  )
}
const servicesKpis = {
  totalServices: 1234,
  completionRate: "97.6%",
  avgRating: "4.8 / 5.0",
}

const agencyPerformanceData = [
  { agency: "Conceptual Canvas", value: 8000 },
  { agency: "Innovate Intuition", value: 15000 },
  { agency: "IdeaFlux Agency", value: 12000 },
  { agency: "ThinkTank Thrive", value: 15000 },
  { agency: "BlueSky Brandworks", value: 18000 },
]

const topServices = [
  {
    id: 1,
    name: "Website sketching",
    category: "Design",
    orders: 150,
    revenue: "$12,875",
    rating: 4.8,
  },
  {
    id: 2,
    name: "UX/UI design (frontend)",
    category: "Design",
    orders: 22,
    revenue: "$15,879",
    rating: 4.3,
  },
  {
    id: 3,
    name: "Website development",
    category: "Development",
    orders: 78,
    revenue: "$11,589",
    rating: 4.8,
  },
  {
    id: 4,
    name: "eCommerce solutions",
    category: "Development",
    orders: 548,
    revenue: "$31,789",
    rating: 4.0,
  },
  {
    id: 5,
    name: "Website copywriting",
    category: "Content",
    orders: 751,
    revenue: "$9,789",
    rating: 3.9,
  },
  {
    id: 6,
    name: "Website copywriting",
    category: "Content",
    orders: 751,
    revenue: "$9,789",
    rating: 3.9,
  },
]
function ServicesKPIs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KpiCard
        title="Total Services"
        value="1,234"
        subtitle="Across all categories"
      />
      <KpiCard
        title="Completion Rate"
        value="97.6%"
        subtitle="+21% last month"
        positive
      />
      <KpiCard
        title="Avg Rating"
        value="4.8 / 5.0"
        subtitle="From 9875 users"
      />
    </div>
  )
}

function KpiCard({
  title,
  value,
  subtitle,
  positive,
}: {
  title: string
  value: string
  subtitle: string
  positive?: boolean
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p
        className={`text-xs mt-1 ${positive ? "text-green-500" : "text-gray-400"
          }`}
      >
        {subtitle}
      </p>
    </div>
  )
}
function AgencyPerformanceChart({topAgencies}) {
  return (
    <ChartContainer
      className="h-64"
      config={{ value: { label: "Performance" } }}
    >
      <BarChart data={topAgencies}>
        <defs>
          <linearGradient id="serviceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="-13.56%" stopColor="#FD749B" />
            <stop offset="158.3%" stopColor="#281AC8" />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="agency"
          tick={{ fill: "#9CA3AF", fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: "#9CA3AF", fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />

        <ChartTooltip content={<ChartTooltipContent />} />

        <Bar
          dataKey="value"
          fill="url(#serviceGradient)"
          radius={[8, 8, 0, 0]}
          barSize={8}
        />
      </BarChart>
    </ChartContainer>
  )
}

function TopServicesTable({categories}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-xl font-semibold text-orange-500">
        Top Services
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Most popular services on the platform
      </p>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-500 text-xs">
              <th className="text-left py-2">#</th>
              <th className="text-left">Service Name</th>
              {/* <th>Category</th> */}
              <th>Orders</th>
              {/* <th>Revenue</th> */}
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {categories.slice(0, 6).map((service,i) => (
              <tr
                key={i}
                className="border-b last:border-none text-xs"
              >
                <td className="py-3">{service.id}</td>
                <td>{service.category}</td>
                {/* <td className="text-center">{service.category}</td> */}
                <td className="text-center">{service.count}</td>
                {/* <td className="text-center">{service.revenue}</td> */}
                <td className="text-center flex justify-center py-3 items-center gap-1">
                  {service.rating}
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows.length) return

  const headers = Object.keys(rows[0])
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((h) => `"${row[h]}"`).join(",")
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
const getYAxisStep = (max) => {
  if (max <= 10) return 1
  if (max <= 50) return 5
  if (max <= 100) return 10
  if (max <= 500) return 50
  if (max <= 1000) return 100
  if (max <= 5000) return 500
  
  return 1000
}

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview")

  const[resLoading,setResLoading]=useState(false);
  const[failed,setFailed]=useState(false)

  const[users,setUsers]=useState<User[]>([]);
  const[revenue,setRevenue]=useState([]);


  const[topCardStats,setTopCardStats]=useState({
    totalRevenue:0,
    lastMonthRevenuePercentage:0,
    activeUsers:0,
    lastMonthActiveUsersPercentage:0
  })

  const[topLastTwoCardStats,setTopLastTwoCardStats]=useState({
    freeTrailUserCount:0,
    incFreeTrailUserCountPercentageThanLastMonth:0,
    planExpiredUsersCount:0,
    incPercentagePlanExpiredUsersThanLatMonth:0
  })

  const[serviceTabTopCardStats,setServiceTabTopCardStats]=useState({
    totalServices:0,
    projectCompletionPercentage:0,
    incPercentageCompletionProjects:0,
    avgRating:0,
    ratingFromAgenciesCount:0
  })

  const[services,setServices]=useState([]);
  const[requirements,setRequirements]=useState([])
  const[providers,setProviders]=useState([]);
  const[reviews,setReviews]=useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const[topFiveAgencies,setTopFiveAgencies]=useState([]);
  const [chartData, setChartData] = useState([]);

  const[lastSixMonthsRevenueData,setLastSixMonthsRevenueData]=useState([]);
  const[lastTwelevMonthsRevenueData,setLastTwelveMonthsRevenueData]=useState([]);
  const[dynamicUsersGrowthData,setDynamicUsersGrowthData]=useState([]);

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const maxUsers = Math.max(...dynamicUsersGrowthData.map(d => d?.users),0)
  const maxRevenue= Math.max(...lastSixMonthsRevenueData.map(d => d?.users),0)
  // const maxUsers=200;
  
  // console.log("Max users are:::::",maxUsers);

  const [userGrowthData, setUserGrowthData] = useState<
  { month: string; users: number }[]
>([]);

const formatMonthYear = (date: Date) =>
  `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

  

const step = getYAxisStep(maxUsers)

const yAxisMax = Math.ceil(maxUsers / step) * step
const yAxisTicks = Array.from(
  { length: yAxisMax / step + 1 },
  (_, i) => i * step
)

 const revenueStep=getYAxisStep(maxRevenue);
 const revenueYaxisMax=Math.ceil(maxRevenue / revenueStep) * revenueStep
 const revenueYaxisTicks=Array.from(
  { length: revenueYaxisMax / revenueStep + 1 },
  (_, i) => i * revenueStep
)




  //month wise revenue to show in the graph
 const getLastNMonths = (n) => {
  const months = []

  for (let i = n - 1; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)

    months.push({
      label: date.toLocaleString("en-US", { month: "short" }),
      month: date.getMonth(),
      year: date.getFullYear(),
    })
  }

  return months
}

const getRollingRevenueData = (payments, monthsCount = 6) => {
  const months = getLastNMonths(monthsCount)

  return months.map(({ label, month, year }) => {
    const revenue = payments.reduce((sum, payment) => {
      if (payment.status !== "success") return sum

      const date = new Date(payment.createdAt)

      if (
        date.getMonth() === month &&
        date.getFullYear() === year
      ) {
        return sum + payment.amount
      }

      return sum
    }, 0)

    return {
      month: label,
      revenue,
    }
  })
}


// user growth for the charts

const getUserGrowthData = (users, year = new Date().getFullYear()) => {
  return MONTHS.map((month, index) => {
    const monthStart = new Date(year, index, 1)
    const monthEnd = new Date(year, index + 1, 0)

    const activeUsers = users.filter(user => {
      if (!user.subscriptionStartDate || !user.subscriptionEndDate) return false

      const start = new Date(user.subscriptionStartDate)
      const end = new Date(user.subscriptionEndDate)

      return start <= monthEnd && end >= monthStart
    }).length

    return {
      month,
      users: activeUsers,
    }
  })
}
const getMonthRange = (year: number, month: number) => {
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);
  return { start, end };
};


  const[bottomCardStats,setBottomCardStats]=useState({
           monthlyRecurringRevenue:0,
           activeSubscriberCount:0,
           avgRevenuePereUser:0,
           platformGrowthPercentage:0
     })
    
  const[userTabCardStats,setUserTabCardStats]=useState({
    totalUsers:0,
    increaseCount:0,
    userRetentionPercentage:0,
    increasedUserRetentionPercentage:0,
    newUsersCountInThisMonth:0,
    increasedNewUsersCountThanLastMonth:0,
  })

  const loadData=async ()=>{
    setResLoading(true);
    setFailed(false);
    try{
      const[usersRes,paymentRes,categoriesRes,requirementsRes,providersRes,reviewRes]=await Promise.all([
        authFetch("/api/users"),
        authFetch("/api/payment"),
        authFetch("/api/service-categories"),
        authFetch("/api/requirements"),
        authFetch("/api/providers"),
        authFetch("/api/reviews")
      ])
      if(!usersRes.ok || !paymentRes.ok || !categoriesRes || !requirementsRes) throw new Error();
      const userData=await usersRes.json();
      const  paymentData=await paymentRes.json();

      setUsers(userData.users.filter((e)=>e.role!=="admin"));
      setRevenue(paymentData?.data);

      const totalRevenue = getTotalRevenue(paymentData.data)
      const currentMonthRevenue = getMonthlyRevenue(paymentData.data, 0)
      const lastMonthRevenue = getMonthlyRevenue(paymentData.data, 1)

      const revenueGrowthPercentage =
        lastMonthRevenue === 0
          ? 100
          : ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100

      const activeUsersCount = getActiveUsersCount(userData.users)

      const currentActiveUsers = getActiveUsersByMonth(userData.users, 0)
      const lastMonthActiveUsers = getActiveUsersByMonth(userData.users, 1)

      const activeUsersGrowth =
        lastMonthActiveUsers === 0
          ? 100
          : ((currentActiveUsers - lastMonthActiveUsers) / lastMonthActiveUsers) * 100

      setTopCardStats({
        totalRevenue:totalRevenue,
        lastMonthRevenuePercentage:revenueGrowthPercentage,
        activeUsers:activeUsersCount,
        lastMonthActiveUsersPercentage:activeUsersGrowth
      })

      //Bottom card stats

      //botom cards stats
          const currentMRR = getCurrentMonthMRR(paymentData.data)
          const arpu = getARPU(paymentData.data)
          const growth=lastMonthRevenue>0?((currentMonthRevenue- lastMonthRevenue) /lastMonthRevenue) * 100:0
          setBottomCardStats({
            monthlyRecurringRevenue:currentMRR,
            activeSubscriberCount:userData.users.filter((eachItem)=>eachItem. subscriptionPlanId).length,
            avgRevenuePereUser:arpu,
            platformGrowthPercentage:growth
          })

      //Last 6 months revenue for the graph
      const last6MonthsRevenue = getRollingRevenueData(paymentData.data, 6)
      setLastSixMonthsRevenueData(last6MonthsRevenue)

      //Last 12 months revenue data for the graphs
      const last12MonthsRevenue = getRollingRevenueData(paymentData.data, 12)
      setLastTwelveMonthsRevenueData(last12MonthsRevenue);


      //active users per month for the graphs

      const userGrowthData = getUserGrowthData(userData.users)
      setDynamicUsersGrowthData(userGrowthData);

      const servicesData=await categoriesRes.json();
      setServices(servicesData.data);

      const requirementsData=await requirementsRes.json();
      setRequirements(requirementsData.requirements);

      const providersData=await providersRes.json();
      setProviders(providersData.providers);

      const reviewsData=await reviewRes.json();
      setReviews(reviewsData.reviews);
      



    }catch(error){
      console.log('Failed to fetch the data:::',error)
    }finally{
      setResLoading(false);
    }
  }
  useEffect(()=>{
    loadData()
  },[])

  //this is for calucltaing the stats values in the user tab for the cards
  useEffect(() => {
  if (!users || users.length === 0) return;

  const now = new Date();

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const lastMonthDate = new Date(currentYear, currentMonth - 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  const { start: currStart, end: currEnd } =
    getMonthRange(currentYear, currentMonth);

  const { start: lastStart, end: lastEnd } =
    getMonthRange(lastMonthYear, lastMonth);

  // ---------------- TOTAL USERS ----------------
  const totalUsers = users.length;

  // ---------------- NEW USERS ----------------
  const currentMonthNewUsers = users.filter((u: any) => {
    const createdAt = new Date(u.createdAt);
    return createdAt >= currStart && createdAt <= currEnd;
  });

  const lastMonthNewUsers = users.filter((u: any) => {
    const createdAt = new Date(u.createdAt);
    return createdAt >= lastStart && createdAt <= lastEnd;
  });

  const newUsersCountInThisMonth = currentMonthNewUsers.length;
  const increasedNewUsersCountThanLastMonth =
    newUsersCountInThisMonth - lastMonthNewUsers.length;

  // ---------------- SUBSCRIBERS LAST MONTH ----------------
  const lastMonthSubscribers = users.filter((u: any) => {
    if (!u.subscriptionStartDate || !u.subscriptionEndDate) return false;

    const start = new Date(u.subscriptionStartDate);
    const end = new Date(u.subscriptionEndDate);

    return start <= lastEnd && end >= lastStart;
  });

  // ---------------- RETAINED THIS MONTH ----------------
  const retainedSubscribers = lastMonthSubscribers.filter((u: any) => {
    const end = new Date(u.subscriptionEndDate);
    return end >= currStart;
  });

  const userRetentionPercentage =
    lastMonthSubscribers.length === 0
      ? 0
      : Math.round(
          (retainedSubscribers.length / lastMonthSubscribers.length) * 100
        );

  // ---------------- LAST MONTH RETENTION (FOR COMPARISON) ----------------
  const prevMonthDate = new Date(lastMonthYear, lastMonth - 1);
  const { start: prevStart, end: prevEnd } = getMonthRange(
    prevMonthDate.getFullYear(),
    prevMonthDate.getMonth()
  );

  const prevMonthSubscribers = users.filter((u: any) => {
    if (!u.subscriptionStartDate || !u.subscriptionEndDate) return false;

    const start = new Date(u.subscriptionStartDate);
    const end = new Date(u.subscriptionEndDate);

    return start <= prevEnd && end >= prevStart;
  });

  const prevMonthRetained = prevMonthSubscribers.filter((u: any) => {
    const end = new Date(u.subscriptionEndDate);
    return end >= lastStart;
  });

  const lastMonthRetentionPercentage =
    prevMonthSubscribers.length === 0
      ? 0
      : Math.round(
          (prevMonthRetained.length / prevMonthSubscribers.length) * 100
        );

  const increasedUserRetentionPercentage =
    userRetentionPercentage - lastMonthRetentionPercentage;

  // ---------------- SET STATE ----------------
  setUserTabCardStats({
    totalUsers,
    increaseCount: increasedNewUsersCountThanLastMonth,
    userRetentionPercentage,
    increasedUserRetentionPercentage,
    newUsersCountInThisMonth,
    increasedNewUsersCountThanLastMonth,
  });
}, [users]);
 // this is for the graph user growth
useEffect(() => {
  if (!users || users.length === 0) return;

  const now = new Date();
  const growthData: { month: string; users: number }[] = [];

  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);

    const monthStart = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth(),
      1
    );

    const monthEnd = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );

    const usersCount = users.filter((u: any) => {
      const createdAt = new Date(u.createdAt);
      return createdAt >= monthStart && createdAt <= monthEnd;
    }).length;

    growthData.push({
      month: formatMonthYear(monthDate),
      users: usersCount,
    });
  }

  setUserGrowthData(growthData);
}, [users]);

//this is for caluclating the topcards last stats
useEffect(() => {
  if (!users.length) return;

  const now = new Date();

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const lastMonthDate = new Date(currentYear, currentMonth - 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  let currentMonthFreeTrial = 0;
  let lastMonthFreeTrial = 0;

  let currentMonthExpired = 0;
  let lastMonthExpired = 0;

  users.forEach(user => {
    const createdAt = new Date(user.createdAt);

    const isCurrentMonth =
      createdAt.getMonth() === currentMonth &&
      createdAt.getFullYear() === currentYear;

    const isLastMonth =
      createdAt.getMonth() === lastMonth &&
      createdAt.getFullYear() === lastMonthYear;

    const hasSubscription =
      user.subscriptionStartDate && user.subscriptionEndDate;

    const isExpired =
      hasSubscription &&
      new Date(user.subscriptionEndDate) < now;

    // 🟡 Free trial users
    if (!hasSubscription) {
      if (isCurrentMonth) currentMonthFreeTrial++;
      if (isLastMonth) lastMonthFreeTrial++;
    }

    // 🔴 Plan expired users
    if (isExpired) {
      if (isCurrentMonth) currentMonthExpired++;
      if (isLastMonth) lastMonthExpired++;
    }
  });

  const calcPercentage = (current: number, last: number) => {
    if (last === 0) return current > 0 ? 100 : 0;
    return Number((((current - last) / last) * 100).toFixed(2));
  };

  setTopLastTwoCardStats({
    freeTrailUserCount: currentMonthFreeTrial,
    incFreeTrailUserCountPercentageThanLastMonth: calcPercentage(
      currentMonthFreeTrial,
      lastMonthFreeTrial
    ),
    planExpiredUsersCount: currentMonthExpired,
    incPercentagePlanExpiredUsersThanLatMonth: calcPercentage(
      currentMonthExpired,
      lastMonthExpired
    ),
  });
}, [users]);

// to caaluclate top stats cards in the service tab page
useEffect(() => {
  if (!services.length && !requirements.length && !providers.length) return;

  const now = new Date();

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const lastMonthDate = new Date(currentYear, currentMonth - 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastMonthYear = lastMonthDate.getFullYear();

  /* =========================
     TOTAL SERVICES
  ========================= */
  const totalServices = services.reduce((count: number, service: any) => {
    service.children?.forEach((child: any) => {
      count += child.items?.length || 0;
    });
    return count;
  }, 0);

  /* =========================
      PROJECT COMPLETION %
     COMPLETION GROWTH %
  ========================= */
  let totalProjects = 0;
  let closedProjects = 0;

  let currentMonthClosed = 0;
  let lastMonthClosed = 0;

  requirements.forEach((req: any) => {
    totalProjects++;

    const createdAt = new Date(req.createdAt);
    const isClosed = req.status === "Closed";

    if (isClosed) {
      closedProjects++;

      if (
        createdAt.getMonth() === currentMonth &&
        createdAt.getFullYear() === currentYear
      ) {
        currentMonthClosed++;
      }

      if (
        createdAt.getMonth() === lastMonth &&
        createdAt.getFullYear() === lastMonthYear
      ) {
        lastMonthClosed++;
      }
    }
  });

  const projectCompletionPercentage =
    totalProjects === 0
      ? 0
      : Number(((closedProjects / totalProjects) * 100).toFixed(2));

  const incPercentageCompletionProjects =
    lastMonthClosed === 0
      ? currentMonthClosed > 0
        ? 100
        : 0
      : Number(
          (
            ((currentMonthClosed - lastMonthClosed) / lastMonthClosed) *
            100
          ).toFixed(2)
        );

  /* =========================
      AVG RATING
      RATING COUNT
  ========================= */
  let totalRating = 0;
  let ratingCount = 0;

  providers.forEach((provider: any) => {
    if (typeof provider.rating === "number" && provider.rating > 0) {
      totalRating += provider.rating;
      ratingCount++;
    }
  });

  const avgRating =
    ratingCount === 0
      ? 0
      : Number((totalRating / ratingCount).toFixed(1));

  /* =========================
     SET FINAL STATE
  ========================= */
  setServiceTabTopCardStats({
    totalServices,
    projectCompletionPercentage,
    incPercentageCompletionProjects,
    avgRating,
    ratingFromAgenciesCount: ratingCount,
  });
}, [services, requirements, providers]);


const getTopCategories = (reviews) => {
  const categoryMap = {};

  reviews.forEach((review) => {
    const category = review?.project?.category;
    const title = review?.project?.title;
    const rating = review?.rating;

    if (!category || rating == null) return;

    if (!categoryMap[category]) {
      categoryMap[category] = {
        category,
        count: 0,
        totalRating: 0,
        highestRatedProject: {
          title,
          rating,
        },
      };
    }

    categoryMap[category].count += 1;
    categoryMap[category].totalRating += rating;

    // Track highest-rated project per category
    if (rating > categoryMap[category].highestRatedProject.rating) {
      categoryMap[category].highestRatedProject = {
        title,
        rating,
      };
    }
  });

  return Object.values(categoryMap)
    .map((cat) => ({
      category: cat.category,
      count: cat.count,
      rating: Number((cat.totalRating / cat.count).toFixed(1)),
      projectTitle: cat.highestRatedProject.title,
    }))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);
};
useEffect(() => {
  if ((reviews || []).length > 0) {
    console.log('Entered to reviews if block')
    const result = getTopCategories(reviews);
    setTopCategories(result);
  }
}, [reviews]);


// to caluclate the top 5 agencies for the graph
useEffect(() => {
  if (!providers || providers.length === 0) return;

  const topFive = [...providers]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 5)
    .map((provider) => ({
      name: provider.name,
      reviewCount: provider.reviewCount,
      rating: provider.rating,
    }));

  setTopFiveAgencies(topFive);
}, [providers]);

const buildAgencyChartData = (agencies) => {
  return agencies.map((a) => ({
    agency: a.name,
   value: a.reviewCount === 0 ? 0.1 : a.reviewCount,
    rating: a.rating,
  }));
};

useEffect(() => {
  if (!topFiveAgencies.length) return;

  setChartData(buildAgencyChartData(topFiveAgencies));
}, [topFiveAgencies]);



console.log("top agencies::::",topFiveAgencies);

  const getTotalRevenue = (payments) => {
  return payments
    .filter(p => p.status === "success")
    .reduce((sum, p) => sum + p.amount, 0)
}

const getMonthlyRevenue = (payments, monthOffset = 0) => {
  const date = new Date()
  date.setMonth(date.getMonth() - monthOffset)

  const targetMonth = date.getMonth()
  const targetYear = date.getFullYear()

  return payments
    .filter(p =>
      p.status === "success" &&
      new Date(p.createdAt).getMonth() === targetMonth &&
      new Date(p.createdAt).getFullYear() === targetYear
    )
    .reduce((sum, p) => sum + p.amount, 0)
}

const getActiveUsersCount = (users) => {
  const today = new Date()

  return users.filter(user =>
    user.subscriptionPlanId &&
    user.subscriptionEndDate &&
    new Date(user.subscriptionEndDate) >= today
  ).length
}

const getActiveUsersByMonth = (users, monthOffset = 0) => {
  const date = new Date()
  date.setMonth(date.getMonth() - monthOffset)

  const month = date.getMonth()
  const year = date.getFullYear()

  return users.filter(user => {
    if (!user.subscriptionStartDate || !user.subscriptionEndDate) return false

    const start = new Date(user.subscriptionStartDate)
    const end = new Date(user.subscriptionEndDate)

    return (
      start.getMonth() <= month &&
      end.getMonth() >= month &&
      start.getFullYear() <= year &&
      end.getFullYear() >= year
    )
  }).length
}

//monthly recursiing revenue
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
// average revenuw per head
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
    : totalRevenue / uniqueUsers.size
}

  const handleExport = () => {
    switch (activeTab) {
      case "Revenue":
        exportToCSV("revenue-report.csv", revenueTrendData)
        break

      case "Users":
        exportToCSV("users-report.csv", userGrowthData)
        break

      case "Services":
        exportToCSV(
          "services-report.csv",
          topServices.map((s) => ({
            Service: s.name,
            Category: s.category,
            Orders: s.orders,
            Revenue: s.revenue,
            Rating: s.rating,
          }))
        )
        break

      case "Overview":
      default:
        exportToCSV("overview-report.csv", [
          {
            Metric: "Total Revenue",
            Value: "$45,231.89",
          },
          {
            Metric: "Active Users",
            Value: "234",
          },
          {
            Metric: "Services Completed",
            Value: "03",
          },
          {
            Metric: "Avg Response Time",
            Value: "$23,700",
          },
        ])
        break
    }
  }

  if(resLoading){
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* ---------- Header ---------- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-gray-500">
            Comprehensive insights into platform performance
          </p>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleExport}
                className="bg-[#FF0000] hover:bg-red-600 rounded-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </TooltipTrigger>

            <TooltipContent side="bottom">
              <p>Export tab based data</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

      </div>
      {/* Top KPIs */}
      {/* <RevenueKPIs /> */}

      {/**top status cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        title="Total Revenue"
        value={topCardStats.totalRevenue.toString()}
        subtitle={`${topCardStats.lastMonthRevenuePercentage.toFixed(2).toString()}% from last month`}
      />
      <KPICard
        title="Active Users"
        value={topCardStats.activeUsers.toString()}
        subtitle={`${topCardStats.lastMonthActiveUsersPercentage.toFixed().toString()}% from last month`}
      />
      <KPICard
        title="Free Trail Users"
        value={topLastTwoCardStats.freeTrailUserCount.toString()}
        subtitle={`${topLastTwoCardStats.incFreeTrailUserCountPercentageThanLastMonth}% from last month`}
      />
      <KPICard
        title="Plan Expired Users"
        value={topLastTwoCardStats.planExpiredUsersCount.toString()}
        subtitle={`${topLastTwoCardStats.incPercentagePlanExpiredUsersThanLatMonth}% improvement`}
      />
    </div>

      {/* ---------- Tabs ---------- */}
      <div className="bg-gray-100 rounded-full p-1 flex w-fit">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "px-6 py-2 rounded-full text-sm font-medium transition",
              activeTab === tab
                ? "bg-orange-500 text-white shadow"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ---------- Tab Content ---------- */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Overview */}
          <ChartCard
            title="Revenue Overview"
            subtitle="Monthly revenue trends for the last 6 months"
          >
             <RevenueChart revenueData={lastSixMonthsRevenueData} yAxisMax={revenueYaxisMax} yAxisTicks={revenueYaxisTicks}/>
          </ChartCard>

          {/* User Growth */}
          <ChartCard
            title="User Growth"
            subtitle="Active users growth over time"
          >
            <UserGrowthChart userData={dynamicUsersGrowthData} yAxisMax={yAxisMax} yAxisTicks={yAxisTicks}/>
          </ChartCard>
        </div>
      )}

      {activeTab === "Revenue" && (
        <div className="space-y-8">
          {/* Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-orange-500">
              Revenue Trends
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Detailed revenue analysis over the past 12 months
            </p>
            <RevenueTrendChart lastTweleveMonthsRevenue={lastTwelevMonthsRevenueData}/>
          </div>
        </div>
      )}

      {activeTab === "Users" && (
        <div className="space-y-8">
          {/* Top KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <KPICard title="Total Users" value={userTabCardStats.totalUsers.toString()} subtitle={`${userTabCardStats.increaseCount} this month`} />
              <KPICard title="User Retention Rate" value={`${userTabCardStats.userRetentionPercentage.toFixed(1).toString()}%`} subtitle={`${userTabCardStats.increasedUserRetentionPercentage}% last month`} />
              <KPICard title="New User Signups" value={userTabCardStats.newUsersCountInThisMonth.toString()} subtitle={`${userTabCardStats.increasedNewUsersCountThanLastMonth} this month`} />
              {/* <KPICard title="Active Sessions" value="3,421" subtitle="Currently Active" /> */}

          </div>

          {/* User Growth Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-orange-500">
              User Growth Analytics
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Track user acquisition and trends report
            </p>
            <UserGrowthChart2 userGrowthData={userGrowthData} />
          </div>
        </div>
      )}


      {activeTab === "Services" && (
        <div className="space-y-8">
          {/* Top KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KpiCard
                title="Total Services"
                value={serviceTabTopCardStats.totalServices.toString()}
                subtitle="Across all categories"
              />
              {/* <KpiCard
                title="Completion Rate"
                value={`${serviceTabTopCardStats.projectCompletionPercentage}%`}
                subtitle={`${serviceTabTopCardStats.incPercentageCompletionProjects}% last month`}
                positive
              /> */}
              <KpiCard
                title="Avg Rating"
                value={`${serviceTabTopCardStats.avgRating} / 5.0`}
                subtitle={`From ${serviceTabTopCardStats.ratingFromAgenciesCount} users`}
              />
            </div>

          {/* Main Content */}
          <div className="flex flex-row gap-6">
            {/* Chart */}
            <div className=" bg-white rounded-2xl p-6 shadow-sm w-full">
              <h3 className="text-lg font-semibold text-orange-500">
                Agency Performance
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Track service usage and performance
              </p>
              <AgencyPerformanceChart topAgencies={chartData} />
            </div>
            <div className="w-full">
              {/* Table */}
              <TopServicesTable categories={topCategories} /></div>
          </div>
        </div>
      )}


      {/* Bottom Metrics */}
      {/* <RevenueSummaryCards /> */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard
        title="Monthly Recurring Revenue"
        value={bottomCardStats.monthlyRecurringRevenue.toFixed(2).toString()}
        subtitle={`From ${bottomCardStats.activeSubscriberCount} active subscriptions`}
        icon="/images/admin-monthlyRevenue.png"
      />
      <SummaryCard
        title="Average Revenue Per User"
        value={bottomCardStats.avgRevenuePereUser.toFixed(2).toString()}
        subtitle="Per paying user"
        icon="/images/admin-user.png"
      />
      <SummaryCard
        title="Platform Growth"
        value={`${bottomCardStats.platformGrowthPercentage.toFixed(2).toString()}%`}
        subtitle="Month over month growth"
        icon="/images/admin-monthlyRevenue.png"
      />
    </div>
  </div>
  )
}

/* ---------------- Chart Cards ---------------- */
function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-orange-500">
        {title}
      </h3>
      {subtitle && (
        <p className="text-sm text-gray-500 mb-4">{subtitle}</p>
      )}
      {children}
    </div>
  )
}

/* ---------------- Revenue Chart ---------------- */
function RevenueChart({revenueData,yAxisMax,yAxisTicks}) {
  return (
    <ChartContainer
      config={{
        revenue: {
          label: "Revenue",
        },
      }}
      className="h-64"
    >
      <BarChart data={revenueData} barCategoryGap={20}>
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="-13.56%" stopColor="#FD749B" />
            <stop offset="158.3%" stopColor="#281AC8" />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "#858585", fontSize: 10, className: "text-gray-300" }}
          axisLine={true}
          tickLine={false}
        />

        <YAxis
        domain={[0, yAxisMax]}
        ticks={yAxisTicks}
        allowDecimals={false}
        tick={{ fill: "#858585", fontSize: 10 }}
        axisLine={true}
        tickLine={false}
      />
        <ChartTooltip content={<ChartTooltipContent />} />

        <Bar
          dataKey="revenue"
          fill="url(#revenueGradient)"
          radius={[10, 10, 0, 0]}
          barSize={8}   // 👈 decreases bar width
        />
      </BarChart>
    </ChartContainer>
  )
}


/* ---------------- User Growth Chart ---------------- */
function UserGrowthChart({userData,yAxisMax,yAxisTicks}) {
  return (
    <ChartContainer
      config={{
        users: {
          label: "Users",
        },
      }}
      className="h-64"
    >
      <BarChart data={userData} barCategoryGap={20}>
        <defs>
          <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="-13.56%" stopColor="#FD749B" />
            <stop offset="158.3%" stopColor="#281AC8" />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: "#858585", fontSize: 10, className: "text-gray-300" }}
          axisLine={true}
          tickLine={false}
        />

       <YAxis
        domain={[0, yAxisMax]}
        ticks={yAxisTicks}
        allowDecimals={false}
        tick={{ fill: "#858585", fontSize: 10 }}
        axisLine={true}
        tickLine={false}
      />


        <ChartTooltip content={<ChartTooltipContent />} />

        <Bar
          dataKey="users"
          fill="url(#userGradient)"
          radius={[10, 10, 0, 0]}
          barSize={8}   // 👈 slimmer bars
        />
      </BarChart>
    </ChartContainer>
  )
}
function UserGrowthChart2({userGrowthData}) {
  return (
    <ChartContainer
      className="h-72 w-full"
      config={{ users: { label: "Users" } }}
    >
      <LineChart data={userGrowthData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        <XAxis
          dataKey="month"
          axisLine
          tickLine={false}
          tick={{ fill: "#9CA3AF", fontSize: 10 }}
        />

        <YAxis
          axisLine
          tickLine={false}
          tick={{ fill: "#9CA3AF", fontSize: 10 }}
        />

        <ChartTooltip content={<ChartTooltipContent />} />

        <Line
          type="monotone"
          dataKey="users"
          stroke="#F43F5E"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ChartContainer>
  )
}

