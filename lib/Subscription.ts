import mongoose, { Schema, model, models } from "mongoose";

const SubscriptionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
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
  { timestamps: true }
);

const Subscription = models.Subscription || model("Subscription", SubscriptionSchema);

export default Subscription;