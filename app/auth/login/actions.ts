"use server"

import { redirect } from "next/navigation"
import { dbConnect } from "@/lib/db"
import { verifyPassword, createSession } from "@/lib/auth"
import VendorAccount from "@/models/VendorAccount"

interface LoginState {
  error: string
}

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = (formData.get("email") as string)?.trim().toLowerCase()
  const password = formData.get("password") as string
  const redirectTo = (formData.get("redirectTo") as string) || "/vendor/dashboard"

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  await dbConnect()

  const account = await VendorAccount.findOne({ email })
  if (!account) {
    return { error: "Invalid email or password." }
  }

  const valid = await verifyPassword(password, account.passwordHash)
  if (!valid) {
    return { error: "Invalid email or password." }
  }

  await createSession(account._id.toString())
  redirect(redirectTo)
}
