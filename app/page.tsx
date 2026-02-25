import Link from "next/link"
import { CATEGORIES, VERTICALS } from "@/types/taxonomy"

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Find the Right Digital Signage Solution
        </h1>
        <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
          Compare 200+ digital signage software, hardware, and service
          providers. The curated directory for the digital signage industry.
        </p>
        <div className="mt-8">
          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-white font-medium hover:bg-primary-dark transition-colors"
          >
            Browse Directory
          </Link>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="rounded-lg border border-border p-4 hover:bg-card transition-colors"
            >
              <h3 className="font-semibold">{cat.name}</h3>
              <p className="text-sm text-muted mt-1">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Browse by Industry</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {VERTICALS.map((v) => (
            <Link
              key={v.slug}
              href={`/vertical/${v.slug}`}
              className="rounded-lg border border-border p-3 hover:bg-card transition-colors text-center"
            >
              <span className="font-medium text-sm">{v.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
