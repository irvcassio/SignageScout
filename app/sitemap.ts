import type { MetadataRoute } from "next"
import { getAllVendorSlugs } from "@/lib/vendors"
import { getAllCategorySlugs, getAllVerticalSlugs } from "@/lib/taxonomy"

export const revalidate = 86400

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://signagescout.com"

  let vendorSlugs: string[] = []
  try {
    vendorSlugs = await getAllVendorSlugs()
  } catch {
    // DB not available during build without MONGODB_URI
  }

  const categorySlugs = getAllCategorySlugs()
  const verticalSlugs = getAllVerticalSlugs()

  const vendorUrls = vendorSlugs.map((slug) => ({
    url: `${siteUrl}/vendors/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const categoryUrls = categorySlugs.map((slug) => ({
    url: `${siteUrl}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }))

  const verticalUrls = verticalSlugs.map((slug) => ({
    url: `${siteUrl}/vertical/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/vendors`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...categoryUrls,
    ...verticalUrls,
    ...vendorUrls,
  ]
}
