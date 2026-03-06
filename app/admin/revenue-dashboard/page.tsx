"use client";

import { useState, useEffect } from "react";
import { IoMdTrendingUp } from "react-icons/io";
import { RiExchangeDollarFill } from "react-icons/ri";
import { FaArrowUpLong } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { mockSubscriptionStats } from "@/lib/mock-data";
import {
  BarChart,
  AreaChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Legend,
  Cell,
} from "recharts";
import { DollarSign, TrendingUp, PieChart, Filter } from "lucide-react";
import { User } from "@/lib/types";
import { authFetch } from "@/lib/auth-fetch";

// -------------------------------------------------
// MOCK DATA (Replace with API later)
// -------------------------------------------------
const mockRevenueByPlan = [
  { plan: "Starter", enterprise: 83.54, revenue: 69.58 },
  { plan: "Professional", enterprise: 65.33, revenue: 78.82 },
  { plan: "Enterprise", enterprise: 74.15, revenue: 70.32 },
];

const pieData = [
  { name: "Subscription Revenue", value: 151.48, color: "#8b7cfb" },
  { name: "Usage-Based Fees", value: 65.55, color: "#ff9c8a" },
  { name: "Premium Features", value: 162.51, color: "#3ec1d3" },
  { name: "Integration Fees", value: 64.31, color: "#ffb84d" },
];


const mrrTrend = [
  { month: "Jan", value: 190, scatter: 70 },
  { month: "Feb", value: 120, scatter: 65 },
  { month: "Mar", value: 195, scatter: 85 },
  { month: "Apr", value: 130, scatter: 90 },
  { month: "May", value: 165, scatter: 60 },
  { month: "Jun", value: 110, scatter: 55 },
];

const COLORS = [
  "#60a5fa", // blue
  "#34d399", // green
  "#fbbf24", // yellow
  "#f472b6", // pink
  "#a78bfa", // purple
  "#fb7185", // rose
  "#38bdf8", // sky
  "#4ade80", // emerald
];


