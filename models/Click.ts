import mongoose, { Schema, type Model } from "mongoose"

export interface IClick {
  vendorSlug: string
  sourcePath: string
  destinationUrl: string
  isAffiliate: boolean
  timestamp: Date
  userAgent: string
}

const clickSchema = new Schema<IClick>({
  vendorSlug: { type: String, required: true, index: true },
  sourcePath: { type: String, default: "/" },
  destinationUrl: { type: String, required: true },
  isAffiliate: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now, index: true },
  userAgent: { type: String, default: "" },
})

clickSchema.index({ vendorSlug: 1, timestamp: -1 })
clickSchema.index({ timestamp: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 })

const Click: Model<IClick> =
  mongoose.models.Click || mongoose.model<IClick>("Click", clickSchema)

export default Click
