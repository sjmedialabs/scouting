import type { SubscriptionPlan } from "./types"

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 0,
    billingPeriod: "monthly",
    features: [
      "Post up to 2 requirements per month",
      "Submit up to 5 proposals per month",
      "Basic portfolio (3 items)",
      "Community support",
      "Standard response time",
    ],
    limits: {
      proposalsPerMonth: 5,
      requirementsPerMonth: 2,
      portfolioItems: 3,
      supportLevel: "basic",
    },
  },
  {
    id: "standard",
    name: "Standard",
    price: 29,
    billingPeriod: "monthly",
    features: [
      "Post up to 10 requirements per month",
      "Submit up to 25 proposals per month",
      "Enhanced portfolio (10 items)",
      "Priority support",
      "Faster response time",
      "Advanced analytics",
      "Featured listing (1x per month)",
    ],
    limits: {
      proposalsPerMonth: 25,
      requirementsPerMonth: 10,
      portfolioItems: 10,
      supportLevel: "priority",
    },
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 99,
    billingPeriod: "monthly",
    features: [
      "Unlimited requirements",
      "Unlimited proposals",
      "Unlimited portfolio items",
      "Dedicated account manager",
      "Instant response time",
      "Advanced analytics & insights",
      "Featured listing (always)",
      "Custom branding",
      "API access",
    ],
    limits: {
      proposalsPerMonth: -1, // unlimited
      requirementsPerMonth: -1, // unlimited
      portfolioItems: -1, // unlimited
      supportLevel: "dedicated",
    },
  },
]

export const getSubscriptionPlan = (tier: string) => {
  return subscriptionPlans.find((plan) => plan.id === tier) || subscriptionPlans[0]
}

export const canPerformAction = (
  userTier: string,
  action: "submit_proposal" | "post_requirement" | "add_portfolio",
  currentUsage: { proposals: number; requirements: number; portfolio: number },
) => {
  const plan = getSubscriptionPlan(userTier)

  switch (action) {
    case "submit_proposal":
      return plan.limits.proposalsPerMonth === -1 || currentUsage.proposals < plan.limits.proposalsPerMonth
    case "post_requirement":
      return plan.limits.requirementsPerMonth === -1 || currentUsage.requirements < plan.limits.requirementsPerMonth
    case "add_portfolio":
      return plan.limits.portfolioItems === -1 || currentUsage.portfolio < plan.limits.portfolioItems
    default:
      return false
  }
}
