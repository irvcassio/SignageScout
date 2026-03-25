import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSessionAccount } from "@/lib/auth"
import LoginForm from "@/components/LoginForm"

export const metadata: Metadata = {
  title: "Vendor Sign In",
  description: "Sign in to manage your vendor listing on SignageScout.",
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const account = await getSessionAccount()
  const params = await searchParams
  if (account) {
    redirect(params.next || "/vendor/dashboard")
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-2">Vendor Sign In</h1>
      <p className="text-muted text-center text-sm mb-8">
        Sign in to manage your listing on SignageScout.
      </p>
      <LoginForm redirectTo={params.next} />
    </div>
  )
}
