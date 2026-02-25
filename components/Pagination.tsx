import Link from "next/link"

interface Props {
  page: number
  total: number
  pageSize: number
  basePath: string
  searchParams: Record<string, string | string[] | undefined>
}

export default function Pagination({
  page,
  total,
  pageSize,
  basePath,
  searchParams,
}: Props) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  function buildUrl(p: number) {
    const params = new URLSearchParams()
    for (const [k, v] of Object.entries(searchParams)) {
      if (k === "page") continue
      if (Array.isArray(v)) {
        v.forEach((val) => params.append(k, val))
      } else if (v) {
        params.set(k, v)
      }
    }
    if (p > 1) params.set("page", String(p))
    const qs = params.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => Math.abs(p - page) < 3 || p === 1 || p === totalPages
  )

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-8">
      {page > 1 && (
        <Link
          href={buildUrl(page - 1)}
          rel="prev"
          className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-card"
        >
          Previous
        </Link>
      )}
      {pages.map((p, i) => {
        const prevPage = pages[i - 1]
        const showEllipsis = prevPage && p - prevPage > 1
        return (
          <span key={p} className="flex items-center">
            {showEllipsis && <span className="px-2 text-muted">...</span>}
            <Link
              href={buildUrl(p)}
              aria-current={p === page ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm ${
                p === page
                  ? "bg-primary text-white"
                  : "border border-border hover:bg-card"
              }`}
            >
              {p}
            </Link>
          </span>
        )
      })}
      {page < totalPages && (
        <Link
          href={buildUrl(page + 1)}
          rel="next"
          className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-card"
        >
          Next
        </Link>
      )}
    </nav>
  )
}
