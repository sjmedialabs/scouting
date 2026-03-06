import mongoose, { Schema, Document } from "mongoose"

export interface IWishlist extends Document {
  clientId: mongoose.Types.ObjectId
  agencyId: mongoose.Types.ObjectId
}

const WishlistSchema = new Schema<IWishlist>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: "Seeker", required: true },
    agencyId: { type: Schema.Types.ObjectId, ref: "Provider", required: true },
  },
  { timestamps: true }
)

export default mongoose.models.Wishlist ||
  mongoose.model<IWishlist>("Wishlist", WishlistSchema)
