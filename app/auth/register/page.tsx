import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSessionAccount } from "@/lib/auth"
import RegisterForm from "@/components/RegisterForm"

export const metadata: Metadata = {
  title: "Create Vendor Account",
  description: "Create your vendor account on SignageScout.",
}

export default async function RegisterPage({
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
      <h1 className="text-2xl font-bold text-center mb-2">
        Create Vendor Account
      </h1>
      <p className="text-muted text-center text-sm mb-8">
        Sign up to claim and manage your listing on SignageScout.
      </p>
      <RegisterForm redirectTo={params.next} />
    </div>
  )
}
