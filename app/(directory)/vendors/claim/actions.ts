"use server"

import { dbConnect } from "@/lib/db"
import { getSessionAccount } from "@/lib/auth"
import VendorClaim from "@/models/VendorClaim"

interface ClaimState {
  error: string
  success: boolean
}

export async function submitClaim(
  _prev: ClaimState,
  formData: FormData
): Promise<ClaimState> {
  const account = await getSessionAccount()
  if (!account) {
    return { error: "You must be logged in to submit a claim.", success: false }
  }

  const companyName = (formData.get("companyName") as string)?.trim()
  const websiteUrl = (formData.get("websiteUrl") as string)?.trim()
  const contactEmail = (formData.get("contactEmail") as string)?.trim()
  const existingSlug = (formData.get("existingSlug") as string)?.trim() || null
  const message = (formData.get("message") as string)?.trim() || ""

  if (!companyName || !websiteUrl || !contactEmail) {
    return { error: "Please fill in all required fields.", success: false }
  }

  try {
    new URL(websiteUrl)
  } catch {
    return { error: "Please enter a valid website URL.", success: false }
  }

  await dbConnect()

  const existing = await VendorClaim.findOne({
    accountId: account._id.toString(),
    status: "pending",
  })
  if (existing) {
    return {
      error: "You already have a pending claim. We'll get back to you soon.",
      success: false,
    }
  }

  await VendorClaim.create({
    accountId: account._id.toString(),
    vendorSlug: existingSlug,
    companyName,
    websiteUrl,
    contactEmail,
    message,
  })

  return { error: "", success: true }
}
