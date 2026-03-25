"use server"

import { redirect } from "next/navigation"
import { dbConnect } from "@/lib/db"
import { getSessionAccount, destroySession } from "@/lib/auth"
import Vendor from "@/models/Vendor"

interface ProfileState {
  error: string
  success: boolean
}

export async function logout(): Promise<void> {
  await destroySession()
  redirect("/")
}

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const account = await getSessionAccount()
  if (!account || !account.vendorSlug) {
    return { error: "No linked vendor listing found.", success: false }
  }

  const tagline = (formData.get("tagline") as string)?.trim() || ""
  const shortDescription =
    (formData.get("shortDescription") as string)?.trim() || ""
  const longDescription =
    (formData.get("longDescription") as string)?.trim() || ""
  const websiteUrl = (formData.get("websiteUrl") as string)?.trim() || ""

  if (tagline.length > 160) {
    return { error: "Tagline must be 160 characters or fewer.", success: false }
  }
  if (shortDescription.length > 320) {
    return {
      error: "Short description must be 320 characters or fewer.",
      success: false,
    }
  }

  await dbConnect()

  await Vendor.updateOne(
    { slug: account.vendorSlug },
    {
      $set: {
        tagline,
        shortDescription,
        longDescription,
        websiteUrl,
      },
    }
  )

  return { error: "", success: true }
}
