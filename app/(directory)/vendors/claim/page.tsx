import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getSessionAccount } from "@/lib/auth"
import ClaimForm from "@/components/ClaimForm"

export const metadata: Metadata = {
  title: "Claim Your Listing",
  description:
    "Claim or create your vendor listing in the SignageScout digital signage directory.",
}

export default async function ClaimPage() {
  const account = await getSessionAccount()

  if (!account) {
    redirect("/auth/register?next=/vendors/claim")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Claim Your Listing</h1>
      <p className="text-muted mb-8">
        Submit your company details below. We&apos;ll review your claim and link
        it to an existing listing or create a new one.
      </p>
      <ClaimForm accountEmail={account.email} />
    </div>
  )
}
