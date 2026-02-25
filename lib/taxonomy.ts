import { CATEGORIES, VERTICALS } from "@/types/taxonomy"

export function getAllCategorySlugs(): string[] {
  return CATEGORIES.map((c) => c.slug)
}

export function getAllVerticalSlugs(): string[] {
  return VERTICALS.map((v) => v.slug)
}

export { CATEGORIES, VERTICALS, getCategoryBySlug, getVerticalBySlug } from "@/types/taxonomy"
