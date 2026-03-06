import mongoose, { Schema, Document, Model } from "mongoose"
export interface IContactProvider extends Document {
    clientId: mongoose.Types.ObjectId
    agencyId: mongoose.Types.ObjectId
    name:String
    email:String,
    message:String
    interstedService:String
}
const ContactProviderSchema = new Schema<IContactProvider>({
    clientId: { type: Schema.Types.ObjectId, ref: "Seeker", required: true },
    agencyId: { type: Schema.Types.ObjectId, ref: "Provider", required: true },
    name:{type:String},
    email:{type:String},
    message:{type:String},
    interstedService:{type:String}
    
}, { timestamps: true })
export default mongoose.models.ContactProvider || mongoose.model<IContactProvider>("ContactProvider",ContactProviderSchema )
