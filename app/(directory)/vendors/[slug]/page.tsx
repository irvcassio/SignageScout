import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getAllVendorSlugs,
  getVendorBySlug,
  getRelatedVendors,
} from "@/lib/vendors"
import VendorProfile from "@/components/VendorProfile"
import JsonLd from "@/components/JsonLd"

export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const slugs = await getAllVendorSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const vendor = await getVendorBySlug(slug)
    if (!vendor) return {}

    return {
      title: `${vendor.name} — Digital Signage`,
      description:
        vendor.shortDescription || vendor.tagline || `${vendor.name} digital signage solutions`,
      alternates: {
        canonical: `/vendors/${slug}`,
      },
      openGraph: {
        title: vendor.name,
        description: vendor.shortDescription || vendor.tagline,
        type: "website",
      },
    }
  } catch {
    return {}
  }
}

export default async function VendorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let vendor
  try {
    vendor = await getVendorBySlug(slug)
  } catch {
    notFound()
  }
  if (!vendor) notFound()

  let relatedVendors: Awaited<ReturnType<typeof getRelatedVendors>> = []
  try {
    relatedVendors = await getRelatedVendors(vendor, 4)
  } catch {
    relatedVendors = []
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: vendor.name,
    description: vendor.shortDescription || vendor.tagline,
    url: vendor.websiteUrl,
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <VendorProfile vendor={vendor} relatedVendors={relatedVendors} />
    </>
  )
}
