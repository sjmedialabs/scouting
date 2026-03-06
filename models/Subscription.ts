import mongoose, { Schema, Document } from "mongoose"

export interface ISubscription extends Document {
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

const SubscriptionSchema = new Schema<ISubscription>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    pricePerMonth: {
      type: Number,
      required: true,
    },

    pricePerYear: {
      type: Number,
      required: true,
    },

    yearlySubscription: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      default: "",
    },

    features: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema)
