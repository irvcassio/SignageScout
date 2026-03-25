import mongoose, { Schema, type Model } from "mongoose"

export interface IVendorClaim {
  _id: string
  accountId: string
  vendorSlug: string | null
  companyName: string
  websiteUrl: string
  contactEmail: string
  message: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  updatedAt: string
}

const vendorClaimSchema = new Schema<IVendorClaim>(
  {
    accountId: { type: String, required: true, index: true },
    vendorSlug: { type: String, default: null },
    companyName: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    contactEmail: { type: String, required: true },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
)

const VendorClaim: Model<IVendorClaim> =
  mongoose.models.VendorClaim ||
  mongoose.model<IVendorClaim>("VendorClaim", vendorClaimSchema)

export default VendorClaim
