import mongoose, { Schema, type Document, type Model } from "mongoose"

export interface IContact extends Document {
    name:string
    email:string
    company:string
    website:string
    country:string
    phone:string
    createdAt:Date
    updatedAt:Date
}

const ContactSchema = new Schema<IContact>(
    {
        name: {type:String, required: true, trim:true},
        email: {type:String, requried:true, lowercase:true, trim:true},
        company: {type:String, requried:true, trim:true},
        website: {type:String, requried:true, trim:true},
        country: {type:String, requried:true, trim:true},
        phone: {type:String, requried:true, trim:true},
    },
    { timestamps:true}
)

const Contact: Model<IContact> =
mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema)

export default Contact