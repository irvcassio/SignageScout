"use client"

import Link from "next/link"
import { useActionState } from "react"
import { register } from "@/app/auth/register/actions"

const initialState = { error: "" }

export default function RegisterForm({
  redirectTo,
}: {
  redirectTo?: string
}) {
  const [state, formAction, pending] = useActionState(register, initialState)

  return (
    <form action={formAction} className="space-y-5">
      {redirectTo && (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      )}

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
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        <p className="text-xs text-muted mt-1">Minimum 8 characters</p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary px-6 py-3 text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {pending ? "Creating account..." : "Create Account"}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href={`/auth/login${redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ""}`}
          className="text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
