import mongoose from "mongoose"
import fs from "fs"
import path from "path"

// Load vendor model schema inline to avoid @/ alias issues in scripts
const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    tagline: { type: String, maxlength: 160, default: "" },
    shortDescription: { type: String, maxlength: 320, default: "" },
    longDescription: { type: String, default: "" },
    logoUrl: { type: String, default: "" },
    websiteUrl: { type: String, default: "" },
    affiliateUrl: { type: String, default: null },
    categories: { type: [String], default: [] },
    verticals: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    pricingModel: {
      type: String,
      enum: ["free", "freemium", "paid", "enterprise", "contact", null],
      default: null,
    },
    featured: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    listingScore: { type: Number, default: 0 },
  },
  { timestamps: true }
)

async function seed() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.error("MONGODB_URI is required. Set it as an environment variable.")
    process.exit(1)
  }

  console.log("Connecting to MongoDB...")
  await mongoose.connect(uri)

  const Vendor =
    mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema)

  const dataPath = path.join(process.cwd(), "data", "vendors.json")
  const raw = fs.readFileSync(dataPath, "utf-8")
  const vendors = JSON.parse(raw)

  console.log(`Found ${vendors.length} vendors in data/vendors.json`)

  let created = 0
  let updated = 0
  let errors = 0

  for (const vendor of vendors) {
    try {
      const result = await Vendor.findOneAndUpdate(
        { slug: vendor.slug },
        { $set: vendor },
        { upsert: true, new: true }
      )
      if (result.createdAt.getTime() === result.updatedAt.getTime()) {
        created++
      } else {
        updated++
      }
    } catch (err) {
      errors++
      console.error(`Error seeding ${vendor.slug}:`, err)
    }
  }

  console.log(`\nSeed complete:`)
  console.log(`  Created: ${created}`)
  console.log(`  Updated: ${updated}`)
  console.log(`  Errors:  ${errors}`)
  console.log(`  Total:   ${await Vendor.countDocuments()}`)

  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
