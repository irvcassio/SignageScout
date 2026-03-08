import Link from "next/link"
import type { IVendor } from "@/types/vendor"
import { getCategoryBySlug, getVerticalBySlug } from "@/types/taxonomy"
import VendorCard from "./VendorCard"

function VendorInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-2xl shrink-0">
      {initials}
    </div>
  )
}

export default function VendorProfile({
  vendor,
  relatedVendors,
}: {
  vendor: IVendor
  relatedVendors: IVendor[]
}) {
  const pricingLabels: Record<string, string> = {
    free: "Free",
    freemium: "Freemium",
    paid: "Paid",
    enterprise: "Enterprise",
    contact: "Contact for pricing",
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-6 mb-8">
        <VendorInitials name={vendor.name} />
        <div>
          <h1 className="text-3xl font-bold">{vendor.name}</h1>
          {vendor.tagline && (
            <p className="text-lg text-muted mt-1">{vendor.tagline}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            {vendor.featured && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                Featured
              </span>
            )}
            {vendor.verified && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
                Verified
              </span>
            )}
            {vendor.pricingModel && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                {pricingLabels[vendor.pricingModel] ?? vendor.pricingModel}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-3">About</h2>
            <p className="text-muted leading-relaxed whitespace-pre-line">
              {vendor.longDescription || vendor.shortDescription}
            </p>
          </section>

          {vendor.tags.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold mb-3">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {vendor.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-card border border-border px-3 py-1 text-xs text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border p-5 space-y-4">
            <a
              href={`/go/${vendor.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg bg-primary px-4 py-2.5 text-center text-white font-medium hover:bg-primary-dark transition-colors"
            >
              Visit Website
            </a>

            {vendor.categories.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-1">
                  {vendor.categories.map((slug) => {
                    const cat = getCategoryBySlug(slug)
                    return (
                      <Link
                        key={slug}
                        href={`/category/${slug}`}
                        className="rounded-full bg-card border border-border px-2.5 py-1 text-xs hover:border-primary transition-colors"
                      >
                        {cat?.name ?? slug}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {vendor.verticals.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
                  Industries Served
                </h3>
                <div className="flex flex-wrap gap-1">
                  {vendor.verticals.map((slug) => {
                    const v = getVerticalBySlug(slug)
                    return (
                      <Link
                        key={slug}
                        href={`/vertical/${slug}`}
                        className="rounded-full bg-card border border-border px-2.5 py-1 text-xs hover:border-primary transition-colors"
                      >
                        {v?.name ?? slug}
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {relatedVendors.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold mb-4">Related Vendors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {relatedVendors.map((v) => (
              <VendorCard key={v.slug} vendor={v} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
