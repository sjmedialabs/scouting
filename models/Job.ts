import mongoose, { Schema, models } from "mongoose"

const JobSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },

    description: { type: String, required: true },
    location: String,
    email: String,
    website: String,

    responsibilities: { type: String }, 
    skills: { type: String },            

    experience: String,
    salaryRange: String,
    department: String,
    employmentType: String,

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default models.Job || mongoose.model("Job", JobSchema)
