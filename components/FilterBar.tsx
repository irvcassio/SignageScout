"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback, useTransition } from "react"
import { CATEGORIES, VERTICALS } from "@/types/taxonomy"

export default function FilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const activeCategories = searchParams.getAll("category")
  const activeVertical = searchParams.get("vertical")
  const activeSort = searchParams.get("sort") ?? "score"

  const updateParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("page")

      for (const [key, value] of Object.entries(updates)) {
        params.delete(key)
        if (value === null) continue
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v))
        } else {
          params.set(key, value)
        }
      }

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      })
    },
    [router, pathname, searchParams]
  )

  const toggleCategory = useCallback(
    (slug: string) => {
      const current = activeCategories.includes(slug)
        ? activeCategories.filter((c) => c !== slug)
        : [...activeCategories, slug]
      updateParams({ category: current.length ? current : null })
    },
    [activeCategories, updateParams]
  )

  const setVertical = useCallback(
    (slug: string | null) => {
      updateParams({ vertical: slug })
    },
    [updateParams]
  )

  const setSort = useCallback(
    (sort: string) => {
      updateParams({ sort: sort === "score" ? null : sort })
    },
    [updateParams]
  )

  return (
    <aside
      className={`w-full lg:w-64 shrink-0 space-y-6 ${isPending ? "opacity-60 pointer-events-none" : ""}`}
    >
      <div>
        <h3 className="font-semibold text-sm mb-3">Category</h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <label
              key={cat.slug}
              className="flex cursor-pointer items-center gap-2 text-sm py-1"
            >
              <input
                type="checkbox"
                checked={activeCategories.includes(cat.slug)}
                onChange={() => toggleCategory(cat.slug)}
                className="rounded border-border"
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3">Industry</h3>
        <div className="space-y-1">
          <button
            onClick={() => setVertical(null)}
            className={`block text-sm py-1 w-full text-left rounded px-2 ${
              !activeVertical ? "font-bold text-primary bg-primary/5" : "hover:bg-card"
            }`}
          >
            All Industries
          </button>
          {VERTICALS.map((v) => (
            <button
              key={v.slug}
              onClick={() =>
                setVertical(activeVertical === v.slug ? null : v.slug)
              }
              className={`block text-sm py-1 w-full text-left rounded px-2 ${
                activeVertical === v.slug
                  ? "font-bold text-primary bg-primary/5"
                  : "hover:bg-card"
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3">Sort</h3>
        <select
          value={activeSort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        >
          <option value="score">Featured First</option>
          <option value="name">A — Z</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {(activeCategories.length > 0 || activeVertical) && (
        <button
          onClick={() =>
            updateParams({ category: null, vertical: null, sort: null, q: null })
          }
          className="text-sm text-primary hover:underline"
        >
          Clear all filters
        </button>
      )}
    </aside>
  )
}
