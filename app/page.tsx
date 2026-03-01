import Link from "next/link"
import { VERTICALS } from "@/types/taxonomy"
import { getFeaturedVendors } from "@/lib/vendors"
import { getAllGuides } from "@/lib/guides"
import CategoryGrid from "@/components/CategoryGrid"
import FeaturedVendors from "@/components/FeaturedVendors"

export default async function Home() {
  let featuredVendors: Awaited<ReturnType<typeof getFeaturedVendors>> = []
  try {
    featuredVendors = await getFeaturedVendors(6)
  } catch {
    // DB not available at build time
  }

  let recentGuides: Awaited<ReturnType<typeof getAllGuides>> = []
  try {
    recentGuides = (await getAllGuides()).slice(0, 3)
  } catch {
    // Guides may not be available
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            SignageScout
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/vendors"
              className="text-muted hover:text-foreground transition-colors"
            >
              Directory
            </Link>
            <Link
              href="/guides"
              className="text-muted hover:text-foreground transition-colors"
            >
              Guides
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-16">
        {/* Hero */}
        <section className="text-center mb-20">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Find the Right Digital Signage Solution
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
            Compare 200+ digital signage software, hardware, and service
            providers. The curated directory for the digital signage industry.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/vendors"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-white font-medium hover:bg-primary-dark transition-colors"
            >
              Browse Directory
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-medium text-foreground hover:bg-card transition-colors"
            >
              Read Guides
            </Link>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Browse by Category</h2>
            <Link
              href="/vendors"
              className="text-sm text-primary hover:underline"
            >
              View all vendors
            </Link>
          </div>
          <CategoryGrid />
        </section>

        {/* Featured Vendors */}
        {featuredVendors.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Featured Vendors</h2>
              <Link
                href="/vendors"
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </div>
            <FeaturedVendors vendors={featuredVendors} />
          </section>
        )}

        {/* Browse by Industry */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Browse by Industry</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {VERTICALS.map((v) => (
              <Link
                key={v.slug}
                href={`/vertical/${v.slug}`}
                className="rounded-xl border border-border bg-white p-4 hover:shadow-md hover:border-primary/30 transition-all text-center"
              >
                <span className="font-medium text-sm">{v.name}</span>
                <p className="text-xs text-muted mt-1">{v.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Guides */}
        {recentGuides.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Latest Guides</h2>
              <Link
                href="/guides"
                className="text-sm text-primary hover:underline"
              >
                View all guides
              </Link>
            </div>
            <div className="grid gap-4">
              {recentGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group rounded-xl border border-border bg-white p-5 hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-primary">
                    {guide.meta.title}
                  </h3>
                  <p className="text-sm text-muted mt-1 line-clamp-2">
                    {guide.meta.description}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-muted">
                    <time>{guide.meta.publishedAt}</time>
                    {guide.meta.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-card px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="text-center rounded-2xl bg-card border border-border p-12">
          <h2 className="text-2xl font-bold">
            Are You a Digital Signage Vendor?
          </h2>
          <p className="mt-3 text-muted max-w-lg mx-auto">
            Get listed in the SignageScout directory and reach thousands of buyers
            searching for digital signage solutions.
          </p>
          <Link
            href="/vendors"
            className="mt-6 inline-flex items-center rounded-lg bg-primary px-6 py-3 text-white font-medium hover:bg-primary-dark transition-colors"
          >
            Claim Your Listing
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-muted">
          <p>SignageScout — The digital signage industry directory</p>
        </div>
      </footer>
    </div>
  )
}
