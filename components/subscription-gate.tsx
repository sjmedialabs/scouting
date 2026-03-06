import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Lock, Zap, Crown } from "lucide-react"
import Link from "next/link"
import type { SubscriptionTier } from "@/lib/types"

interface SubscriptionGateProps {
  currentTier: SubscriptionTier
  requiredTier: SubscriptionTier
  feature: string
  description: string
}

export function SubscriptionGate({ currentTier, requiredTier, feature, description }: SubscriptionGateProps) {
  const getIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case "standard":
        return <Zap className="h-5 w-5" />
      case "premium":
        return <Crown className="h-5 w-5" />
      default:
        return <Lock className="h-5 w-5" />
    }
  }

  const getTierColor = (tier: SubscriptionTier) => {
    switch (tier) {
      case "standard":
        return "bg-blue-500"
      case "premium":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="border-dashed border-2">
      <CardHeader className="text-center">
        <div
          className={`w-12 h-12 rounded-full ${getTierColor(requiredTier)} flex items-center justify-center mx-auto mb-4`}
        >
          {getIcon(requiredTier)}
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          {feature}
          <Badge variant="secondary" className="capitalize">
            {requiredTier} Required
          </Badge>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Upgrade to {requiredTier} plan to unlock this feature and many more.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button asChild>
            <Link href="/pricing">View Plans</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/subscribe/${requiredTier}`}>Upgrade Now</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
