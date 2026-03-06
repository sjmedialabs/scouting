"use client";

import { RiExchangeDollarFill } from "react-icons/ri";
import { IoMdTrendingUp } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { FaArrowUpLong } from "react-icons/fa6";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, Send } from "lucide-react";
import {
  mockSubscriptionStats,
} from "@/lib/mock-data";
const mockBillingInvoices = [
  {
    id: "INV-001",
    date: "2025-11-15",
    amount: 199,
    plan: "Pro Plan",
    status: "paid",
    company: "Tech Corp"
  },
  {
    id: "INV-002",
    date: "2025-11-28",
    amount: 499,
    plan: "Enterprise Plan",
    status: "pending",
    company: "Tech Corp"
  },
  {
    id: "INV-003",
    date: "2025-12-01",
    amount: 99,
    plan: "Basic Plan",
    status: "failed",
    company: "Tech Corp"
  },
];

const revenueData = [
  { month: "Jan", target: 8000, actual: 7800 },
  { month: "Feb", target: 15000, actual: 2200 },
  { month: "Mar", target: 21000, actual: 1500 },
  { month: "Apr", target: 6000, actual: 14000 },
  { month: "May", target: 27000, actual: 21000 },
  { month: "Jun", target: 14000, actual: 2800 },
  { month: "Jul", target: 5000, actual: 4300 },
  { month: "Aug", target: 1000, actual: 27000 },
  { month: "Sep", target: 17000, actual: 4500 },
  { month: "Oct", target: 22000, actual: 17000 },
  { month: "Nov", target: 16000, actual: 4000 },
  { month: "Dec", target: 17000, actual: 2400 },
];

const mrrData = [
  { week: "Week 1", a: 200, b: 120, c: 40 },
  { week: "Week 2", a: 180, b: 90, c: 20 },
  { week: "Week 3", a: 120, b: 60, c: 30 },
  { week: "Week 4", a: 210, b: 140, c: 60 },
  { week: "Week 5", a: 140, b: 110, c: 65 },
  { week: "Week 6", a: 160, b: 115, c: 25 },
  { week: "Week 7", a: 180, b: 130, c: 60 },
  { week: "Week 8", a: 90, b: 50, c: 20 },
];

