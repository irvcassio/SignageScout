import { dbConnect } from "./db"
import Vendor from "@/models/Vendor"
import type { IVendor, VendorSort } from "@/types/vendor"

export async function getAllVendorSlugs(): Promise<string[]> {
  await dbConnect()
  const docs = await Vendor.find({}, { slug: 1, _id: 0 }).lean()
  return docs.map((d) => d.slug)
}

export async function getVendorBySlug(
  slug: string
): Promise<IVendor | null> {
  await dbConnect()
  return Vendor.findOne({ slug }).lean()
}

export interface SearchOptions {
  query?: string
  categories?: string[]
  vertical?: string
  page: number
  pageSize: number
  sort: VendorSort
}

export async function searchVendors(opts: SearchOptions) {
  await dbConnect()

  const filter: Record<string, unknown> = {}
  if (opts.categories?.length) {
    filter.categories = { $in: opts.categories }
  }
  if (opts.vertical) {
    filter.verticals = opts.vertical
  }
  if (opts.query) {
    filter.$text = { $search: opts.query }
  }

  const sortMap: Record<VendorSort, Record<string, 1 | -1>> = {
    score: { featured: -1, listingScore: -1, name: 1 },
    name: { name: 1 },
    newest: { createdAt: -1 },
  }
  const sortStage = sortMap[opts.sort] ?? sortMap.score

  const skip = (opts.page - 1) * opts.pageSize

  const [vendors, total] = await Promise.all([
    Vendor.find(filter)
      .sort(sortStage)
      .skip(skip)
      .limit(opts.pageSize)
      .lean(),
    Vendor.countDocuments(filter),
  ])

  return { vendors: vendors as IVendor[], total }
}

export async function getVendorsByCategory(
  category: string,
  limit?: number
): Promise<IVendor[]> {
  await dbConnect()
  const query = Vendor.find({ categories: category })
    .sort({ featured: -1, listingScore: -1, name: 1 })
    .lean()
  if (limit) query.limit(limit)
  return query as Promise<IVendor[]>
}

export async function getVendorsByVertical(
  vertical: string,
  limit?: number
): Promise<IVendor[]> {
  await dbConnect()
  const query = Vendor.find({ verticals: vertical })
    .sort({ featured: -1, listingScore: -1, name: 1 })
    .lean()
  if (limit) query.limit(limit)
  return query as Promise<IVendor[]>
}

export async function getFeaturedVendors(
  limit = 6
): Promise<IVendor[]> {
  await dbConnect()
  return Vendor.find({ featured: true })
    .sort({ listingScore: -1 })
    .limit(limit)
    .lean() as Promise<IVendor[]>
}

export async function getRelatedVendors(
  vendor: IVendor,
  limit = 4
): Promise<IVendor[]> {
  await dbConnect()
  return Vendor.find({
    slug: { $ne: vendor.slug },
    $or: [
      { categories: { $in: vendor.categories } },
      { verticals: { $in: vendor.verticals } },
    ],
  })
    .sort({ featured: -1, listingScore: -1 })
    .limit(limit)
    .lean() as Promise<IVendor[]>
}

export async function getVendorCount(): Promise<number> {
  await dbConnect()
  return Vendor.countDocuments()
}

export async function getCategoryCount(
  category: string
): Promise<number> {
  await dbConnect()
  return Vendor.countDocuments({ categories: category })
}

export async function getVerticalCount(
  vertical: string
): Promise<number> {
  await dbConnect()
  return Vendor.countDocuments({ verticals: vertical })
}
