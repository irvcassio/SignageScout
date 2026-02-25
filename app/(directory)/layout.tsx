import Link from "next/link"

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            SignageHub
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/vendors"
              className="text-muted hover:text-foreground transition-colors"
            >
              Directory
            </Link>
            <Link
              href="/category/software"
              className="text-muted hover:text-foreground transition-colors"
            >
              Software
            </Link>
            <Link
              href="/category/hardware"
              className="text-muted hover:text-foreground transition-colors"
            >
              Hardware
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8">{children}</div>
    </div>
  )
}
