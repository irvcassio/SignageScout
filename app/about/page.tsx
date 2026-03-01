import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About SignageScout",
  description:
    "SignageScout is a curated directory of digital signage vendors, helping buyers find the right software, hardware, and services for their deployment.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-primary">
            SignageScout
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link
              href="/vendors"
              className="text-muted hover:text-foreground transition-colors"
            >
              Directory
            </Link>
            <Link
              href="/guides"
              className="text-muted hover:text-foreground transition-colors"
            >
              Guides
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">About SignageScout</h1>

        <div className="space-y-6 text-foreground leading-relaxed">
          <p>
            SignageScout is a curated directory of digital signage vendors — software
            platforms, hardware manufacturers, media players, content creators,
            system integrators, and consultants. We help buyers find the right
            solution for their deployment.
          </p>

          <h2 className="text-xl font-semibold mt-8">Why We Built This</h2>
          <p>
            The digital signage industry is a $13 billion market with hundreds of
            vendors across multiple segments. Buyers evaluating solutions — IT
            managers, retail operations teams, facilities directors — have no
            specialized resource. General review sites like G2 and Capterra cover
            digital signage but lack industry depth. We built SignageScout to fill
            that gap.
          </p>

          <h2 className="text-xl font-semibold mt-8">Editorial Policy</h2>
          <p>
            Every vendor profile in our directory is researched and curated by our
            team. We do not accept payment for inclusion in the directory. Vendor
            profiles are based on publicly available information, official product
            documentation, and verified user feedback.
          </p>
          <p>
            &ldquo;Featured&rdquo; badges indicate vendors who have claimed their
            profile and verified their information. Featured placement does not
            influence our editorial content or guide recommendations.
          </p>

          <h2 className="text-xl font-semibold mt-8">How We Make Money</h2>
          <p>
            SignageScout earns revenue through affiliate commissions when visitors
            click through to vendor websites and sign up for services. Some vendor
            listings include sponsored placements. Affiliate relationships never
            influence our editorial recommendations or guide content — we recommend
            what we believe is best for the buyer.
          </p>

          <h2 className="text-xl font-semibold mt-8">Contact</h2>
          <p>
            Have a question, correction, or want to claim your vendor profile?
            Email us at{" "}
            <a
              href="mailto:hello@signagescout.com"
              className="text-primary hover:underline"
            >
              hello@signagescout.com
            </a>
            .
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href="/vendors"
            className="text-primary hover:underline text-sm"
          >
            Browse the Directory
          </Link>
        </div>
      </main>
    </div>
  )
}
