"use server"

import { redirect } from "next/navigation"
import { dbConnect } from "@/lib/db"
import { hashPassword, createSession } from "@/lib/auth"
import VendorAccount from "@/models/VendorAccount"

interface RegisterState {
  error: string
}

export async function register(
  _prev: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const companyName = (formData.get("companyName") as string)?.trim()
  const email = (formData.get("email") as string)?.trim().toLowerCase()
  const password = formData.get("password") as string
  const redirectTo = (formData.get("redirectTo") as string) || "/vendor/dashboard"

  if (!companyName || !email || !password) {
    return { error: "All fields are required." }
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." }
  }

  await dbConnect()

  const existing = await VendorAccount.findOne({ email })
  if (existing) {
    return { error: "An account with this email already exists." }
  }

  const passwordHash = await hashPassword(password)
  const account = await VendorAccount.create({
    email,
    companyName,
    passwordHash,
  })

  await createSession(account._id.toString())
  redirect(redirectTo)
}
