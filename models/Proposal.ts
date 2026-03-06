import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IProposal extends Document {
  _id: mongoose.Types.ObjectId
  clientId: mongoose.Types.ObjectId
  agencyId: mongoose.Types.ObjectId
  requirementId: mongoose.Types.ObjectId
  
  coverLetter: string
  proposedBudget: number
  proposedTimeline: string
  proposalDescription?:string
  milestones?: {
    title: string
    description: string
    amount: number
    duration: string
  }[]
  attachments?: string[]
  status: "pending" | "viewed" | "shortlisted" | "accepted" | "rejected" | "withdrawn" | "negotation"
  clientViewed: boolean
  clientViewedAt?: Date
  clientResponded: boolean
  clientRespondedAt?: Date
  conversationStarted: boolean
  rating?: {
    quality: number
    schedule: number
    cost: number
    willingToRefer: number
  }
  createdAt: Date
  updatedAt: Date
}

const MilestoneSchema = new Schema({
  title: { type: String},
  description: { type: String },
  amount: { type: Number},
  duration: { type: String},
  completed: { type: Boolean, default: false },
})

const ProposalSchema = new Schema<IProposal>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    agencyId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requirementId: { type: Schema.Types.ObjectId, ref: "Requirement", required: true },
   
    coverLetter: { type: String, },
    proposedBudget: { type: Number, required: true },
    proposedTimeline: { type: String, required: true },
    milestones: [MilestoneSchema],
    attachments: [{ type: String }],
    status: {
      type: String,
     enum: ["pending", "viewed", "shortlisted", "accepted", "rejected", "withdrawn","negotation","completed"],
      default: "pending",
    },
    clientViewed: { type: Boolean, default: false },
    clientViewedAt: { type: Date },
    clientResponded: { type: Boolean, default: false },
    proposalDescription:{type:String},
    clientRespondedAt: { type: Date },
    conversationStarted: { type: Boolean, default: false },
    rating: {
      quality: { type: Number, min: 1, max: 5 },
      schedule: { type: Number, min: 1, max: 5 },
      cost: { type: Number, min: 1, max: 5 },
      willingToRefer: { type: Number, min: 1, max: 5 },
    },
  },
  { timestamps: true },
)

ProposalSchema.index({ projectId: 1 })
ProposalSchema.index({ providerId: 1 })
ProposalSchema.index({ userId: 1 })
ProposalSchema.index({ status: 1 })

const Proposal: Model<IProposal> = mongoose.models.Proposal || mongoose.model<IProposal>("Proposal", ProposalSchema)
export default Proposal
