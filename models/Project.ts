import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IProject extends Document {
  _id: mongoose.Types.ObjectId
  clientId: mongoose.Types.ObjectId
  title: string
  description: string
  category: string
  subcategory?: string
  budget: string
  budgetMin?: number
  budgetMax?: number
  timeline: string
  skills: string[]
  requirements?: string
  attachments?: string[]
  status: "draft" | "open" | "in-progress" | "completed" | "cancelled"
  proposalCount: number
  viewCount: number
  matchedProviders: number
  shortlistedProviders: mongoose.Types.ObjectId[]
  selectedProvider?: mongoose.Types.ObjectId
  isUrgent: boolean
  isFeatured: boolean
  publishedAt?: Date
  deadline?: Date
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: { type: String },
    budget: { type: String, required: true },
    budgetMin: { type: Number },
    budgetMax: { type: Number },
    timeline: { type: String, required: true },
    skills: [{ type: String }],
    requirements: { type: String },
    attachments: [{ type: String }],
    status: { type: String, enum: ["draft", "open", "in-progress", "completed", "cancelled"], default: "open" },
    proposalCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    matchedProviders: { type: Number, default: 0 },
    shortlistedProviders: [{ type: Schema.Types.ObjectId, ref: "Provider" }],
    selectedProvider: { type: Schema.Types.ObjectId, ref: "Provider" },
    isUrgent: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    publishedAt: { type: Date },
    deadline: { type: Date },
  },
  { timestamps: true },
)

ProjectSchema.index({ clientId: 1 })
ProjectSchema.index({ status: 1 })
ProjectSchema.index({ category: 1 })
ProjectSchema.index({ createdAt: -1 })

const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema)
export default Project
