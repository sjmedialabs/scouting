export type RequirementStatus = "open" | "shortlisted" | "negotiation" | "closed" | "UnderReview" | "NotApproved"
export type ProposalStatus = "pending" | "shortlisted" | "accepted" | "rejected" | "negotation"
export type ProjectStatus = "active" | "completed" | "cancelled"
export type SubscriptionTier = "basic" | "standard" | "premium"

export interface User {
  _id: string
  name: string
  email: string
  role: "client" | "agency" | "admin"
  createdAt: Date
  lastLogin?: Date
  companyName?: string
  subscriptionTier?: SubscriptionTier
  isActive: boolean
  isVerified: boolean
  phone?: string
  avatar?: string
}
export interface Requirement {
  id: string
  title: string
  description: string
  location?: string
  category: string
  budgetMin: number
  budgetMax: number
  timeline: string
  status: RequirementStatus
  createdAt: Date
  updatedAt: Date
  seekerId: string
  attachments?: string[]
  notApprovedMsg:String
}

export interface Proposal {
  id: string
  requirementId: string
  providerId: string
  providerName: string
  providerCompany: string
  proposedCost: number
  timeline: string
  workApproach: string
  milestones: string[]
  status: ProposalStatus
  createdAt: Date
  rating?: number
  verified: boolean
}

export interface Project {
  id: string
  requirementId: string
  proposalId: string
  seekerId: string
  providerId: string
  status: ProjectStatus
  startDate: Date
  endDate?: Date
  budget: number
  milestones: ProjectMilestone[]
}

export interface ProjectMilestone {
  id: string
  title: string
  description: string
  dueDate: Date
  completed: boolean
  completedAt?: Date
}

export interface Review {
  id: string
  projectId: string
  seekerId: string
  providerId: string
  rating: number
  qualityRating: number
  costRating: number
  timelinessRating: number
  comment: string
  createdAt: Date
}

export interface Provider {
  id: string
  userId: string
  companyName: string
  description: string
  services: string[]
  portfolio: PortfolioItem[]
  rating: number
  reviewCount: number
  verified: boolean
  featured: boolean
  subscriptionTier: SubscriptionTier
  location?: string
  website?: string
  foundedYear?: number
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  imageUrl?: string
  projectUrl?: string
  completedAt: Date
  technologies: string[]
}

export interface Notification {
  id: string
  userId: string
  type: "shortlisted" | "accepted" | "rejected" | "revision_requested" | "new_requirement"
  title: string
  message: string
  read: boolean
  createdAt: Date
  relatedId?: string // proposal ID, requirement ID, etc.
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: "client" | "agency" | "admin"
  status: "active" | "suspended" | "pending"
  createdAt: Date
  lastLogin?: Date
  companyName?: string
  subscriptionTier?: SubscriptionTier
}

export interface AdminStats {
  totalUsers: number
  totalProviders: number
  totalSeekers: number
  totalRequirements: number
  totalProposals: number
  totalProjects: number
  totalRevenue: number
  monthlyGrowth: number
}

export interface ReportedContent {
  id: string
  type: "review" | "proposal" | "requirement" | "user"
  contentId: string
  reportedBy: string
  reason: string
  description: string
  status: "pending" | "resolved" | "dismissed"
  createdAt: Date
  resolvedAt?: Date
  resolvedBy?: string
}

export interface SubscriptionStats {
  basic: number
  standard: number
  premium: number
  totalRevenue: number
  monthlyRecurring: number
  totalSubscriptions: number
}

export interface SubscriptionPlan {
  id: SubscriptionTier
  name: string
  price: number
  billingPeriod: "monthly" | "yearly"
  features: string[]
  limits: {
    proposalsPerMonth: number
    requirementsPerMonth: number
    portfolioItems: number
    supportLevel: "basic" | "priority" | "dedicated"
  }
  popular?: boolean
  trialDays?: number
}

export interface UserSubscription {
  id: string
  userId: string
  planId: SubscriptionTier
  status: "active" | "cancelled" | "expired" | "trial"
  startDate: Date
  endDate: Date
  autoRenew: boolean
  paymentMethod?: string
  lastPayment?: Date
  nextPayment?: Date
}

export interface BillingHistory {
  id: string
  subscriptionId: string
  amount: number
  currency: string
  status: "paid" | "pending" | "failed"
  invoiceUrl?: string
  createdAt: Date
}

export interface ISubscription {
  _id: string
  title: string
  pricePerMonth: number
  pricePerYear: number
  yearlySubscription: boolean
  description?: string
  features: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