export default function RevenueDashboardPage() {

  const [filterOpen, setFilterOpen] = useState(false);

const [dateFilter, setDateFilter] = useState({
  year: "",
  month: "",
  from: "",
  to: "",
});
  const [stats, setStats] = useState(mockSubscriptionStats);
  const [history, setHistory] = useState(null);
  const [planRevenue, setPlanRevenue] = useState(mockRevenueByPlan);
  

  const[resLoading,setResLoading]=useState(false);
  const[failed,setFailed]=useState(false)

  const[users,setUsers]=useState<User[]>([]);
  const[revenue,setRevenue]=useState([]);
  const[subsriptions,setSubscriptions]=useState([])

  const [topCardStats, setTopCardStats] = useState({
  currentMonthRecurringRevenue: 0,
  recurringRevenuePercentageIncLastMonth: 0,
  annualRevenue: 0,
  annualRevenuePercentageIncLastYear: 0,
  atterationRate: 0,
  atterationRatePercentageInc: 0,
});

  const[monthlyRcurringRevenueGrowth,setMonthlyRcurringRevenueGrowth]=useState<{
    month:string,
    revenue:number
  }[]>([])

 const [revenueByPlan, setRevenueByPlan] = useState<{
  plan: string;
  revenue: number;
}[]>([]);


   const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

   const loadData=async ()=>{
      setResLoading(true);
      setFailed(false);
      try{
        const[usersRes,paymentRes,subscriptionRes]=await Promise.all([
          authFetch("/api/users"),
          authFetch("/api/payment"),
          authFetch("/api/subscription")
        ])
        if(!usersRes.ok || !paymentRes.ok) throw new Error();
        const userData=await usersRes.json();
        const  paymentData=await paymentRes.json();
        const subscriptionData=await subscriptionRes.json();
  
        setUsers(userData.users);
        setRevenue(paymentData?.data);
        setSubscriptions(subscriptionData);
   
  
      }catch(error){
        console.log('Failed to fetch the data:::',error)
      }finally{
        setResLoading(false);
      }
    }

    const getFilteredRevenue = () => {
  if (!revenue.length) return [];

  return revenue.filter((payment: any) => {
    const d = new Date(payment.createdAt);

    if (dateFilter.year && d.getFullYear() !== Number(dateFilter.year)) {
      return false;
    }

    if (dateFilter.month && d.getMonth() !== Number(dateFilter.month)) {
      return false;
    }

    if (dateFilter.from) {
      const fromDate = new Date(dateFilter.from);
      fromDate.setHours(0, 0, 0, 0);
      if (d < fromDate) return false;
    }

    if (dateFilter.to) {
      const toDate = new Date(dateFilter.to);
      toDate.setHours(23, 59, 59, 999);
      if (d > toDate) return false;
    }

    return true;
  });
};


    useEffect(()=>{
      loadData()
    },[])
    // console.log("Subscriptions :::::::::",subsriptions)

    const isSameMonth = (d1: Date, d2: Date) =>
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    const percentChange = (current: number, previous: number) => {
      if (previous === 0) return current === 0 ? 0 : 100;
      return ((current - previous) / previous)*100;
    };

    useEffect(() => {
      const now = new Date();

      const filteredRevenue = getFilteredRevenue();

const successfulPayments = filteredRevenue.filter(
  (p: any) => p.status === "success"
);

      // ---------- MRR ----------
      const currentMonthRevenue = successfulPayments
        .filter((p: any) => isSameMonth(new Date(p.createdAt), now))
        .reduce((sum: number, p: any) => sum + p.amount, 0);

      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const lastMonthRevenue = successfulPayments
        .filter((p: any) => isSameMonth(new Date(p.createdAt), lastMonth))
        .reduce((sum: number, p: any) => sum + p.amount, 0);

      const mrrGrowth = percentChange(currentMonthRevenue, lastMonthRevenue);

      // ---------- Annual Revenue ----------
      const last12MonthsRevenue = successfulPayments
        .filter((p: any) => {
          const d = new Date(p.createdAt);
          return d >= new Date(now.getFullYear() - 1, now.getMonth(), 1);
        })
        .reduce((sum: number, p: any) => sum + p.amount, 0);

      const prev12MonthsRevenue = successfulPayments
        .filter((p: any) => {
          const d = new Date(p.createdAt);
          return (
            d >= new Date(now.getFullYear() - 2, now.getMonth(), 1) &&
            d < new Date(now.getFullYear() - 1, now.getMonth(), 1)
          );
        })
        .reduce((sum: number, p: any) => sum + p.amount, 0);

      const annualGrowth = percentChange(
        last12MonthsRevenue,
        prev12MonthsRevenue
      );

      // ---------- Attrition (Churn) ----------
        const subscribedUsers = users.filter(
          (u) => u.subscriptionPlanId
        );

        const activeSubscribers = subscribedUsers.filter(
          (u) => u.subscriptionEndDate && new Date(u.subscriptionEndDate) > now
        );

        const retentionRate =
          subscribedUsers.length === 0
            ? 0
            : (activeSubscribers.length / subscribedUsers.length) * 100;

        const currentAttritionRate = 100 - retentionRate;

        // last month attrition
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const lastMonthActive = subscribedUsers.filter(
          (u) =>
            u.subscriptionEndDate &&
            new Date(u.subscriptionEndDate) > lastMonthDate
        );

        const lastMonthRetention =
          subscribedUsers.length === 0
            ? 0
            : (lastMonthActive.length / subscribedUsers.length) * 100;

        const lastMonthAttritionRate = 100 - lastMonthRetention;

        const attritionGrowth = percentChange(
          currentAttritionRate,
          lastMonthAttritionRate
        );

      // ---------- Set state ----------
     setTopCardStats({
      currentMonthRecurringRevenue: currentMonthRevenue,
      recurringRevenuePercentageIncLastMonth: Number(mrrGrowth.toFixed(2)),
      annualRevenue: last12MonthsRevenue,
      annualRevenuePercentageIncLastYear: Number(annualGrowth.toFixed(2)),
      atterationRate: Number(currentAttritionRate.toFixed(2)),
      atterationRatePercentageInc: Number(attritionGrowth.toFixed(2)),
    });

    }, [users, revenue, dateFilter]);


    //last 6 months data for graph MRR
    useEffect(() => {
        const now = new Date();

        // Step 1: create last 6 months buckets
        const last6Months = Array.from({ length: 6 }).map((_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
          return {
            monthIndex: d.getMonth(),
            year: d.getFullYear(),
            month: MONTHS[d.getMonth()],
            revenue: 0,
          };
        });

        // Step 2: accumulate revenue
       getFilteredRevenue().forEach((payment: any) => {
          if (payment.status !== "success") return;

          const d = new Date(payment.createdAt);

          last6Months.forEach((m) => {
            if (d.getMonth() === m.monthIndex && d.getFullYear() === m.year) {
              m.revenue += payment.amount;
            }
          });
        });

        // Step 3: format for chart
        setMonthlyRcurringRevenueGrowth(
          last6Months.map(({ month, revenue }) => ({
            month,
            revenue,
          }))
        );
      }, [revenue, dateFilter]);

    //Revenue by plan
    useEffect(() => {
  if (!revenue.length || !subsriptions.length) return;

  // 1️⃣ Initialize revenue map for each subscription
  const revenueMap: Record<string, number> = {};

  subsriptions.forEach((sub: any) => {
    revenueMap[sub._id] = 0;
  });

  // 2️⃣ Accumulate successful payments
  getFilteredRevenue().forEach((payment: any) => {
    if (payment.status !== "success") return;

    const planId = payment.planId;

    if (revenueMap[planId] !== undefined) {
      revenueMap[planId] += payment.amount;
    }
  });

  // 3️⃣ Format for charts / UI
  const formatted = subsriptions.map((sub: any) => ({
    plan: sub.title,                // ✅ correct field
    revenue: revenueMap[sub._id] || 0,
  }));

  setRevenueByPlan(formatted);
}, [revenue, subsriptions, dateFilter]);




    console.log("Top Card STats::::::",topCardStats)

    const isActiveSubscription = (endDate?: Date) => {
      if (!endDate) return false;
      return new Date(endDate) >= new Date();
    };


type PlanActiveCount = {
  planId: string;
  planName: string;
  activeUsers: number;
};


const getActiveUsersByPlan = (
  users: User[],
  plans: any[]
): {
  planWiseActive: PlanActiveCount[];
  freeTrialUsers: number;
} => {
  console.log("users::::::::",users)
  const planMap: Record<string, PlanActiveCount> = {};
  let freeTrialUsers = 0;

  // initialize plans
  plans.forEach(plan => {
    planMap[plan._id] = {
      planId: plan._id,
      planName: plan.title,
      activeUsers: 0,
    };
  });

  users.forEach(user => {
    // 🆓 free trial
    if (!user.subscriptionPlanId) {
      freeTrialUsers++;
      return;
    }

    // paid user
    if (isActiveSubscription(user.subscriptionEndDate)) {
      const planId = String(user.subscriptionPlanId._id);
      if (planMap[planId]) {
        planMap[planId].activeUsers++;
      }
    }
  });

  return {
    planWiseActive: Object.values(planMap),
    freeTrialUsers,
  };
};

const { planWiseActive, freeTrialUsers } = getActiveUsersByPlan(users.filter((e)=>e.role==="agency"), subsriptions);

const PALETTE = [
  "#FFAE4C", "#8979FF", "#FF928A",
  "#3CC3DF","#8979FF"
];

const pieData = [
  ...planWiseActive.map((p, index) => ({
    name: p.planName,
    value: p.activeUsers,
    color: PALETTE[index],
  })),
  {
    name: "Free Trial",
    value: freeTrialUsers,
    color: "#9CA3AF",
  },
];

console.log("Caluclated pie data is::::::",pieData)




  /*
  
  ------------------------------------------------- 
  OPTIONAL: Fetch Real Revenue Data from Backend
  -------------------------------------------------
  useEffect(() => {
    async function loadRevenue() {
      const res = await fetch("/api/admin/revenue-dashboard");
      const data = await res.json();
      setStats(data.stats);
      setHistory(data.history);
      setPlanRevenue(data.planRevenue);
    }
    loadRevenue();
  }, []);
  */

   if(resLoading){
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ---------------- HEADER ---------------- */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-orangeButton my-custom-class">
            Revenue & Analytics
          </h1>
          <p className="text-gray-500 max-w-2xl">
            Track revenue metrics, customer analytics, and market insights for
            your B2B sharing platform
          </p>
        </div>

        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center cursor-pointer gap-2 bg-black text-white px-5 py-2 rounded-full text-sm"
        >
          <Filter className="w-4 h-4" />
          Filter by Date
        </button>
      </div>

      {filterOpen && (
  <div className="bg-white border rounded-2xl p-4 shadow-md flex flex-wrap gap-4 items-end">
    
    {/* Year */}
    <div>
      <label className="text-xs text-gray-500">Year</label>
      <select
        className="border rounded px-2 py-1"
        onChange={(e) =>
          setDateFilter({ ...dateFilter, year: e.target.value })
        }
      >
        <option value="">All</option>
        <option value="2026">2026</option>
        <option value="2025">2025</option>
        <option value="2024">2024</option>
      </select>
    </div>

    {/* Month */}
    <div>
      <label className="text-xs text-gray-500">Month</label>
      <select
        className="border rounded px-2 py-1"
        onChange={(e) =>
          setDateFilter({ ...dateFilter, month: e.target.value })
        }
      >
        <option value="">All</option>
        {MONTHS.map((m, i) => (
          <option key={m} value={i}>
            {m}
          </option>
        ))}
      </select>
    </div>

    {/* From */}
    <div>
      <label className="text-xs text-gray-500">From</label>
      <input
        type="date"
        className="border rounded px-2 py-1"
        onChange={(e) =>
          setDateFilter({ ...dateFilter, from: e.target.value })
        }
      />
    </div>

    {/* To */}
    <div>
      <label className="text-xs text-gray-500">To</label>
      <input
        type="date"
        className="border rounded px-2 py-1"
        onChange={(e) =>
          setDateFilter({ ...dateFilter, to: e.target.value })
        }
      />
    </div>

    {/* Reset */}
    <button
      onClick={() =>
        setDateFilter({ year: "", month: "", from: "", to: "" })
      }
      className="text-sm bg-gray-200 px-3 py-1 rounded"
    >
      Reset
    </button>
  </div>
)}


      {/* ---------------- KPI CARDS ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 my-custom-class gap-6">
        <KpiCard 
          title="Current MRR"
          value={topCardStats.currentMonthRecurringRevenue}
          note={`${topCardStats.recurringRevenuePercentageIncLastMonth}% from last month`}
          noteColor={topCardStats.recurringRevenuePercentageIncLastMonth>=0?"text-green-600":"text-red-600"}
          icon={< RiExchangeDollarFill className="text-orangeButton bg-[#eef7fe]" />}
        />

        <KpiCard
          title="Annual Revenue"
          value={topCardStats.annualRevenue}
          note={`${topCardStats.annualRevenuePercentageIncLastYear}% growth YoY`}
          noteColor={topCardStats.annualRevenuePercentageIncLastYear>=0?"text-green-600":"text-red-600"}
          icon={<IoMdTrendingUp className="text-orangeButton" />}
        />

        <KpiCard
          title="Attrition rate"
          value={`${topCardStats.atterationRate} %`}
          note={`${topCardStats.atterationRatePercentageInc}% from last month`}
          noteColor={topCardStats.atterationRatePercentageInc>=0?"text-green-600":"text-red-600"}
          icon={<FaArrowUpLong className="text-green-600" />}
        />
      </div>

      {/* ---------------- MRR TREND ---------------- */}
      
      <div className="bg-white rounded-2xl p-6 shadow-md border">
  <h3 className="text-xl font-semibold text-orangeButton mb-6">
    MRR Growth Trend
  </h3>

  <div className="h-[340px]">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={monthlyRcurringRevenueGrowth}
        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
      >
        {/* Grid */}
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e5e7eb"
        />

        {/* Axes */}
        <XAxis
          dataKey="month"
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#6b7280", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip />

        {/* Gradient */}
        <defs>
          <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        {/* Main Area Line */}
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#38bdf8"
          strokeWidth={2}
          fill="url(#mrrGradient)"
          dot={{
            r: 4,
            stroke: "#38bdf8",
            strokeWidth: 2,
            fill: "#ffffff",
          }}
          activeDot={{ r: 5 }}
        />


        {/* Scatter-style dots (purple) */}
        {/* <Area
          type="monotone"
          dataKey="scatter"
          stroke="transparent"
          fill="transparent"
          dot={{
            r: 4,
            stroke: "#8b7cfb",
            strokeWidth: 2,
            fill: "#ffffff",
          }}
        /> */}
      </AreaChart>
    </ResponsiveContainer>
  </div>
</div>


      {/* ---------------- BOTTOM GRAPHS ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Plan */}
        <div className="bg-white rounded-2xl p-6 border shadow-md">
          <h3 className="text-xl font-semibold my-custom-class text-orangeButton mb-2">
            Revenue by plan
          </h3>

          <ResponsiveContainer width="100%" height={420}>
            <BarChart
              data={revenueByPlan}
              barGap={6}
              barSize={50}
              margin={{ top: 0, right: 20, left: 0, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

              <XAxis
                dataKey="plan"
                tick={{ fill: "#6b7280", fontSize: 13 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip formatter={(value) => `₹${value}`} />

              <Legend
                formatter={(value) => (
                  <span style={{ color: "#000", fontSize: "12px" }}>
                    {value}
                  </span>
                )}
              />

              {/* ✅ Single bar */}
              <Bar
                dataKey="revenue"
                name="Revenue"
                radius={[6, 6, 0, 0]}
                label={{ position: "top", fill: "#374151", fontSize: 12 }}
              >
                {revenueByPlan.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    name={entry.plan}
                  />
                ))}
              </Bar>
            </BarChart>

          </ResponsiveContainer>
        </div>


        {/* Revenue Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-md border">
          <h3 className="text-xl font-semibold my-custom-class text-orangeButton mb-6">
            Revenue by distribution
          </h3>

          <div className=" md:flex-row items-center gap-10">
            {/* PIE CHART */}
            <div className="w-full md:w-[420px] h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    stroke="none"
                    labelLine={false}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, name, value }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      return (
                        <text
                          x={x}
                          y={y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="#ffffff"
                        >
                          <tspan x={x} dy="-4" fontSize="10">
                            {name}
                          </tspan>
                          <tspan x={x} dy="18" fontSize="14" fontWeight="600">
                            {value}
                          </tspan>
                        </text>
                      );
                    }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </RePieChart>
              </ResponsiveContainer>
            </div>

            {/* LEGEND */}
            <div className="gap-2 min-w-10 grid grid-cols-2">
              {pieData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-3 text-[10px] text-gray-700 leading-sung"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---------------- KPI CARD ---------------- */
function KpiCard({ title, value, note, noteColor, icon }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md flex justify-between items-start">
      <div>
        <p className="text-black text-sm font-bold">{title}</p>
        <p className="text-3xl font-bold mt-3">{value}</p>
        <p className={`text-xs mt-1 ${noteColor}`}>{note}</p>
      </div>

      <div className="w-8 h-8 rounded-full bg-[#eef7fe] flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
}


