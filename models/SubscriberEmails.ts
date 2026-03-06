import mongoose, { Schema, Document } from "mongoose"

export interface INewsletterSubscription extends Document {
  email: string
  createdAt: Date
}

const NewsletterSubscriptionSchema = new Schema<INewsletterSubscription>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
  },
  { timestamps: true }
)

// Prevent model overwrite in Next.js
delete mongoose.models.NewsletterSubscription
export default mongoose.model<INewsletterSubscription>(
  "NewsletterSubscription",
  NewsletterSubscriptionSchema
)
