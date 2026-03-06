import mongoose, { Schema, models } from "mongoose"

const ApplicationSchema = new Schema(
  {
    jobTitle: String,
    firstName: String,
    lastName: String,
    phone: String,
    altPhone: String,
    email: String,
    gender: String,
    qualification: String,
    passedOutYear: String,
    experience: String,
    resumeName: String,
    resumeUrl: String,
    coverLetterName: String,
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
)

export default models.Application ||
  mongoose.model("Application", ApplicationSchema)
