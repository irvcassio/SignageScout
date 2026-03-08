"use client"

import { useState, useEffect, useCallback } from "react"

interface Summary {
  totalClicks: number
  affiliateClicks: number
  regularClicks: number
  uniqueVendors: number
}

interface VendorRow {
  vendor: string
  total: number
  affiliate: number
  regular: number
}

interface DailyRow {
  date: string
  total: number
  affiliate: number
  regular: number
}

interface SourceRow {
  path: string
  total: number
}

interface DashboardData {
  period: { days: number; since: string }
  summary: Summary
  topVendors: VendorRow[]
  dailyClicks: DailyRow[]
  topSources: SourceRow[]
}

export default function AdminDashboard() {
  const [secret, setSecret] = useState("")
  const [authed, setAuthed] = useState(false)
  const [days, setDays] = useState(30)
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchData = useCallback(
    async (s: string, d: number) => {
      setLoading(true)
      setError("")
      try {
        const res = await fetch(`/admin/api/clicks?days=${d}`, {
          headers: { "x-admin-secret": s },
        })
        if (!res.ok) {
          setError(res.status === 401 ? "Invalid secret" : "Failed to load")
          setAuthed(false)
          return
        }
        const json = await res.json()
        setData(json)
        setAuthed(true)
      } catch {
        setError("Network error")
      } finally {
        setLoading(false)
      }
    },
    []
  )

  useEffect(() => {
    if (authed) fetchData(secret, days)
  }, [days]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    fetchData(secret, days)
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-card)]">
        <form
          onSubmit={handleLogin}
          className="bg-surface rounded-xl shadow-lg p-8 w-full max-w-sm space-y-4"
        >
          <h1 className="text-xl font-bold text-[var(--color-foreground)]">
            Admin Dashboard
          </h1>
          <p className="text-sm text-[var(--color-muted)]">
            Enter your admin secret to continue.
          </p>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2 dark:bg-red-900/30 dark:text-red-300">
              {error}
            </p>
          )}
          <input
            type="password"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Admin secret"
            className="w-full border border-[var(--color-border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || !secret}
            className="w-full bg-[var(--color-primary)] text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-[var(--color-primary-dark)] disabled:opacity-50 transition-colors"
          >
            {loading ? "Loading..." : "Sign In"}
          </button>
        </form>
      </div>
    )
  }

  const maxDaily = Math.max(...(data?.dailyClicks.map((d) => d.total) ?? [1]))

  return (
    <div className="min-h-screen bg-[var(--color-card)]">
      {/* Header */}
      <header className="bg-surface border-b border-[var(--color-border)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-[var(--color-foreground)]">
            SignageScout Admin
          </h1>
          <div className="flex items-center gap-3">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm bg-background"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
              <option value={60}>Last 60 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button
              onClick={() => fetchData(secret, days)}
              disabled={loading}
              className="text-sm text-[var(--color-primary)] hover:underline disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Summary Cards */}
        {data && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Clicks"
              value={data.summary.totalClicks}
              color="var(--color-foreground)"
            />
            <StatCard
              label="Affiliate Clicks"
              value={data.summary.affiliateClicks}
              color="var(--color-primary)"
            />
            <StatCard
              label="Regular Clicks"
              value={data.summary.regularClicks}
              color="var(--color-accent)"
            />
            <StatCard
              label="Unique Vendors"
              value={data.summary.uniqueVendors}
              color="var(--color-muted)"
            />
          </div>
        )}

        {/* Daily Clicks Chart */}
        {data && data.dailyClicks.length > 0 && (
          <section className="bg-surface rounded-xl border border-[var(--color-border)] p-6">
            <h2 className="text-sm font-semibold text-[var(--color-foreground)] mb-4">
              Daily Clicks
            </h2>
            <div className="flex items-end gap-[2px] h-40">
              {data.dailyClicks.map((d) => {
                const affPct = d.total > 0 ? (d.affiliate / d.total) * 100 : 0
                const height = (d.total / maxDaily) * 100
                return (
                  <div
                    key={d.date}
                    className="flex-1 flex flex-col justify-end group relative"
                    style={{ height: "100%" }}
                  >
                    <div
                      className="w-full rounded-t transition-all"
                      style={{
                        height: `${height}%`,
                        background: `linear-gradient(to top, var(--color-accent) ${affPct}%, var(--color-primary) ${affPct}%)`,
                        minHeight: d.total > 0 ? "2px" : 0,
                      }}
                    />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-[var(--color-foreground)] text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                      {d.date}: {d.total} ({d.affiliate} aff)
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-[var(--color-muted)]">
              <span>{data.dailyClicks[0]?.date}</span>
              <span>{data.dailyClicks[data.dailyClicks.length - 1]?.date}</span>
            </div>
            <div className="flex gap-4 mt-3 text-xs text-[var(--color-muted)]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[var(--color-primary)]" />
                Regular
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-[var(--color-accent)]" />
                Affiliate
              </span>
            </div>
          </section>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Top Vendors */}
          {data && data.topVendors.length > 0 && (
            <section className="bg-surface rounded-xl border border-[var(--color-border)] p-6">
              <h2 className="text-sm font-semibold text-[var(--color-foreground)] mb-4">
                Top Vendors
              </h2>
              <div className="space-y-2">
                {data.topVendors.map((v, i) => {
                  const pct =
                    (v.total / data.topVendors[0].total) * 100
                  return (
                    <div key={v.vendor} className="relative">
                      <div
                        className="absolute inset-y-0 left-0 bg-[var(--color-primary)]/8 rounded"
                        style={{ width: `${pct}%` }}
                      />
                      <div className="relative flex items-center justify-between px-3 py-2 text-sm">
                        <span className="flex items-center gap-2">
                          <span className="text-[var(--color-muted)] text-xs w-5 text-right">
                            {i + 1}
                          </span>
                          <span className="font-medium text-[var(--color-foreground)]">
                            {v.vendor}
                          </span>
                        </span>
                        <span className="flex items-center gap-3 text-xs">
                          <span className="text-[var(--color-primary)]">
                            {v.affiliate} aff
                          </span>
                          <span className="font-semibold text-[var(--color-foreground)]">
                            {v.total}
                          </span>
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Top Sources */}
          {data && data.topSources.length > 0 && (
            <section className="bg-surface rounded-xl border border-[var(--color-border)] p-6">
              <h2 className="text-sm font-semibold text-[var(--color-foreground)] mb-4">
                Top Source Pages
              </h2>
              <div className="space-y-2">
                {data.topSources.map((s, i) => {
                  const pct =
                    (s.total / data.topSources[0].total) * 100
                  return (
                    <div key={s.path} className="relative">
                      <div
                        className="absolute inset-y-0 left-0 bg-[var(--color-accent)]/8 rounded"
                        style={{ width: `${pct}%` }}
                      />
                      <div className="relative flex items-center justify-between px-3 py-2 text-sm">
                        <span className="flex items-center gap-2">
                          <span className="text-[var(--color-muted)] text-xs w-5 text-right">
                            {i + 1}
                          </span>
                          <span className="font-mono text-xs text-[var(--color-foreground)]">
                            {s.path}
                          </span>
                        </span>
                        <span className="font-semibold text-[var(--color-foreground)] text-sm">
                          {s.total}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>

        {/* Empty State */}
        {data &&
          data.summary.totalClicks === 0 && (
            <div className="text-center py-16 text-[var(--color-muted)]">
              <p className="text-lg font-medium">No click data yet</p>
              <p className="text-sm mt-1">
                Clicks will appear here once visitors start using vendor links.
              </p>
            </div>
          )}
      </main>
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className="bg-surface rounded-xl border border-[var(--color-border)] p-5">
      <p className="text-xs text-[var(--color-muted)] mb-1">{label}</p>
      <p className="text-2xl font-bold" style={{ color }}>
        {value.toLocaleString()}
      </p>
    </div>
  )
}
