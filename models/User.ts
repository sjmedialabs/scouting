import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  email: string
  password: string
  name: string
  role: "client" | "agency" | "admin"
  company?: string
  phone?: string
  avatar?: string
  isVerified: boolean
  isActive: boolean
  lastLogin?: Date

  subscriptionPlanId?: mongoose.Types.ObjectId
  subscriptionStartDate?: Date
  subscriptionEndDate?: Date
  billingCycle?:"Yearly" | "Monthly"

  proposalCount:Number

  
  createdAt: Date
  updatedAt: Date
  resetPasswordToken?: string
  resetPasswordExpires?: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ["client", "agency", "admin"], required: true },
    company: { type: String, trim: true },
    phone: { type: String, trim: true },
    avatar: { type: String },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    subscriptionPlanId:{type: Schema.Types.ObjectId,ref:"Subscription"},
    subscriptionStartDate:{type:Date},
    subscriptionEndDate:{type:Date},
    billingCycle:{type:String,enum:["Yearly","Monthly"],default:"Monthly"},
    proposalCount:{type:Number,default:0},
    lastLogin: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
)

UserSchema.index({ role: 1 })

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
export default User
