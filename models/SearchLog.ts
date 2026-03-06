import mongoose, { Schema, Document } from "mongoose"

export interface ISearchLog extends Document {
  keyword: string
  ipAddress: string
  searchedDate: string
  createdAt: Date
}

const SearchLogSchema = new Schema<ISearchLog>(
  {
    keyword: {
      type: String,
      required: true,
      index: true,
    },

    ipAddress: {
      type: String,
      required: true,
      index: true,
    },

    
    searchedDate: {
      type: String, // yyyy-mm-dd
      required: true,
      index: true,
    },
  },
  { timestamps: true }
)

// KEY INDEX (ONLY ONCE PER DAY)
SearchLogSchema.index(
  { keyword: 1, ipAddress: 1, searchedDate: 1 },
  { unique: true },
)

delete mongoose.models.SearchLog
export default mongoose.model<ISearchLog>("SearchLog", SearchLogSchema)
