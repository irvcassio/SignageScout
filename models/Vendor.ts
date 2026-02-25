import mongoose, { Schema, type Model } from "mongoose"
import type { IVendor } from "@/types/vendor"

const vendorSchema = new Schema<IVendor>(
  {
    name: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    tagline: { type: String, maxlength: 160, default: "" },
    shortDescription: { type: String, maxlength: 320, default: "" },
    longDescription: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    websiteUrl: { type: String, default: "" },
    affiliateUrl: { type: String, default: null },
    categories: { type: [String], default: [], index: true },
    verticals: { type: [String], default: [], index: true },
    tags: { type: [String], default: [] },
    pricingModel: {
      type: String,
      enum: ["free", "freemium", "paid", "enterprise", "contact", null],
      default: null,
    },
    featured: { type: Boolean, default: false, index: true },
    verified: { type: Boolean, default: false },
    listingScore: { type: Number, default: 0 },
  },
  { timestamps: true }
)

vendorSchema.index({ categories: 1, listingScore: -1 })
vendorSchema.index({ verticals: 1, listingScore: -1 })
vendorSchema.index({ featured: 1, listingScore: -1 })
vendorSchema.index(
  { name: "text", tagline: "text", tags: "text", shortDescription: "text" },
  {
    weights: { name: 10, tagline: 5, tags: 3, shortDescription: 1 },
    name: "vendor_text_search",
  }
)

const Vendor: Model<IVendor> =
  mongoose.models.Vendor || mongoose.model<IVendor>("Vendor", vendorSchema)

export default Vendor
