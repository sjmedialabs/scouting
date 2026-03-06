import mongoose from "mongoose";

const ServiceCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, 
    slug: { type: String, required: true, unique: true },
    icon: { type: String, default: "" },
    // Shown directly on the navigation bar
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "ServiceCategory", default: null },

    // Only parent categories appear on navbar
    isMainCategory: { type: Boolean, default: false },

    // Subcategories
    children: [
      {
        title: { type: String, required: true },
        slug: { type: String, required: true },

        // service items inside each subcategory
        items: [
          {
            title: { type: String, required: true },
            slug: { type: String, required: true }
          }
        ]
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.ServiceCategory ||
  mongoose.model("ServiceCategory", ServiceCategorySchema);
