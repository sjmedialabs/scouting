import mongoose from "mongoose";

export function toObjectId(id: string) {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ObjectId");
  }
  return new mongoose.Types.ObjectId(id);
}
