"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  TrendingUp,
  Star,
  UserCheck,
  MousePointerClick,
} from "lucide-react";
import { authFetch } from "@/lib/auth-fetch";

// ----------------------------------------------------
// MOCK DATA (API Replacable)
// ----------------------------------------------------
const mockEngagement = [
  { month: "Jan", engagement: 45 },
  { month: "Feb", engagement: 52 },
  { month: "Mar", engagement: 63 },
  { month: "Apr", engagement: 78 },
  { month: "May", engagement: 92 },
  { month: "Jun", engagement: 105 },
];

const mockProviderSuccess = [
  { provider: "Techify", successRate: 82 },
  { provider: "WebCraft", successRate: 75 },
  { provider: "BuildHub", successRate: 91 },
  { provider: "StudioMax", successRate: 68 },
];

const mockConversion = [
  { month: "Jan", conversions: 120 },
  { month: "Feb", conversions: 180 },
  { month: "Mar", conversions: 210 },
  { month: "Apr", conversions: 260 },
  { month: "May", conversions: 310 },
  { month: "Jun", conversions: 350 },
];

const mockHealth = [
  { name: "Stability", value: 80 },
  { name: "Performance", value: 70 },
  { name: "Security", value: 90 },
  { name: "Scalability", value: 65 },
];

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#8b5cf6"];

export default function PerformanceInsightsPage() {
  const [engagement, setEngagement] = useState(mockEngagement);
  const [providerSuccess, setProviderSuccess] = useState(mockProviderSuccess);
  const [conversion, setConversion] = useState(mockConversion);
  const [health, setHealth] = useState(mockHealth);

  /*
  ----------------------------------------------------
  OPTIONAL: Fetch from backend API
  ----------------------------------------------------
  useEffect(() => {
    async function loadInsights() {
      const res = await authFetch("/api/admin/performance-insights");
      const data = await res.json();

      setEngagement(data.engagement);
      setProviderSuccess(data.providerSuccess);
      setConversion(data.conversion);
      setHealth(data.health);
    }
    loadInsights();
  }, []);
  */

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Performance Insights</h1>
        <p className="text-gray-500">
          Deep analytics on engagement, conversions, and provider success.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KpiCard
          title="User Engagement Score"
          value="105"
          icon={<Activity className="w-7 h-7 text-blue-600" />}
          gradient="from-blue-100 to-blue-200"
        />

        <KpiCard
          title="Avg Provider Success Rate"
          value="79%"
          icon={<Star className="w-7 h-7 text-yellow-500" />}
          gradient="from-yellow-100 to-yellow-200"
        />

        <KpiCard
          title="Requirement Conversion"
          value="350"
          icon={<MousePointerClick className="w-7 h-7 text-purple-600" />}
          gradient="from-purple-100 to-purple-200"
        />

        <KpiCard
          title="Top Provider Score"
          value="91%"
          icon={<UserCheck className="w-7 h-7 text-green-600" />}
          gradient="from-green-100 to-green-200"
        />
      </div>

      {/* Engagement Trend */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">User Engagement Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={engagement}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="engagement"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Provider Success Rates */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Provider Success Rate</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={providerSuccess}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="provider" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="successRate" fill="#10b981" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Requirement Conversion */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          Requirement Conversion Growth
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={conversion}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="conversions"
              stroke="#8b5cf6"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Platform Health Radar (Pie breakdown representation) */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Platform Health Overview</h2>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={health}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
            >
              {health.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Labels */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {health.map((entry, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: COLORS[i] }}
              ></div>
              <span className="text-gray-700">{entry.name}</span>
            </div>
          ))}
        </div>
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
