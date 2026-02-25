import { dbConnect } from "./db"
import Click from "@/models/Click"

export async function logClick({
  vendorSlug,
  sourcePath,
  destinationUrl,
  isAffiliate,
  userAgent,
}: {
  vendorSlug: string
  sourcePath: string
  destinationUrl: string
  isAffiliate: boolean
  userAgent: string
}) {
  await dbConnect()
  await Click.create({
    vendorSlug,
    sourcePath,
    destinationUrl,
    isAffiliate,
    userAgent,
    timestamp: new Date(),
  })
}
