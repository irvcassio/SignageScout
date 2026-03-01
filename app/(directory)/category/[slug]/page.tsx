import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getVendorsByCategory, getCategoryCount } from "@/lib/vendors"
import { CATEGORIES, getCategoryBySlug } from "@/types/taxonomy"
import VendorCard from "@/components/VendorCard"
import JsonLd from "@/components/JsonLd"

export const revalidate = 1800

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}

  return {
    title: `${category.name} — Digital Signage Directory`,
    description: `Find and compare digital signage ${category.name.toLowerCase()} providers. ${category.description}`,
    alternates: {
      canonical: `/category/${slug}`,
    },
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  let vendors: Awaited<ReturnType<typeof getVendorsByCategory>> = []
  let count = 0
  try {
    vendors = await getVendorsByCategory(slug)
    count = await getCategoryCount(slug)
  } catch {
    vendors = []
    count = 0
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.name} — Digital Signage`,
    description: category.description,
    numberOfItems: count,
    itemListElement: vendors.slice(0, 10).map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: v.name,
      url: `https://signagescout.com/vendors/${v.slug}`,
    })),
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="text-muted mt-2">{category.description}</p>
        <p className="text-sm text-muted mt-1">
          {count} vendor{count !== 1 ? "s" : ""}
        </p>
      </div>

      {vendors.length === 0 ? (
        <p className="text-muted py-8">No vendors found in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {vendors.map((v) => (
            <VendorCard key={v.slug} vendor={v} />
          ))}
        </div>
      )}
    </>
  )
}
