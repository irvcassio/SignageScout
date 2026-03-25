import { NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/db"
import Click from "@/models/Click"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret")
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const days = Math.min(Number(searchParams.get("days") || "30"), 90)
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  await dbConnect()

  const [summary, topVendors, dailyClicks, topSources] = await Promise.all([
    // Overall summary
    Click.aggregate([
      { $match: { timestamp: { $gte: since } } },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: 1 },
          affiliateClicks: {
            $sum: { $cond: ["$isAffiliate", 1, 0] },
          },
          uniqueVendors: { $addToSet: "$vendorSlug" },
        },
      },
      {
        $project: {
          _id: 0,
          totalClicks: 1,
          affiliateClicks: 1,
          regularClicks: {
            $subtract: ["$totalClicks", "$affiliateClicks"],
          },
          uniqueVendors: { $size: "$uniqueVendors" },
        },
      },
    ]),

    // Top vendors by clicks
    Click.aggregate([
      { $match: { timestamp: { $gte: since } } },
      {
        $group: {
          _id: "$vendorSlug",
          total: { $sum: 1 },
          affiliate: { $sum: { $cond: ["$isAffiliate", 1, 0] } },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 20 },
      {
        $project: {
          _id: 0,
          vendor: "$_id",
          total: 1,
          affiliate: 1,
          regular: { $subtract: ["$total", "$affiliate"] },
        },
      },
    ]),

    // Clicks per day
    Click.aggregate([
      { $match: { timestamp: { $gte: since } } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          total: { $sum: 1 },
          affiliate: { $sum: { $cond: ["$isAffiliate", 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          date: "$_id",
          total: 1,
          affiliate: 1,
          regular: { $subtract: ["$total", "$affiliate"] },
        },
      },
    ]),

    // Top source paths
    Click.aggregate([
      { $match: { timestamp: { $gte: since } } },
      {
        $group: {
          _id: "$sourcePath",
          total: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, path: "$_id", total: 1 } },
    ]),
  ])

  return NextResponse.json({
    period: { days, since: since.toISOString() },
    summary: summary[0] ?? {
      totalClicks: 0,
      affiliateClicks: 0,
      regularClicks: 0,
      uniqueVendors: 0,
    },
    topVendors,
    dailyClicks,
    topSources,
  })
}
