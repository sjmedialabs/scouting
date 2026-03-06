import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SubscriptionTier } from "@/lib/types"
import { getSubscriptionPlan } from "@/lib/subscription-plans"

interface UsageMeterProps {
  userTier: SubscriptionTier
  currentUsage: {
    proposals: number
    requirements: number
    portfolio: number
  }
}

export function UsageMeter({ userTier, currentUsage }: UsageMeterProps) {
  const plan = getSubscriptionPlan(userTier)

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0 // unlimited
    return Math.min((current / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-500"
    if (percentage >= 75) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Plan Usage
          <Badge variant="secondary" className="capitalize">
            {plan.name}
          </Badge>
        </CardTitle>
        <CardDescription>Track your monthly usage across different features</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Proposals */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Proposals Submitted</span>
            <span
              className={`text-sm ${getUsageColor(getUsagePercentage(currentUsage.proposals, plan.limits.proposalsPerMonth))}`}
            >
              {currentUsage.proposals}
              {plan.limits.proposalsPerMonth === -1 ? " (Unlimited)" : ` / ${plan.limits.proposalsPerMonth}`}
            </span>
          </div>
          {plan.limits.proposalsPerMonth !== -1 && (
            <Progress
              value={getUsagePercentage(currentUsage.proposals, plan.limits.proposalsPerMonth)}
              className="h-2"
            />
          )}
        </div>

        {/* Requirements */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Requirements Posted</span>
            <span
              className={`text-sm ${getUsageColor(getUsagePercentage(currentUsage.requirements, plan.limits.requirementsPerMonth))}`}
            >
              {currentUsage.requirements}
              {plan.limits.requirementsPerMonth === -1 ? " (Unlimited)" : ` / ${plan.limits.requirementsPerMonth}`}
            </span>
          </div>
          {plan.limits.requirementsPerMonth !== -1 && (
            <Progress
              value={getUsagePercentage(currentUsage.requirements, plan.limits.requirementsPerMonth)}
              className="h-2"
            />
          )}
        </div>

        {/* Portfolio */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Portfolio Items</span>
            <span
              className={`text-sm ${getUsageColor(getUsagePercentage(currentUsage.portfolio, plan.limits.portfolioItems))}`}
            >
              {currentUsage.portfolio}
              {plan.limits.portfolioItems === -1 ? " (Unlimited)" : ` / ${plan.limits.portfolioItems}`}
            </span>
          </div>
          {plan.limits.portfolioItems !== -1 && (
            <Progress value={getUsagePercentage(currentUsage.portfolio, plan.limits.portfolioItems)} className="h-2" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
