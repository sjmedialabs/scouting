import mongoose, { Schema, Document, Model } from "mongoose"
export interface IComparision extends Document {
    clientId: mongoose.Types.ObjectId
    agencyId: mongoose.Types.ObjectId
    isFavourite?:boolean
}
const ComparisionSchema = new Schema<IComparision>({
    clientId: { type: Schema.Types.ObjectId, ref: "Seeker", required: true },
    agencyId: { type: Schema.Types.ObjectId, ref: "Provider", required: true },
    isFavourite:{type:Boolean,default:false}
}, { timestamps: true })
export default mongoose.models.Comparision || mongoose.model<IComparision>("Comparision", ComparisionSchema)

