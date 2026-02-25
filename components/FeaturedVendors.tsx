import VendorCard from "./VendorCard"
import type { IVendor } from "@/types/vendor"

export default function FeaturedVendors({ vendors }: { vendors: IVendor[] }) {
  if (!vendors.length) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {vendors.map((vendor) => (
        <VendorCard key={vendor.slug} vendor={vendor} />
      ))}
    </div>
  )
}