export default function BillingPage() {
   const [activeTab, setActiveTab] = useState<"overview" | "invoices">("overview");
  const [invoices, setInvoices] = useState(mockBillingInvoices || []);
  const [billingStats, setBillingStats] = useState(mockSubscriptionStats);

  /*
  ------------------------------------------------------
  OPTIONAL: Fetch Billing + Invoices from backend API
  ------------------------------------------------------
  useEffect(() => {
    async function loadBilling() {
      const res = await fetch("/api/admin/billing");
      const data = await res.json();

      setInvoices(data.invoices);
      setBillingStats(data.billingStats);
    }
    loadBilling();
  }, []);
  */

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-700">Paid</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-700">Failed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const downloadPDF = (id: string) => {
    console.log("Downloading invoice PDF:", id);
  };

  const downloadCSV = (id: string) => {
    console.log("Downloading invoice CSV:", id);
  };


  // return (
  //   <div className="space-y-10">
  //     {/* Header */}
  //     <div>
  //       <h1 className="text-4xl font-bold text-orange-600">Billing & Invoices</h1>
  //       <p className="text-gray-500 mt-2">
  //         Manage your billing, payments, and invoices
  //       </p>
  //     </div>

  //     {/* Tabs */}
  //     <div className="inline-flex bg-gray-100 rounded-full p-1">
  //       {["overview", "invoices"].map((tab) => (
  //         <button
  //           key={tab}
  //           onClick={() => setActiveTab(tab as any)}
  //           className={`px-6 py-2 rounded-full text-sm font-medium transition
  //             ${
  //               activeTab === tab
  //                 ? "bg-orange-500 text-white"
  //                 : "text-gray-600 hover:text-gray-900"
  //             }`}
  //         >
  //           {tab === "overview" ? "Overview" : "Invoices"}
  //         </button>
  //       ))}
  //     </div>

  //     {/* OVERVIEW */}
  //     {activeTab === "overview" && (
  //       <>
  //         {/* Stats Cards */}
  //         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
  //           <BillingCard
  //             title="Monthly Recurring Revenue"
  //             value="$18,000"
  //             subtitle="↑ 15% from last month"
  //             icon={<CircleDollarSign className="w-6 h-6 text-orange-500" />}
  //           />

  //           <BillingCard
  //             title="Annual Recurring Revenue"
  //             value="$216,000"
  //             subtitle="↑ 18% growth YoY"
  //             icon={<TrendingUp className="w-6 h-6 text-orange-500" />}
  //           />

  //           <BillingCard
  //             title="Outstanding"
  //             value="$4,200"
  //             subtitle="Improved from 1.8%"
  //             icon={<ArrowUpRight className="w-6 h-6 text-green-500" />}
  //           />

  //           <BillingCard
  //             title="Success Rate"
  //             value="98.5%"
  //             subtitle="$4,200 outstanding"
  //             icon={<CheckCircle className="w-6 h-6 text-green-500" />}
  //           />
  //         </div>

  //         {/* Monthly Revenue vs Target */}
  //         <div className="bg-white rounded-2xl p-6 shadow-sm border">
  //           <h3 className="text-lg font-semibold text-orange-600 mb-4">
  //             Monthly Revenue vs Target
  //           </h3>
  //           <div className="h-[320px] flex items-center justify-center text-gray-400">
  //             Chart UI Placeholder
  //           </div>
  //         </div>

  //         {/* MRR Growth Trend */}
  //         <div className="bg-white rounded-2xl p-6 shadow-sm border">
  //           <h3 className="text-lg font-semibold text-orange-600 mb-4">
  //             MRR Growth Trend
  //           </h3>
  //           <div className="h-[300px] flex items-center justify-center text-gray-400">
  //             Chart UI Placeholder
  //           </div>
  //         </div>
  //       </>
  //     )}

  //     {/* INVOICES */}
  //     {activeTab === "invoices" && (
  //       <div className="bg-white p-6 rounded-2xl shadow-sm border">
  //         <h2 className="text-xl font-semibold mb-6">Invoice History</h2>

  //         <div className="space-y-4">
  //           {invoices.map((invoice) => (
  //             <div
  //               key={invoice.id}
  //               className="p-5 border rounded-xl flex flex-col md:flex-row justify-between hover:shadow-lg transition"
  //             >
  //               <div className="flex items-start gap-4">
  //                 <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
  //                   <FileText className="w-6 h-6 text-orange-500" />
  //                 </div>

  //                 <div>
  //                   <h3 className="font-semibold">{invoice.plan}</h3>
  //                   <p className="text-sm text-gray-500">
  //                     Invoice ID: {invoice.id}
  //                   </p>
  //                   <p className="text-sm text-gray-500">
  //                     Date: {invoice.date}
  //                   </p>
  //                   <p className="font-semibold mt-2">
  //                     ${invoice.amount}
  //                   </p>
  //                 </div>
  //               </div>

  //               <div className="flex flex-col items-end gap-3 mt-4 md:mt-0">
  //                 {getStatusBadge(invoice.status)}

  //                 <div className="flex gap-2">
  //                   <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
  //                     <Download className="w-4 h-4 mr-1" /> PDF
  //                   </Button>
  //                   <Button size="sm" variant="outline">
  //                     <Download className="w-4 h-4 mr-1" /> CSV
  //                   </Button>
  //                 </div>
  //               </div>
  //             </div>
  //           ))}
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-orangeButton my-custom-class">Billing & Invoices</h1>
        <p className="text-gray-500 mt-0 my-custom-class text-xl">
          Manage your billing, payments, and invoices
        </p>
      </div>

      {/* Segmented Tabs */}
<div className="inline-flex items-center bg-[#e6edf5] rounded-full p-1">
  <button
    onClick={() => setActiveTab("overview")}
    className={`px-6 py-2 text-sm font-medium rounded-full transition my-custom-class
      ${
        activeTab === "overview"
          ? "bg-orange-500 text-white shadow"
          : "text-black hover:text-gray-900"
      }`}
  >
    Overview
  </button>

  <button
    onClick={() => setActiveTab("invoices")}
    className={`px-6 py-2 text-sm font-medium rounded-full transition my-custom-class
      ${
        activeTab === "invoices"
          ? "bg-orange-500 text-white shadow"
          : "text-black hover:text-gray-900"
      }`}
  >
    Invoices
  </button>
</div>


      {/* CARDS */}
      {activeTab === "overview" && (
        <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="(Monthly Recurring Revenue)"
          value="$18,000"
          note="↑ 15% from last month"
          noteColor="text-green-600"
          icon={<RiExchangeDollarFill />}
        />
        <StatCard
          title="Annual Recurring Revenue"
          value="$216,000"
          note="↑ 18% growth YoY"
          noteColor="text-green-600"
          icon={<IoMdTrendingUp />}
        />
        <StatCard
          title="Outstanding"
          value="$4,200"
          note="Improved from 1.8%"
          noteColor="text-black"
          icon={<FaArrowUpLong className="text-green-500" />}
        />
        <StatCard
          title="Success Rate"
          value="98.5%"
          note="$4,200 outstanding"
          noteColor="text-black"
          icon={<FaCheckCircle className="text-green-500"/>}
        />
      </div>

      {/* MONTHLY REVENUE vs TARGET */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="text-xl font-semibold text-orangeButton my-custom-class mb-6">
          Monthly Revenue vs Target
        </h3>

        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="target" fill="#9b8cff" radius={[6, 6, 0, 0]} />
              <Bar dataKey="actual" fill="#ffb3a7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MRR GROWTH TREND */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="text-xl font-semibold text-orangeButton my-custom-class mb-6">
          MRR Growth Trend
        </h3>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mrrData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="a" stroke="#2ec4f1" strokeWidth={3} dot />
              <Line type="monotone" dataKey="b" stroke="#ff7b7b" strokeWidth={3} dot />
              <Line type="monotone" dataKey="c" stroke="#7b61ff" strokeWidth={3} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}


 {/* ================= INVOICES ================= */}
      {activeTab === "invoices" && (
        <div className="bg-white rounded-2xl shadow-sm border-none overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="px-6 py-4 text-left text-black font-bold">Invoice ID</th>
                <th className="px-6 py-4 text-left text-black font-bold">Plan</th>
                <th className="px-6 py-4 text-left text-black font-bold">Amount</th>
                <th className="px-6 py-4 text-left text-black font-bold">Date</th>
                <th className="px-6 py-4 text-left text-black font-bold">Due Date</th>
                <th className="px-6 py-4 text-left text-black font-bold">Status</th>
                <th className="px-6 py-4 text-left text-black font-bold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b last:border-none">
                  <td className="px-6 py-5">
                    <div className="font-semibold">John Doe</div>
                    <div className="text-xs text-gray-500">
                      seeker@example.com
                    </div>
                    <div className="text-xs text-gray-500">Tech Corp</div>
                  </td>

                  <td className="px-6 py-5">{invoice.plan}</td>

                  <td className="px-6 py-5 font-semibold">
                    ${invoice.amount}.00
                  </td>

                  <td className="px-6 py-5">{invoice.date}</td>

                  <td className="px-6 py-5">{invoice.date}</td>

                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          invoice.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : invoice.status === "pending"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {invoice.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-4 text-gray-600">
                      <Eye className="w-4 h-4 hover:text-black cursor-pointer" />
                      <Download
                        className="w-4 h-4 hover:text-black cursor-pointer"
                        onClick={() => downloadPDF(invoice.id)}
                      />
                      <Send className="w-4 h-4 hover:text-black cursor-pointer" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------------- Billing Card ---------------- */



function StatCard({ title, value, note, noteColor, icon }: any) {
  return (
    <div className="relative bg-white flex flex-col justify-between rounded-2xl p-4 shadow-md border-none">
      {/* Icon top-right */}
      <div className="flex flex-row justify-between">
      <div className="absolute top-4 right-2 w-7 h-7 rounded-full bg-[#eef7fe] flex items-center justify-center text-orangeButton">
        {icon}
      </div>

      <p className="text-sm my-custom-class max-w-[150px] font-bold">{title}</p>
      </div>
      <div className="items-end">
      <p className="text-3xl font-bold my-custom-class mt-3">{value}</p>
      <p className={`text-xs ${noteColor} mt-0 my-custom-class`}>{note}</p>
      </div>
    </div>
  );
}