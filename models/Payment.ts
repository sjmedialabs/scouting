// models/Payment.ts
import mongoose, { Schema } from "mongoose"

const PaymentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    planId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },

    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    status: {
      type: String,
      enum: ["created", "success", "failed"],
      default: "created",
    },

    subscriptionStartDate: Date,
    subscriptionEndDate: Date,
  },
  { timestamps: true }
)

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema)
