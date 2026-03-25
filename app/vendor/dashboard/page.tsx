import type { Metadata } from "next"
import Link from "next/link"
import { getSessionAccount } from "@/lib/auth"
import { getVendorBySlug } from "@/lib/vendors"
import { dbConnect } from "@/lib/db"
import VendorClaim from "@/models/VendorClaim"
import ProfileEditor from "@/components/ProfileEditor"

export const metadata: Metadata = {
  title: "Vendor Dashboard",
}

export default async function DashboardPage() {
  const account = await getSessionAccount()
  if (!account) return null // layout handles redirect

  await dbConnect()

  // Check for pending claims
  const pendingClaim = await VendorClaim.findOne({
    accountId: account._id.toString(),
    status: "pending",
  }).lean()

  // Load linked vendor if any
  const vendor = account.vendorSlug
    ? await getVendorBySlug(account.vendorSlug)
    : null

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Vendor Dashboard</h1>

      {/* No linked vendor yet */}
      {!vendor && (
        <div className="rounded-xl border border-border bg-card p-6 mb-8">
          <h2 className="font-semibold mb-2">Listing Status</h2>
          {pendingClaim ? (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
              Your claim for <strong>{pendingClaim.companyName}</strong> is under
              review. We&apos;ll notify you at <strong>{account.email}</strong>{" "}
              once it&apos;s approved.
            </div>
          ) : (
            <div>
              <p className="text-muted text-sm mb-4">
                Your account isn&apos;t linked to a vendor listing yet.
              </p>
              <Link
                href="/vendors/claim"
                className="inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm text-white font-medium hover:bg-primary-dark transition-colors"
              >
                Claim Your Listing
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Linked vendor — profile editor */}
      {vendor && <ProfileEditor vendor={vendor} />}

      {/* Account info */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold mb-4">Account</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted">Email</dt>
            <dd>{account.email}</dd>
          </div>
          <div>
            <dt className="text-muted">Company</dt>
            <dd>{account.companyName}</dd>
          </div>
          <div>
            <dt className="text-muted">Linked Listing</dt>
            <dd>
              {vendor ? (
                <Link
                  href={`/vendors/${vendor.slug}`}
                  className="text-primary hover:underline"
                >
                  {vendor.name}
                </Link>
              ) : (
                <span className="text-muted">None</span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
