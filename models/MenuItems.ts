import mongoose, { Schema, Document } from "mongoose"

/* =======================
   Child Interface
======================= */
interface IMenuChild {
  title: string
  slug: string
  url?: string
  order: number
  isActive: boolean
}

/* =======================
   Parent Interface
======================= */
interface IMenuParent {
  title: string
  slug: string
  order: number
  isActive: boolean
  children: IMenuChild[]
}

/* =======================
   Grand Parent Interface
======================= */
export interface IMenu extends Document {
  title: string            // Grand Parent
  slug: string
  order: number
  isActive: boolean
  parents: IMenuParent[]
}

/* =======================
   Child Schema
======================= */
const MenuChildSchema = new Schema<IMenuChild>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    url: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { _id: true }
)

/* =======================
   Parent Schema
======================= */
const MenuParentSchema = new Schema<IMenuParent>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    children: { type: [MenuChildSchema], default: [] }
  },
  { _id: true }
)

/* =======================
   Grand Parent Schema
======================= */
const MenuSchema = new Schema<IMenu>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    parents: { type: [MenuParentSchema], default: [] }
  },
  { timestamps: true }
)

export default mongoose.models.Menu ||
  mongoose.model<IMenu>("Menu", MenuSchema)
