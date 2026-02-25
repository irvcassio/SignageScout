import type { Metadata } from "next"
import Link from "next/link"
import { getAllGuides } from "@/lib/guides"

export const metadata: Metadata = {
  title: "Buyer Guides — Digital Signage",
  description:
    "In-depth guides to help you choose the right digital signage solution. Comparisons, buying guides, and industry-specific recommendations.",
  alternates: { canonical: "/guides" },
}

export default async function GuidesPage() {
  const guides = await getAllGuides()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Buyer Guides</h1>
      <p className="text-muted mb-8">
        In-depth guides to help you choose the right digital signage solution.
      </p>

      {guides.length === 0 ? (
        <p className="text-muted py-8">Guides coming soon.</p>
      ) : (
        <div className="space-y-6">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="block rounded-xl border border-border p-6 hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold group-hover:text-primary">
                {guide.meta.title}
              </h2>
              <p className="text-muted mt-2 text-sm">
                {guide.meta.description}
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-muted">
                <time dateTime={guide.meta.publishedAt}>
                  {new Date(guide.meta.publishedAt).toLocaleDateString(
                    "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </time>
                {guide.meta.tags.length > 0 && (
                  <div className="flex gap-1">
                    {guide.meta.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-card px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
