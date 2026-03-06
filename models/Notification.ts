import mongoose, { Schema, Document } from "mongoose"

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId        // receiver
  triggeredBy?: mongoose.Types.ObjectId  // sender (optional)
  title: string
  message: string
  type: string
  userRole?: string
  linkUrl?: string
  isRead: boolean
  sourceId?: mongoose.Types.ObjectId
}


const NotificationSchema = new Schema<INotification>(
  {
    // 👇 RECEIVER of the notification
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 👇 USER who caused the event (proposal submitter, agency, etc.)
    triggeredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    title: { type: String, required: true },
    message: { type: String, required: true },

    type: {
      type: String,
      required: true,
    },

    userRole: {
      type: String,
      required: true,
    },

    linkUrl: { type: String },

    isRead: { type: Boolean, default: false },

    sourceId: {
      type: Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
)


export default mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema)
