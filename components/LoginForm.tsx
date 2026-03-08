"use client"

import Link from "next/link"
import { useActionState } from "react"
import { login } from "@/app/auth/login/actions"

const initialState = { error: "" }

export default function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, pending] = useActionState(login, initialState)

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
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary px-6 py-3 text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link
          href={`/auth/register${redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ""}`}
          className="text-primary hover:underline"
        >
          Create one
        </Link>
      </p>
    </form>
  )
}
