"use client";

import { LabelList } from "recharts";
import { ArrowRight } from "lucide-react";
import { PiUsersThreeBold } from "react-icons/pi";
import { useEffect, useState } from "react";
import { RiExchangeDollarLine } from "react-icons/ri";
import Link from "next/link";
import { LuTrendingUpDown } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  DollarSign,
  TrendingDown,
  AlertTriangle,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { authFetch } from "@/lib/auth-fetch";



const monthlyRevenue = [
  { month: "Jan", value: 0 },
  { month: "Feb", value: 0 },
  { month: "Mar", value: 0 },
  { month: "Apr", value: 0 },
  { month: "May", value: 0 },
  { month: "Jun", value: 0 },
  { month: "Jul", value: 0 },
  { month: "Aug", value: 0 },
  { month: "Sep", value: 0 },
  { month: "Oct", value: 0 },
  { month: "Nov", value: 0 },
  { month: "Dec", value: 0 },
];


const subscriberGrowth = [
  { month: "Jan", value: 0 },
  { month: "Feb", value: 0 },
  { month: "Mar", value: 0 },
  { month: "Apr", value: 0 },
  { month: "May", value: 0 },
  { month: "Jun", value: 0 },
  { month: "Jul", value: 0 },
  { month: "Aug", value: 0 },
  { month: "Sep", value: 0 },
  { month: "Oct", value: 0 },
  { month: "Nov", value: 0 },
  { month: "Dec", value: 0 },
];


const cancellations = [
  { month: "Jan", a: 47.25, b: 47.8, c: 62.75 },
  { month: "Feb", a: 72.75, b: 22.25, c: 38.13 },
  { month: "Mar", a: 81.28, b: 14.98, c: 63.62 },
  { month: "Apr", a: 34.78, b: 62.02, c: 50.75 },
  { month: "May", a: 97.04, b: 83.59, c: 23.29 },
  { month: "Jun", a: 62.48, b: 28.52, c: 61.74 },
  { month: "Jul", a: 37.7, b: 43.33, c: 80.37 },
  { month: "Aug", a: 10.33, b: 87.23, c: 18.2 },
  { month: "Sep", a: 71.6, b: 44.94, c: 59.67 },
  { month: "Oct", a: 84.82, b: 72.07, c: 57.05 },
  { month: "Nov", a: 69.89, b: 40.03, c: 64 },
  { month: "Dec", a: 71.89, b: 23.94, c: 48.68 },
];

