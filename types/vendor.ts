export interface IVendor {
  _id: string
  name: string
  slug: string
  tagline: string
  shortDescription: string
  longDescription: string
  logoUrl: string
  websiteUrl: string
  affiliateUrl: string | null
  categories: string[]
  verticals: string[]
  tags: string[]
  pricingModel:
    | "free"
    | "freemium"
    | "paid"
    | "enterprise"
    | "contact"
    | null
  featured: boolean
  verified: boolean
  listingScore: number
  createdAt: string
  updatedAt: string
}

export type VendorSort = "score" | "name" | "newest"
