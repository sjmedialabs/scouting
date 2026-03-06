import mongoose, { Schema, models } from "mongoose";

const ReportedContentSchema = new Schema(
  {
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
     reportedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const ReportedContent =
  models.ReportedContent ||
  mongoose.model("ReportedContent", ReportedContentSchema);

export default ReportedContent;