export default function SubscribersManagementPage() {

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const [monthlyCancellationData, setMonthlyCancellationData] =
  useState(monthlyRevenue); 


const [selectedYear, setSelectedYear] = useState(currentYear);
const [monthlyRevenueData, setMonthlyRevenueData] = useState(monthlyRevenue);

const [subscriberGrowthData, setSubscriberGrowthData] =
  useState(subscriberGrowth);




  const [revenueTrend, setRevenueTrend] = 
  useState<"up" | "down" | "same">("same");


  const [stats, setStats] = useState<
    {
    title: string;
    value: string;
    sub: string;
    icon: JSX.Element;
    color?: string; 
  }[]
  >([
  {
    title: "Total Subscribers",
    value: "0",
    sub: "Loading...",
    icon: <PiUsersThreeBold className="h-4 w-4"/>,
  },
  {
    title: "Monthly Revenue",
    value: "₹0",
    sub: "Loading...",
    icon: <RiExchangeDollarLine className="h-4 w-4"/>,
  },
  {
    title: "Cancellation Rate",
    value: "0%",
    sub: "Loading...",
    icon: <LuTrendingUpDown className="h-4 w-4"/>,
  },
  {
    title: "Pending Invoices",
    value: "0",
    sub: "Loading...",
    icon: <AlertTriangle className="h-4 w-4"/>,
  },
]);

   useEffect(() => {
  const loadStats = async () => {
    try {
      const res = await authFetch("/api/users?role=agency&limit=10000");

      const data = await res.json();
      const users = data.users ?? [];

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // ✅ ACTIVE SUBSCRIBED AGENCIES
            const activeAgencies = users.filter((u: any) => {
        if (!u.subscriptionPlanId) return false;
        if (!u.subscriptionEndDate) return true;
        return new Date(u.subscriptionEndDate) > now;
      });


      const totalActiveSubscribers = activeAgencies.length;

      // ✅ NEW THIS MONTH
      const newThisMonth = activeAgencies.filter(
        (u: any) =>
          u.subscriptionStartDate &&
          new Date(u.subscriptionStartDate) >= startOfMonth
      ).length;

      /* ---------- MONTHLY REVENUE (AGENCIES WHO PAID) ---------- */

        let thisMonthRevenue = 0;
        let lastMonthRevenue = 0;

        const startOfLastMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );

        const endOfLastMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          0
        );

        // 🔥 ONLY AGENCIES
        for (const user of users) {
          const payRes = await authFetch(`/api/payment/${user._id}`);
          const payData = await payRes.json();
          const payments = payData.payments ?? [];

          thisMonthRevenue += payments
            .filter(
              (p: any) =>
                p.status === "success" &&
                new Date(p.createdAt) >= startOfMonth
            )
            .reduce((sum: number, p: any) => sum + p.amount, 0);

          lastMonthRevenue += payments
            .filter(
              (p: any) =>
                p.status === "success" &&
                new Date(p.createdAt) >= startOfLastMonth &&
                new Date(p.createdAt) <= endOfLastMonth
            )
            .reduce((sum: number, p: any) => sum + p.amount, 0);
        }

       let percent = 0;
        let trend: "up" | "down" | "same" = "same";

        if (lastMonthRevenue === 0 && thisMonthRevenue > 0) {
          // First revenue ever
          percent = 100;
          trend = "up";
        } else if (lastMonthRevenue > 0) {
          percent = Math.round(
            ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          );
          trend = percent > 0 ? "up" : percent < 0 ? "down" : "same";
        }


        if (lastMonthRevenue > 0) {
          percent = Math.round(
            ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
          );
          trend = percent > 0 ? "up" : percent < 0 ? "down" : "same";
        }

        setRevenueTrend(trend);

        /* ---------- CANCELLATION RATE (MONTHLY) ---------- */

        const cancelStartOfMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        );

        const cancelStartOfLastMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );

        const cancelEndOfLastMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          0
        );

        // cancellations
        const cancelledThisMonth = users.filter(
          (u: any) =>
            u.subscriptionEndDate &&
            new Date(u.subscriptionEndDate) >= cancelStartOfMonth
        ).length;

        const cancelledLastMonth = users.filter(
          (u: any) =>
            u.subscriptionEndDate &&
            new Date(u.subscriptionEndDate) >= cancelStartOfLastMonth &&
            new Date(u.subscriptionEndDate) <= cancelEndOfLastMonth
        ).length;

          let cancelPercent = 0;
          let cancelSub = "0%";
          let cancelColor = "text-green-600";

        // rates (based on active subscribers)
        // subscribers active at start of this month
        const activeAtStartOfThisMonth = users.filter((u: any) => {
          if (!u.subscriptionStartDate) return false;
          const start = new Date(u.subscriptionStartDate);
          return start < cancelStartOfMonth &&
            (!u.subscriptionEndDate || new Date(u.subscriptionEndDate) >= cancelStartOfMonth);
        }).length;

        // subscribers active at start of last month
        const activeAtStartOfLastMonth = users.filter((u: any) => {
          if (!u.subscriptionStartDate) return false;
          const start = new Date(u.subscriptionStartDate);
          return start < cancelStartOfLastMonth &&
            (!u.subscriptionEndDate || new Date(u.subscriptionEndDate) >= cancelStartOfLastMonth);
        }).length;

        const thisMonthCancelRate =
          activeAtStartOfThisMonth > 0
            ? Math.round((cancelledThisMonth / activeAtStartOfThisMonth) * 100)
            : 0;

        const lastMonthCancelRate =
          activeAtStartOfLastMonth > 0
            ? Math.round((cancelledLastMonth / activeAtStartOfLastMonth) * 100)
            : 0;


        //  NO cancellations last month
        if (lastMonthCancelRate === 0) {
          cancelSub = "No cancellations";
          cancelColor = "text-green-600";
        }

        //  Improved compared to last month
        else if (thisMonthCancelRate < lastMonthCancelRate) {
          cancelSub = `↓ ${lastMonthCancelRate - thisMonthCancelRate}% improved`;
          cancelColor = "text-green-600";
        }

        //  Increased compared to last month
        else if (thisMonthCancelRate > lastMonthCancelRate) {
          cancelSub = `↑ ${thisMonthCancelRate - lastMonthCancelRate}% increased`;
          cancelColor = "text-red-500";
        }

        // No change
        else {
          cancelSub = "0% change";
          cancelColor = "text-green-600";
        }

        /* ---------- PENDING INVOICES (CANCELLED USERS) ---------- */

        let pendingInvoicesCount = 0;
        let pendingInvoicesAmount = 0;

        // cancelled users (already aligned with your logic)
        const cancelledUsers = users.filter(
          (u: any) =>
            u.subscriptionEndDate &&
            new Date(u.subscriptionEndDate) < now
        );

        pendingInvoicesCount = cancelledUsers.length;

        // calculate outstanding from payments
        for (const user of cancelledUsers) {
          const payRes = await authFetch(`/api/payment/${user._id}`);
          const payData = await payRes.json();
          const payments = payData.payments ?? [];

          const lastSuccessfulPayment = payments
          .filter((p: any) => p.status === "success")
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];

        if (lastSuccessfulPayment) {
          pendingInvoicesAmount += lastSuccessfulPayment.amount;
        }

        }

        const revenueByMonth = Array(12).fill(0);

        for (const user of users) {
          const payRes = await authFetch(`/api/payment/${user._id}`);
          const payData = await payRes.json();
          const payments = payData.payments ?? [];

          payments.forEach((p: any) => {
            const d = new Date(p.createdAt);
            if (
              p.status === "success" &&
              d.getFullYear() === selectedYear
            ) {
              revenueByMonth[d.getMonth()] += p.amount;
            }
          });
        }

        const yearlyRevenueData = monthlyRevenue.map((m, i) => ({
          ...m,
          value: revenueByMonth[i],
        }));

        setMonthlyRevenueData(yearlyRevenueData);

        /* ---------- SUBSCRIBER GROWTH (YEARLY / MONTHLY) ---------- */

          const subscribersByMonth = Array(12).fill(0);

          users.forEach((u: any) => {
            if (!u.subscriptionStartDate) return;

            const d = new Date(u.subscriptionStartDate);

            if (d.getFullYear() === selectedYear) {
              subscribersByMonth[d.getMonth()] += 1;
            }
          });

          const yearlySubscriberGrowth = subscriberGrowth.map((m, i) => ({
            ...m,
            value: subscribersByMonth[i],
          }));

          setSubscriberGrowthData(yearlySubscriberGrowth);

          /* ---------- CANCELLATION TREND (YEARLY / MONTHLY COUNT) ---------- */

        const cancelledByMonth = Array(12).fill(0);
        const nowMonthIndex =
          selectedYear === currentYear ? new Date().getMonth() : 11;

        users.forEach((u: any) => {
          if (!u.subscriptionEndDate) return;

          const d = new Date(u.subscriptionEndDate);

          if (
            d.getFullYear() === selectedYear &&
            d.getMonth() <= nowMonthIndex
          ) {
            cancelledByMonth[d.getMonth()] += 1;
          }
        });

        const yearlyCancellationTrend = monthlyRevenue
          .map((m, i) => ({
            ...m,
            value: cancelledByMonth[i],
          }))
          .slice(0, nowMonthIndex + 1);

        setMonthlyCancellationData(yearlyCancellationTrend);


      setStats(prev => [
        {
          ...prev[0],
          value: totalActiveSubscribers.toString(),
          sub:
            newThisMonth > 0
              ? `↑ ${newThisMonth} new this month`
              : prev[0].sub,
        },
        {
            ...prev[1],
            value: `₹${thisMonthRevenue.toLocaleString()}`,
            sub:
              trend === "up"
                ? `↑ ${percent}% increase`
                : trend === "down"
                ? `↓ ${Math.abs(percent)}% decrease`
                : "0% change",
          },
        {
          ...prev[2],
          value:
            lastMonthCancelRate === 0
              ? "0%"
              : `${thisMonthCancelRate}%`,
          sub: cancelSub,
          color: cancelColor,
        },
        
        {
          ...prev[3],
          value: pendingInvoicesCount.toString(),
          sub:
            pendingInvoicesAmount > 0
              ? `₹${pendingInvoicesAmount.toLocaleString()} outstanding`
              : "No outstanding amount",
        },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  loadStats();
}, [selectedYear]);

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-2">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold my-custom-class h-8 text-orangeButton">
          Subscribers Management
        </h1>
        <p className="text-gray-500 my-custom-class">
          Welcome back to your B2B management console
        </p>
      </div>
       <Link href="/admin/subscribers/all-subscribers">
        <Button className="bg-orangeButton rounded-2xl hover:bg-orangeButton/90">
          All Subscribers 
          <ArrowRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {stats.map((item) => (
          <Card key={item.title} className="relative bg-white rounded-3xl py-2 pb-0 shadow-lg border-none">
            <CardHeader className="flex flex-row h-2 items-start justify-between">
              <CardTitle className="text-sm font-bold my-custom-class">
                {item.title}
              </CardTitle>
              <div className="absolute right-3 top-1 p-2 rounded-full bg-[#eef7fe] text-orange-500">
                {item.icon}
              </div>
            </CardHeader>
            <CardContent className="pt-2 pb-6">
              <div className="text-2xl font-bold my-custom-class">{item.value}</div>
              <p className={`mt-2 my-custom-class text-xs ${item.color ?? "text-green-600"}`}>
                {item.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 gap-2">
        {/* WEEKLY REVENUE */}
        <DashboardCard
          title="Revenue"
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          currentYear={currentYear}
          years={years}
        >
          <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyRevenueData} barSize={14}>
          <defs>
            <linearGradient id="weeklyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
          />

          <Tooltip />

          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
            fill="url(#weeklyGrad)"
          />
        </BarChart>
      </ResponsiveContainer>

        </DashboardCard>

        {/* SUBSCRIBER GROWTH */}
        <DashboardCard
            title="Subscriber Growth"
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            currentYear={currentYear}
            years={years}
          >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={subscriberGrowthData}>
              <defs>
                <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c7cff" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#7c7cff" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#7c7cff"
                strokeWidth={2.5}
                fill="url(#growthFill)"
                dot={{
                  r: 4,
                  fill: "#ffffff",
                  stroke: "#7c7cff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>

        </DashboardCard>
      </div>

      {/* CANCELLATIONS */}

      <DashboardCard
  title="Cancellations Trend"
  selectedYear={selectedYear}
  setSelectedYear={setSelectedYear}
  currentYear={currentYear}
  years={years}
>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={monthlyCancellationData} barSize={14}>
      <defs>
        <linearGradient id="cancelGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#f43f5e" />
        </linearGradient>
      </defs>

      <CartesianGrid
        strokeDasharray="3 3"
        vertical={false}
        stroke="#e5e7eb"
      />

      <XAxis
        dataKey="month"
        axisLine={false}
        tickLine={false}
        tick={{ fill: "#6b7280", fontSize: 12 }}
      />

      <YAxis
        axisLine={false}
        tickLine={false}
        tick={{ fill: "#6b7280", fontSize: 12 }}
        allowDecimals={false}
      />

      <Tooltip />

      <Bar
        dataKey="value"
        radius={[8, 8, 0, 0]}
        fill="url(#cancelGrad)"
      />
    </BarChart>
  </ResponsiveContainer>
</DashboardCard>


    </div>
  );
}

function DashboardCard({
  title,
  children,
  selectedYear,
  setSelectedYear,
  currentYear,
  years,
}: {
  title: string;
  children: React.ReactNode;
  selectedYear?: number;
  setSelectedYear?: (y: number) => void;
  currentYear?: number;
  years?: number[];
}) {

  return (
    <Card className="rounded-3xl bg-white p-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between px-10 pt-4 pb-4">
        <CardTitle className="text-[22px] font-semibold text-orangeButton my-custom-class">
          {title}
        </CardTitle>

        {selectedYear !== undefined && setSelectedYear && currentYear && (
          <Select
            value={String(selectedYear)}
            onValueChange={(v) => setSelectedYear(Number(v))}
          >
            <SelectTrigger className="h-12 w-32 rounded-xl border-gray-200 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years!.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}


      </CardHeader>

      <CardContent className="px-2">
        {children}
      </CardContent>
    </Card>
  );
}

