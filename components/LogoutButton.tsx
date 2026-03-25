"use client"

import { logout } from "@/app/vendor/dashboard/actions"

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="text-muted hover:text-foreground transition-colors"
      >
        Sign out
      </button>
    </form>
  )
}
