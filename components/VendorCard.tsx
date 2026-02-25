import Link from "next/link"
import type { IVendor } from "@/types/vendor"

function PricingBadge({ model }: { model: string | null }) {
  if (!model) return null
  const colors: Record<string, string> = {
    free: "bg-green-100 text-green-700",
    freemium: "bg-blue-100 text-blue-700",
    paid: "bg-gray-100 text-gray-700",
    enterprise: "bg-purple-100 text-purple-700",
    contact: "bg-amber-100 text-amber-700",
  }
  const labels: Record<string, string> = {
    free: "Free",
    freemium: "Freemium",
    paid: "Paid",
    enterprise: "Enterprise",
    contact: "Contact for pricing",
  }
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colors[model] ?? "bg-gray-100 text-gray-700"}`}
    >
      {labels[model] ?? model}
    </span>
  )
}

function VendorInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm shrink-0">
      {initials}
    </div>
  )
}

export default function VendorCard({ vendor }: { vendor: IVendor }) {
  return (
    <Link
      href={`/vendors/${vendor.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-white p-5 transition hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <VendorInitials name={vendor.name} />
        <div className="min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary truncate">
            {vendor.name}
          </h3>
          {vendor.tagline && (
            <p className="text-xs text-muted truncate">{vendor.tagline}</p>
          )}
        </div>
        {vendor.featured && (
          <span className="ml-auto shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
            Featured
          </span>
        )}
      </div>

      <p className="mt-3 flex-1 text-sm text-muted line-clamp-2">
        {vendor.shortDescription}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <PricingBadge model={vendor.pricingModel} />
        {vendor.categories.slice(0, 2).map((cat) => (
          <span
            key={cat}
            className="rounded-full bg-card px-2 py-0.5 text-xs text-muted"
          >
            {cat}
          </span>
        ))}
      </div>
    </Link>
  )
}
