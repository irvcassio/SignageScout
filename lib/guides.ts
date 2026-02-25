import fs from "fs"
import path from "path"

export interface GuideMeta {
  title: string
  description: string
  publishedAt: string
  tags: string[]
}

export interface Guide {
  slug: string
  meta: GuideMeta
}

const GUIDES_DIR = path.join(process.cwd(), "content", "guides")

export function getAllGuideSlugs(): string[] {
  try {
    return fs
      .readdirSync(GUIDES_DIR)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""))
  } catch {
    return []
  }
}

export async function getGuideMeta(slug: string): Promise<GuideMeta | null> {
  try {
    const mod = await import(`@/content/guides/${slug}.mdx`)
    return mod.metadata ?? null
  } catch {
    return null
  }
}

export async function getAllGuides(): Promise<Guide[]> {
  const slugs = getAllGuideSlugs()
  const guides: Guide[] = []

  for (const slug of slugs) {
    const meta = await getGuideMeta(slug)
    if (meta) {
      guides.push({ slug, meta })
    }
  }

  return guides.sort(
    (a, b) =>
      new Date(b.meta.publishedAt).getTime() -
      new Date(a.meta.publishedAt).getTime()
  )
}
