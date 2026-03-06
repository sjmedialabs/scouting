import mongoose, { Schema, Document } from "mongoose"

export interface ISearchKeyword extends Document {
  keyword: string
  searchCount: number
  createdAt: Date
  updatedAt: Date
}

const SearchKeywordSchema = new Schema<ISearchKeyword>(
  {
    keyword: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    searchCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

delete mongoose.models.SearchKeyword
export default mongoose.model<ISearchKeyword>(
  "SearchKeyword",
  SearchKeywordSchema,
)
