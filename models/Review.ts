import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId
  providerId: mongoose.Types.ObjectId
  clientId: mongoose.Types.ObjectId
  projectId: mongoose.Types.ObjectId
  rating: number
  qualityRating: number
  scheduleRating: number
  costRating: number
  willingToReferRating: number
  projectStartDate?: Date
  projectEndDate?: Date
  title: string
  content: string
  pros?: string[]
  cons?: string[]
  keyHighLights?: string[]
  isVerified: boolean
  isPublic: boolean
  response?: {
    content: string
    respondedAt: Date
  }
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    providerId: { type: Schema.Types.ObjectId, ref: "Provider", required: true },
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Requirement", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    qualityRating: { type: Number, required: true, min: 1, max: 5 },
    scheduleRating: { type: Number, required: true, min: 1, max: 5 },
    costRating: { type: Number, required: true, min: 1, max: 5 },
    willingToReferRating: { type: Number, required: true, min: 1, max: 5 },
    projectStartDate: { type: Date },
    projectEndDate: { type: Date },
    title: { type: String},
    content: { type: String, required: true },
    pros: [{ type: String }],
    cons: [{ type: String }],
    keyHighLights: [{ type: String }],
    isVerified: { type: Boolean, default: false },


    isPublic: { type: Boolean, default: true },
    response: {
      content: { type: String },
      respondedAt: { type: Date },
    },
  },
  { timestamps: true },
)

ReviewSchema.index({ providerId: 1 })
ReviewSchema.index({ clientId: 1 })
ReviewSchema.index({ rating: -1 })

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema)
export default Review
