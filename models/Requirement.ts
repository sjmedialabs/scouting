import mongoose, { Schema, Document, Model } from "mongoose"

export interface IRequirement extends Document {
  title: string
  image: string
  category: string
  budgetMin: number
  budgetMax: number
  timeline: string
  description: string
  postedDate: Date
  documentUrl:string
  proposals: number
  status:"UnderReview" | "NotApproved" | "Open" | "Closed" | "shortlisted" | "negotation" | "Allocated"
  clientId: mongoose.Types.ObjectId // always client ID
  allocatedToId:mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
  isReviewed?: boolean,
  notApprovedMsg:String

}

const RequirementSchema = new Schema<IRequirement>(
  {
    title: { type: String},
    image: { type: String },
    category: { type: String},
    budgetMin: { type: Number},
    budgetMax: { type: Number},
    timeline: { type: String},
    description: { type: String },

    postedDate: { type: Date, default: Date.now },
    proposals: { type: Number, default: 0 },

    documentUrl:{type:String},

    status: { type: String, enum: ["UnderReview" , "NotApproved" ,"Open", "Closed","shortlisted","negotation","Allocated"], default: "UnderReview" },

    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    allocatedToId:{ type: Schema.Types.ObjectId, ref: "User" },
    isReviewed: { type: Boolean, default: false },
    notApprovedMsg:{type:String}
    
  }, 
  { timestamps: true },
)
delete mongoose.models.Requirement;
export default mongoose.model<IRequirement>("Requirement", RequirementSchema)
