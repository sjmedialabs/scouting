"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Users, DollarSign, Star, FileText } from "lucide-react"

interface AnalyticsData {
  subscriptionStats: {
    basic: number
    standard: number
    premium: number
    total: number
    revenue: number
  }
  proposalStats: {
    total: number
    accepted: number
    pending: number
    rejected: number
    acceptanceRate: number
  }
  reviewTrends: {
    averageRating: number
    totalReviews: number
    ratingDistribution: { rating: number; count: number }[]
    trend: "up" | "down" | "stable"
  }
}

interface AnalyticsWidgetsProps {
  data: AnalyticsData
}

export function AnalyticsWidgets({ data }: AnalyticsWidgetsProps) {
  const { subscriptionStats, proposalStats, reviewTrends } = data

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Subscription Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Subscription Analytics
          </CardTitle>
          <CardDescription>User distribution across plans</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Users</span>
            <span className="text-2xl font-bold">{subscriptionStats.total}</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Basic</Badge>
                <span className="text-sm">{subscriptionStats.basic}</span>
              </div>
              <Progress value={(subscriptionStats.basic / subscriptionStats.total) * 100} className="w-20" />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">Standard</Badge>
                <span className="text-sm">{subscriptionStats.standard}</span>
              </div>
              <Progress value={(subscriptionStats.standard / subscriptionStats.total) * 100} className="w-20" />
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-800">Premium</Badge>
                <span className="text-sm">{subscriptionStats.premium}</span>
              </div>
              <Progress value={(subscriptionStats.premium / subscriptionStats.total) * 100} className="w-20" />
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Monthly Revenue</span>
              <span className="text-lg font-bold text-green-600">${subscriptionStats.revenue.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proposal Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Proposal Analytics
          </CardTitle>
          <CardDescription>Proposal performance metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Proposals</span>
            <span className="text-2xl font-bold">{proposalStats.total}</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-600">Accepted</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{proposalStats.accepted}</span>
                <Progress value={(proposalStats.accepted / proposalStats.total) * 100} className="w-16" />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-yellow-600">Pending</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{proposalStats.pending}</span>
                <Progress value={(proposalStats.pending / proposalStats.total) * 100} className="w-16" />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-red-600">Rejected</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{proposalStats.rejected}</span>
                <Progress value={(proposalStats.rejected / proposalStats.total) * 100} className="w-16" />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Acceptance Rate</span>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold">{proposalStats.acceptanceRate}%</span>
                {proposalStats.acceptanceRate > 50 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Review Trends
          </CardTitle>
          <CardDescription>Platform rating analytics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Average Rating</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{reviewTrends.averageRating.toFixed(1)}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(reviewTrends.averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>Total Reviews</span>
              <span className="font-medium">{reviewTrends.totalReviews}</span>
            </div>

            {reviewTrends.ratingDistribution.map((item) => (
              <div key={item.rating} className="flex justify-between items-center">
                <span className="text-sm">{item.rating} stars</span>
                <div className="flex items-center gap-2">
                  <Progress value={(item.count / reviewTrends.totalReviews) * 100} className="w-16" />
                  <span className="text-sm w-8">{item.count}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Trend</span>
              <div className="flex items-center gap-1">
                {reviewTrends.trend === "up" && (
                  <>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Improving</span>
                  </>
                )}
                {reviewTrends.trend === "down" && (
                  <>
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600">Declining</span>
                  </>
                )}
                {reviewTrends.trend === "stable" && <span className="text-sm text-muted-foreground">Stable</span>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
