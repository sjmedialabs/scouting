"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Target,
  MessageSquare,
  CheckCircle,
  TrendingUp,
  FileText,
  Handshake,
  ChevronDown,
  Clock,
} from "lucide-react"

const LeadGenerationPage = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-orangeButton my-custom-class h-6 mb-1">
          Lead Management
        </h1>
        <p className="text-gray-500 text-sm">
          Track and manage qualified leads attributed to Spark platform
        </p>
      </div>

      {/* Top Stats */}
       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
                { title: "Total Leads", value: "247", sub: "+18% from last month", icon: Users },
                { title: "Qualified Leads", value: "189", sub: "76.5% qualification rate", icon: Target },
                { title: "Contacted", value: "142", sub: "75.1% contact rate", icon: MessageSquare },
                { title: "Paying Clients", value: "67", sub: "From qualified leads", icon: CheckCircle },
                { title: "Lead-to-Client Rate", value: "35.4%", sub: "+5.2% from last month", icon: TrendingUp },
            ].map((item) => {
                const Icon = item.icon
                return (
                <Card
                    key={item.title}
                    className="p-3 rounded-2xl bg-white shadow-md border border-white"
                >
                    
                    {/* Top row */}
                    <div className="flex items-center justify-between">
                        <p className="text-[13px] font-bold my-custom-class text-muted-foreground">
                        {item.title}
                        </p>
                        <div className="h-8 w-8 rounded-full bg-[#eef7fe] flex items-center justify-center">
                        <Icon className="h-4 w-4 text-orangeButton" />
                        </div>
                    </div>

                    {/* Bottom content */}
                        <p className="text-2xl font-bold my-custom-class h-1 leading-none">
                        {item.value}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                        {item.sub}
                        </p>
                        </Card>
                        )
                    })}
                    </div>



      {/* Funnel */}
      <Card className="rounded-2xl bg-white">
        <CardHeader>
          <CardTitle className="text-orangeButton h-2">
            Lead-to-Client Conversion Funnel
          </CardTitle>
          <CardDescription className="text-gray-500">
            Complete journey from lead generation to paying client
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {[
            {
          label: "Total Leads Generated",
          value: "247 leads",
          percent: 100,
          color: "bg-blue-500",
          icon: Users,
        },
        {
          label: "Qualified Leads",
          value: "189 leads",
          drop: "-58%",
          percent: 76,
          color: "bg-indigo-500",
          icon: Target,
        },
        {
          label: "Contacted",
          value: "142 leads",
          drop: "-47%",
          percent: 57,
          color: "bg-purple-500",
          icon: MessageSquare,
        },
        {
          label: "Proposals Sent",
          value: "98 leads",
          drop: "-44%",
          percent: 44,
          color: "bg-violet-500",
          icon: FileText,
        },
        {
          label: "In Negotiation",
          value: "82 leads",
          drop: "-16%",
          percent: 24,
          color: "bg-fuchsia-500",
          icon: Handshake,
        },
        {
          label: "Paying Clients",
          value: "67 leads",
          drop: "-15%",
          percent: 20,
          color: "bg-green-500",
          icon: CheckCircle,
        },
          ].map((item, index) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-lg ${item.color} flex items-center justify-center`}
                  >
                    <Icon className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{item.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.value}
                      {item.drop && (
                        <span className="text-red-500 ml-1">
                        ({item.drop})
                        </span>
                    )}
                    </p>
                  </div>
                </div>

                <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                className={`h-full ${item.color} rounded-full`}
                style={{ width: `${item.percent}%` }}
               />
                </div>
              </div>
            )
          })}
          </CardContent>
          </Card>

          {/* ================= SUMMARY CARD ================= */}
      <Card className="rounded-2xl bg-white py-1">
        <CardContent className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border bg-white p-5 text-center">
              <p className="text-sm text-gray-500">Overall Lead-to-Client Rate</p>
              <p className="text-3xl font-extrabold mt-1">35.4%</p>
              <p className="text-sm text-gray-500 mt-1">
                67 clients from 189 qualified leads
              </p>
            </div>

            <div className="rounded-2xl border bg-green-50 p-5 text-center">
              <p className="text-sm text-gray-500">Average Deal Value</p>
              <p className="text-3xl font-extrabold text-green-600 mt-1">
                $78,500
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Per converted client
              </p>
            </div>

            <div className="rounded-2xl border bg-blue-50 p-5 text-center">
              <p className="text-sm text-gray-500">Total Revenue from Leads</p>
              <p className="text-3xl font-extrabold text-blue-600 mt-1">
                $5.26M
              </p>
              <p className="text-sm text-gray-500 mt-1">
                From 67 paying clients
              </p>
            </div>
          </div>
        </CardContent>
      </Card>



          {/* ================= BOTTOM INSIGHTS CARD ================= */}
      <Card className="rounded-2xl bg-white">
        <CardContent className="p-6 pt-2">
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Left */}
            <div>
              <h4 className="font-semibold mb-4 my-custom-class flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Top Performing Lead Sources
              </h4>

              {[
                ["Direct Invitations", "52.3%", "24 clients"],
                ["Profile Views", "38.2%", "34 clients"],
                ["Search Results", "29.8%", "20 clients"],
              ].map(([label, rate, clients]) => (
                <div
                  key={label}
                  className="flex justify-between items-center border rounded-xl px-4 py-3 mb-3"
                >
                  <span className="text-sm text-gray-500">{label}</span>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">{rate}</p>
                    <p className="text-xs text-gray-500">{clients}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right */}
            <div>
              <h4 className="font-semibold mb-4 flex my-custom-class items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600 " />
                Average Time to Conversion
              </h4>

              {[
                ["Lead to Contact", "2.3 days"],
                ["Contact to Proposal", "4.7 days"],
                ["Proposal to Client", "12.5 days"],
              ].map(([label, time]) => (
                <div
                  key={label}
                  className="flex justify-between items-center bg-blue-50 rounded-xl px-4 py-3 mb-3"
                >
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-semibold text-blue-600">{time}</span>
                </div>
              ))}

              <div className="flex justify-between items-center border rounded-xl px-4 py-3">
                <span className="text-sm font-semibold">Total Cycle Time</span>
                <span className="text-sm font-bold">19.5 days</span>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

    </div>
  )
}

export default LeadGenerationPage
