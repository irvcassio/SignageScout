import Link from "next/link"

export default function EmptyState({
  title = "No vendors found",
  message = "Try adjusting your filters or search query.",
  showReset = true,
}: {
  title?: string
  message?: string
  showReset?: boolean
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-12 text-center">
      <div className="text-4xl mb-4">🔍</div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted mt-2 max-w-md mx-auto">{message}</p>
      {showReset && (
        <Link
          href="/vendors"
          className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm text-white font-medium hover:bg-primary-dark transition-colors"
        >
          Clear all filters
        </Link>
      )}
    </div>
  )
}
