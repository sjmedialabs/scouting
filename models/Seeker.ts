import mongoose, { Schema, models, model } from "mongoose";

const SeekerSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    
    name: { type: String },
    email: { type: String},
    phoneNumber: { type: String},
    companyName: { type: String },
    position: { type: String },
    industry: { type: String },
    location: { type: String },
    website: { type: String },
    bio: { type: String },
    timeZone: { type: String },
    preferredCommunication: { type: String }, // FIXED TYPO
    typicalProjectBudget: { type: String }, // FIXED TYPO
    companySize: { type: String },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    image: { type: String },
  },
  { timestamps: true }
);

export default models.Seeker || model("Seeker", SeekerSchema);
