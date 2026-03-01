import Link from "next/link"

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
      <div className="mx-auto max-w-3xl px-4 py-12 prose prose-slate max-w-none [&>*]:max-w-3xl [&>*]:mx-auto">
        {children}
      </div>
    </div>
  )
}
