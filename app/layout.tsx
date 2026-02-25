import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://signagehub.com"
  ),
  title: {
    default: "SignageHub | Digital Signage Directory",
    template: "%s | SignageHub",
  },
  description:
    "Find and compare the best digital signage software, hardware, and service providers. The curated directory for the digital signage industry.",
  openGraph: {
    siteName: "SignageHub",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  )
}
