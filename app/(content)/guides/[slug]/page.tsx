import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getAllGuideSlugs, getGuideMeta } from "@/lib/guides"
import JsonLd from "@/components/JsonLd"

export const revalidate = 86400

export function generateStaticParams() {
  const slugs = getAllGuideSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const meta = await getGuideMeta(slug)
  if (!meta) return {}

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/guides/${slug}` },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: "article",
      publishedTime: meta.publishedAt,
    },
  }
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let Content: React.ComponentType
  let metadata: { title: string; description: string; publishedAt: string; tags: string[] }

  try {
    const mod = await import(`@/content/guides/${slug}.mdx`)
    Content = mod.default
    metadata = mod.metadata
  } catch {
    notFound()
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: metadata.title,
    description: metadata.description,
    datePublished: metadata.publishedAt,
    publisher: {
      "@type": "Organization",
      name: "SignageHub",
      url: "https://signagehub.com",
    },
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <article>
        <header className="mb-8">
          <Link
            href="/guides"
            className="text-sm text-muted hover:text-primary mb-4 inline-block"
          >
            &larr; All Guides
          </Link>
          <h1 className="text-3xl font-bold">{metadata.title}</h1>
          <div className="flex items-center gap-4 mt-3 text-sm text-muted">
            <time dateTime={metadata.publishedAt}>
              {new Date(metadata.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </header>

        <div className="prose prose-gray max-w-none prose-headings:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
          <Content />
        </div>

        <footer className="mt-12 pt-8 border-t border-border">
          <Link
            href="/vendors"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-white font-medium hover:bg-primary-dark transition-colors"
          >
            Browse the Directory
          </Link>
        </footer>
      </article>
    </>
  )
}
