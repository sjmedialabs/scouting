"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { TrendingUp, Users, Building2, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { authFetch } from "@/lib/auth-fetch";

// ----------------------------------------------------
// MOCK DATA (Replace with API later)
// ----------------------------------------------------
const mockGrowthData = [
  { month: "Jan", users: 120, providers: 15, requirements: 30 },
  { month: "Feb", users: 180, providers: 22, requirements: 45 },
  { month: "Mar", users: 250, providers: 30, requirements: 60 },
  { month: "Apr", users: 320, providers: 40, requirements: 75 },
  { month: "May", users: 400, providers: 52, requirements: 100 },
  { month: "Jun", users: 490, providers: 60, requirements: 130 },
];

const mockKpiStats = {
  monthlyUserGrowth: 14,
  monthlyProviderGrowth: 12,
  requirementGrowth: 18,
  churnRate: 3.2,
};

export default function GrowthMetricsPage() {
  const [growthData, setGrowthData] = useState(mockGrowthData);
  const [kpis, setKpis] = useState(mockKpiStats);

  /*
  ------------------------------------------------------
  OPTIONAL: Fetch data from backend
  ------------------------------------------------------
  useEffect(() => {
    async function loadGrowthMetrics() {
      const res = await authFetch("/api/admin/growth-metrics");
      const data = await res.json();

      setGrowthData(data.growthData);
      setKpis(data.kpis);
    }

    loadGrowthMetrics();
  }, []);
  */

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Growth Metrics</h1>
        <p className="text-gray-500">
          Track user, provider, and requirement growth over time.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard
          title="Monthly User Growth"
          value={`+${kpis.monthlyUserGrowth}%`}
          icon={<Users className="w-7 h-7 text-blue-600" />}
          gradient="from-blue-100 to-blue-200"
        />
        <KpiCard
          title="Provider Growth"
          value={`+${kpis.monthlyProviderGrowth}%`}
          icon={<Building2 className="w-7 h-7 text-green-600" />}
          gradient="from-green-100 to-green-200"
        />
        <KpiCard
          title="Requirement Growth"
          value={`+${kpis.requirementGrowth}%`}
          icon={<FileText className="w-7 h-7 text-purple-600" />}
          gradient="from-purple-100 to-purple-200"
        />
        <KpiCard
          title="Churn Rate"
          value={`${kpis.churnRate}%`}
          icon={<TrendingUp className="w-7 h-7 text-red-600" />}
          gradient="from-red-100 to-red-200"
        />
      </div>

      {/* User Growth Chart */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">User Growth Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Provider Growth Chart */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Provider Growth Over Time
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="providers"
              stroke="#10b981"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Requirements Growth Chart */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Requirements Posted Growth
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="requirements"
              stroke="#8b5cf6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   KPI Card Component
--------------------------------------------------------- */
function KpiCard({ title, value, icon, gradient }: any) {
  return (
    <div className="group bg-white rounded-2xl p-6 border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between pb-3">
        <h3 className="text-sm text-gray-600">{title}</h3>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
