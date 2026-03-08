"use client"

import { useActionState } from "react"
import { submitClaim } from "@/app/(directory)/vendors/claim/actions"

const initialState = { error: "", success: false }

export default function ClaimForm({ accountEmail }: { accountEmail: string }) {
  const [state, formAction, pending] = useActionState(submitClaim, initialState)

  if (state.success) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center dark:bg-green-900/30 dark:border-green-800">
        <h2 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">
          Claim Submitted
        </h2>
        <p className="text-green-700 dark:text-green-300">
          We&apos;ll review your submission and get back to you at{" "}
          <strong>{accountEmail}</strong>.
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="companyName" className="block text-sm font-medium mb-1">
          Company Name
        </label>
        <input
          id="companyName"
          name="companyName"
          type="text"
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="Acme Digital Signage"
        />
      </div>

      <div>
        <label htmlFor="websiteUrl" className="block text-sm font-medium mb-1">
          Company Website
        </label>
        <input
          id="websiteUrl"
          name="websiteUrl"
          type="url"
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label
          htmlFor="contactEmail"
          className="block text-sm font-medium mb-1"
        >
          Contact Email
        </label>
        <input
          id="contactEmail"
          name="contactEmail"
          type="email"
          required
          defaultValue={accountEmail}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      <div>
        <label
          htmlFor="existingSlug"
          className="block text-sm font-medium mb-1"
        >
          Existing Listing URL{" "}
          <span className="text-muted font-normal">(optional)</span>
        </label>
        <input
          id="existingSlug"
          name="existingSlug"
          type="text"
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="your-company-slug"
        />
        <p className="text-xs text-muted mt-1">
          If your company is already listed, enter its slug from the URL
          (e.g., &quot;acme-signage&quot; from /vendors/acme-signage).
        </p>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          Additional Information{" "}
          <span className="text-muted font-normal">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
          placeholder="Tell us about your company and your role there..."
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary px-6 py-3 text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {pending ? "Submitting..." : "Submit Claim"}
      </button>
    </form>
  )
}
