import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getVendorsByVertical, getVerticalCount } from "@/lib/vendors"
import { VERTICALS, getVerticalBySlug } from "@/types/taxonomy"
import VendorCard from "@/components/VendorCard"
import JsonLd from "@/components/JsonLd"

export const revalidate = 1800

export function generateStaticParams() {
  return VERTICALS.map((v) => ({ slug: v.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const vertical = getVerticalBySlug(slug)
  if (!vertical) return {}

  return {
    title: `Digital Signage for ${vertical.name}`,
    description: `Find digital signage solutions for ${vertical.name.toLowerCase()}. ${vertical.description}`,
    alternates: {
      canonical: `/vertical/${slug}`,
    },
  }
}

export default async function VerticalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const vertical = getVerticalBySlug(slug)
  if (!vertical) notFound()

  let vendors: Awaited<ReturnType<typeof getVendorsByVertical>> = []
  let count = 0
  try {
    vendors = await getVendorsByVertical(slug)
    count = await getVerticalCount(slug)
  } catch {
    vendors = []
    count = 0
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Digital Signage for ${vertical.name}`,
    description: vertical.description,
    numberOfItems: count,
    itemListElement: vendors.slice(0, 10).map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: v.name,
      url: `https://signagehub.com/vendors/${v.slug}`,
    })),
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Digital Signage for {vertical.name}
        </h1>
        <p className="text-muted mt-2">{vertical.description}</p>
        <p className="text-sm text-muted mt-1">
          {count} vendor{count !== 1 ? "s" : ""}
        </p>
      </div>

      {vendors.length === 0 ? (
        <p className="text-muted py-8">No vendors found for this industry yet.</p>
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
