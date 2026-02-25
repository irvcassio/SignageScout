import type { Metadata } from "next"
import { searchVendors } from "@/lib/vendors"
import type { VendorSort } from "@/types/vendor"
import VendorCard from "@/components/VendorCard"
import FilterBar from "@/components/FilterBar"
import SearchInput from "@/components/SearchInput"
import Pagination from "@/components/Pagination"
import EmptyState from "@/components/EmptyState"

export const metadata: Metadata = {
  title: "Digital Signage Directory",
  description:
    "Browse and compare digital signage software, hardware, media players, and service providers. Filter by category, industry, and pricing.",
  alternates: {
    canonical: "/vendors",
  },
}

const PAGE_SIZE = 24

export default async function VendorsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    category?: string | string[]
    vertical?: string
    sort?: string
    page?: string
  }>
}) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page ?? "1"))
  const categories = params.category
    ? Array.isArray(params.category)
      ? params.category
      : [params.category]
    : []
  const sort = (params.sort as VendorSort) ?? "score"

  const { vendors, total } = await searchVendors({
    query: params.q,
    categories,
    vertical: params.vertical,
    page,
    pageSize: PAGE_SIZE,
    sort,
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Digital Signage Directory</h1>
        <p className="text-muted mt-2">
          {total} vendor{total !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="mb-6">
        <SearchInput />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <FilterBar />

        <div className="flex-1">
          {vendors.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {vendors.map((v) => (
                  <VendorCard key={v.slug} vendor={v} />
                ))}
              </div>
              <Pagination
                page={page}
                total={total}
                pageSize={PAGE_SIZE}
                basePath="/vendors"
                searchParams={params}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
