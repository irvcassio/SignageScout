import mongoose, { Schema, type Model } from "mongoose"

export interface IVendorAccount {
  _id: string
  email: string
  passwordHash: string
  companyName: string
  vendorSlug: string | null
  verified: boolean
  createdAt: string
  updatedAt: string
}

const vendorAccountSchema = new Schema<IVendorAccount>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    companyName: { type: String, required: true, trim: true },
    vendorSlug: { type: String, default: null, index: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const VendorAccount: Model<IVendorAccount> =
  mongoose.models.VendorAccount ||
  mongoose.model<IVendorAccount>("VendorAccount", vendorAccountSchema)

export default VendorAccount
