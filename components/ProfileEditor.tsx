"use client"

import { useActionState } from "react"
import type { IVendor } from "@/types/vendor"
import { updateProfile } from "@/app/vendor/dashboard/actions"

const initialState = { error: "", success: false }

export default function ProfileEditor({ vendor }: { vendor: IVendor }) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState
  )

  return (
    <div className="rounded-xl border border-border bg-card p-6 mb-8">
      <h2 className="font-semibold mb-4">Edit Listing</h2>

      {state.success && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300 mb-4">
          Profile updated successfully.
        </div>
      )}
      {state.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300 mb-4">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-5">
        <div>
          <label htmlFor="tagline" className="block text-sm font-medium mb-1">
            Tagline <span className="text-muted font-normal">(max 160)</span>
          </label>
          <input
            id="tagline"
            name="tagline"
            type="text"
            maxLength={160}
            defaultValue={vendor.tagline}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label
            htmlFor="shortDescription"
            className="block text-sm font-medium mb-1"
          >
            Short Description{" "}
            <span className="text-muted font-normal">(max 320)</span>
          </label>
          <textarea
            id="shortDescription"
            name="shortDescription"
            rows={2}
            maxLength={320}
            defaultValue={vendor.shortDescription}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
          />
        </div>

        <div>
          <label
            htmlFor="longDescription"
            className="block text-sm font-medium mb-1"
          >
            Full Description
          </label>
          <textarea
            id="longDescription"
            name="longDescription"
            rows={6}
            defaultValue={vendor.longDescription}
            className="w-full rounded-lg border border-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
          />
        </div>

        <div>
          <label
            htmlFor="websiteUrl"
            className="block text-sm font-medium mb-1"
          >
            Website URL
          </label>
          <input
            id="websiteUrl"
            name="websiteUrl"
            type="url"
            defaultValue={vendor.websiteUrl}
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-6 py-2.5 text-white font-medium text-sm hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {pending ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  )
}
