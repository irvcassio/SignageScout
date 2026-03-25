import Link from "next/link"
import { redirect } from "next/navigation"
import { getSessionAccount } from "@/lib/auth"
import LogoutButton from "@/components/LogoutButton"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const account = await getSessionAccount()
  if (!account) {
    redirect("/auth/login?next=/vendor/dashboard")
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            SignageScout
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted">{account.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
    </div>
  )
}
