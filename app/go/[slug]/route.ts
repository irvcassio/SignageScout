import { NextRequest, NextResponse } from "next/server"
import { getVendorBySlug } from "@/lib/vendors"
import { logClick } from "@/lib/clicks"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const referer = request.headers.get("referer") ?? "/"
  const userAgent = request.headers.get("user-agent") ?? ""

  try {
    const vendor = await getVendorBySlug(slug)

    if (!vendor) {
      return NextResponse.redirect(new URL("/vendors", request.url))
    }

    const destinationUrl = vendor.affiliateUrl || vendor.websiteUrl
    if (!destinationUrl) {
      return NextResponse.redirect(new URL(`/vendors/${slug}`, request.url))
    }

    // Log click asynchronously — don't block the redirect
    logClick({
      vendorSlug: slug,
      sourcePath: referer,
      destinationUrl,
      isAffiliate: !!vendor.affiliateUrl,
      userAgent,
    }).catch(() => {
      // Silently fail — click tracking should never break user flow
    })

    return NextResponse.redirect(destinationUrl, { status: 302 })
  } catch {
    return NextResponse.redirect(new URL("/vendors", request.url))
  }
}
