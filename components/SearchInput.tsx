"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useCallback, useRef, useTransition } from "react"

export default function SearchInput() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  const currentQuery = searchParams.get("q") ?? ""

  const handleChange = useCallback(
    (value: string) => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete("page")
        if (value.trim()) {
          params.set("q", value.trim())
        } else {
          params.delete("q")
        }
        startTransition(() => {
          router.push(`${pathname}?${params.toString()}`, { scroll: false })
        })
      }, 300)
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="relative">
      <input
        type="search"
        defaultValue={currentQuery}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Search vendors..."
        className={`w-full rounded-lg border border-border px-4 py-2.5 text-sm placeholder:text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${isPending ? "opacity-60" : ""}`}
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  )
}
