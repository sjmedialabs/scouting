// models/FreeTrialConfig.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IFreeTrialConfig extends Document {
  proposalLimit: number;
}

const FreeTrialConfigSchema = new Schema<IFreeTrialConfig>(
  {
    proposalLimit: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.FreeTrialConfig ||
  mongoose.model<IFreeTrialConfig>("FreeTrialConfig", FreeTrialConfigSchema);
