import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IPortfolioItem {
  title: string
  description: string
  image: string
  technologies: string[]
  category?:String
  completedDate: string
  clientName?: string
  projectUrl?: string
}

export interface ITestimonial {
  clientName: string
  company: string
  rating: number
  text: string
  date: string
  avatar?: string
}

export interface IProvider extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  name: string
  tagline?: string
  description: string
  logo?: string
  coverImage?: string
  location: string
  website?: string
  email: string
  salesEmail?: string
  phone?: string
  adminContactPhone?: string
  services: string[]
  technologies: string[]
  industries: string[]
  rating: number
  reviewCount: number
  qualityRating?:number
  scheduleRating?:number
  costRating?:number
  willingToReferRating?:number
  projectsCompleted: number
  hourlyRate?: string
  minProjectSize?: number
  teamSize?: string
  focusArea?:string
  foundedYear?: number
  portfolio: IPortfolioItem[]
  testimonials: ITestimonial[]
  certifications: string[]
   awards: {
  title: string
  imageUrl: string
}[]
  socialLinks?: {
    linkedin?: string
    twitter?: string
    facebook?: string
    instagram?: string
  }
  isFeatured: boolean
  isVerified: boolean
  isActive: boolean
  profileViews: number
  impressions: number
  websiteClicks: number
  createdAt: Date
  updatedAt: Date
  minAmount?:number
  minTimeLine?:String
  keyHighlights:String[]
  currentMonthProfileViews?: Number,
  lastMonthProfileViews?:Number,
  currentMonthWebsiteClicks?:Number,
  currentMonthKey?:String
}

const PortfolioItemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  technologies: [{ type: String }],
  completedDate: { type: String },
  clientName: { type: String },
  category:{type:String},
  projectUrl: { type: String },
})

const awardSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
})

const TestimonialSchema = new Schema({
  clientName: { type: String, required: true },
  company: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  date: { type: String },
  avatar: { type: String },
})

const ProviderSchema = new Schema<IProvider>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true },
    description: { type: String, required: true },
    logo: { type: String },
    coverImage: { type: String },
    location: { type: String, required: true },
    website: { type: String },
    email: { type: String, required: true },
    focusArea:{type:String},
    salesEmail: { type: String },
    phone: { type: String },
    adminContactPhone: { type: String },
    services: [{ type: String }],
    technologies: [{ type: String }],
    industries: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    qualityRating: { type: Number, default: 0, min: 0, max: 5 },
    scheduleRating: { type: Number, default: 0, min: 0, max: 5 },
    costRating: { type: Number, default: 0, min: 0, max: 5 },
    willingToReferRating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 },
    hourlyRate: { type: String },
    minProjectSize: { type: Number,default:0 },

    teamSize: { type: String },
    foundedYear: { type: Number },
    portfolio: [PortfolioItemSchema],
    testimonials: [TestimonialSchema],
    certifications: [{ type: String }],
    awards: [awardSchema],
    socialLinks: {
      linkedin: { type: String },
      twitter: { type: String },
      facebook: { type: String },
      instagram: { type: String },
    },
    currentMonthProfileViews: { type: Number, default: 0 },
    lastMonthProfileViews: { type: Number, default: 0 },
    currentMonthWebsiteClicks: { type: Number, default: 0 },
    currentMonthKey: { type: String }, // "2026-01"

    isFeatured: { type: Boolean, default: true }, 
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    profileViews: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    websiteClicks: { type: Number, default: 0 },
    minAmount:{type:Number,default:0},
    minTimeLine:{type:String},
    keyHighlights:[{type:String}]
  },
  { timestamps: true },
)

ProviderSchema.index({ location: 1 })
ProviderSchema.index({ services: 1 })
ProviderSchema.index({ rating: -1 })
ProviderSchema.index({ isFeatured: 1 })
ProviderSchema.index({ userId: 1 })

const Provider: Model<IProvider> = mongoose.models.Provider || mongoose.model<IProvider>("Provider", ProviderSchema)
export default Provider
