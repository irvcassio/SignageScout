---
title: "feat: SignageHub Directory MVP"
type: feat
date: 2026-02-24
---

# SignageHub Directory MVP

## Overview

Build SignageHub — a curated directory listing website for the $13.2B digital signage industry. Directory-first with SEO content driving organic traffic. Next.js 16 App Router + MongoDB + Tailwind v4 on Vercel. Target: 200-300 vendor profiles + 20-30 SEO articles at launch, $500-2K/mo revenue within 6-12 months.

## Problem Statement

Buyers evaluating digital signage solutions (IT managers, retail ops, facilities teams) have no specialized, curated resource. G2/Capterra cover the space generically. Digital Signage Today is news-first. digitalsignagedirectory.com is outdated. The fragmented vendor landscape (software, hardware, media players, integrators, content agencies, consultants) across multiple verticals (retail, healthcare, education, corporate, hospitality) needs a purpose-built directory with comparison tools and buyer guides.

## Technical Approach

### Architecture

```
Next.js 16 App Router (SSG/ISR for SEO)
  |
  +-- MongoDB Atlas (vendor data, click tracking)
  |
  +-- MDX files (20-30 editorial articles in /content)
  |
  +-- Tailwind v4 (CSS-first config, @theme)
  |
  +-- Vercel (hosting, ISR, image optimization, analytics)
```

**Key architectural decisions from research:**

1. **Rendering strategy**: Vendor profiles use ISR (`revalidate = 3600`) + `generateStaticParams` for all 200-300 slugs. Category/vertical pages use ISR (`revalidate = 1800`). Search/filter listing page uses SSR (dynamic, reads `searchParams`).

2. **Filter state lives in URL**: All filter/sort/page state serialized as query parameters. FilterBar is the only Client Component. Server reads `searchParams` — pages remain server-rendered and crawlable.

3. **MongoDB text indexes for MVP**: Use built-in `$text` search with weighted fields (name: 10, tagline: 5, tags: 3, description: 1). Upgrade to Atlas Search only when fuzzy/autocomplete is needed.

4. **Affiliate click tracking from day one**: `/go/[slug]` redirect route logs every outbound click (timestamp, source page, vendor slug) before redirecting.

5. **MDX for editorial content**: Use `@next/mdx` with JS-export metadata for 20-30 articles. Vendor references in articles link to profile pages.

6. **No auth at launch**: Public read-only directory. Architecture forward-compatible with auth (vendor claims, dashboards) in later phases.

### Critical Decisions (Addressing Spec Gaps)

| Question | Decision | Rationale |
|----------|----------|-----------|
| Combined filter URL strategy | Query params on `/vendors?category=software&vertical=retail`. Pre-generate static pages for top 10-15 segment+vertical combos as dedicated landing pages. | Query params for flexibility, dedicated pages for top SEO targets |
| Affiliate vs website link | `/go/[slug]` redirect for ALL outbound clicks. Falls back to plain URL if no affiliate link set. | Track from day one, retrofitting loses historical data |
| Multi-segment vendors | `categories` is an array field. Filters operate as OR (vendor appears if it matches ANY selected segment). | Realistic — many vendors span categories |
| Pricing tier field | Describes the vendor's product pricing model: Free / Freemium / Paid / Enterprise / Contact. Optional, applies mainly to software. | Buyer-facing signal, not directory listing tier |
| Related vendors algorithm | Same primary category, highest overlap in verticals and tags, max 4, sponsored first. | Simple, effective, monetizable |
| Zero results state | "No exact matches" + suggested categories + "Suggest a vendor" link. | Prevents dead ends |
| Homepage primary action | Hero search bar + segment category grid + 6 featured vendors + 3 recent articles. | Search-first matches buyer intent |
| Sort order | Featured/sponsored vendors first (visually distinct), then alphabetical. Toggle for "A-Z" or "Newest". | Core monetization hook |
| Mobile filter UX | Bottom sheet with segment/vertical pills. Collapsible accordion sections. | Standard mobile directory pattern |

### Project File Structure

```
SignageHub/
  app/
    layout.tsx                    # Root layout, fonts, metadataBase, analytics
    page.tsx                      # Homepage (hero search, category grid, featured)
    sitemap.ts                    # Dynamic sitemap from MongoDB
    robots.ts                     # robots.txt

    (directory)/                  # Route group — shared directory layout
      layout.tsx                  # Search bar + nav shell
      vendors/
        page.tsx                  # /vendors — SSR listing with filters
        [slug]/
          page.tsx                # /vendors/[slug] — ISR vendor profile
          opengraph-image.tsx     # Dynamic OG image per vendor
      category/
        [slug]/
          page.tsx                # /category/[slug] — ISR category listing
      vertical/
        [slug]/
          page.tsx                # /vertical/[slug] — ISR vertical listing

    (content)/                    # Route group — editorial layout
      layout.tsx                  # Prose container
      guides/
        [slug]/
          page.tsx                # /guides/[slug] — ISR MDX article

    go/
      [slug]/
        route.ts                  # /go/[slug] — affiliate redirect + click logging

    api/
      revalidate/
        route.ts                  # Webhook for on-demand ISR revalidation

  components/
    VendorCard.tsx                # Server component — vendor list card
    VendorProfile.tsx             # Server component — full profile view
    FilterBar.tsx                 # Client component — URL param manipulation
    SearchInput.tsx               # Client component — debounced search
    Pagination.tsx                # Server component — link-based pagination
    CategoryGrid.tsx              # Server component — homepage category cards
    FeaturedVendors.tsx           # Server component — homepage featured section
    JsonLd.tsx                    # Server component — structured data injection

  content/
    guides/                       # MDX editorial articles
      best-digital-signage-software-2026.mdx
      digital-signage-for-retail.mdx
      ...

  lib/
    db.ts                         # MongoDB singleton connection (serverless-safe)
    vendors.ts                    # All vendor query functions
    clicks.ts                     # Click tracking functions
    taxonomy.ts                   # Category/vertical helpers
    seo.ts                        # JSON-LD generators, meta helpers

  models/
    Vendor.ts                     # Mongoose schema + indexes
    Click.ts                      # Mongoose schema for click tracking

  scripts/
    seed-vendors.ts               # Import vendors from CSV/JSON
    generate-slugs.ts             # Generate URL slugs from vendor names

  types/
    vendor.ts                     # TypeScript interfaces
    taxonomy.ts                   # Category/vertical type definitions

  public/
    logos/                        # Vendor logo images (fallback/local)

  docs/
    brainstorms/
    plans/
```

### Data Model

#### Vendor Document (MongoDB)

```typescript
// models/Vendor.ts
interface IVendor {
  // Identity
  name: string                    // indexed, text search weight 10
  slug: string                    // unique index, URL-safe
  tagline: string                 // max 160 chars, meta description fallback
  shortDescription: string        // max 320 chars, shown on cards
  longDescription: string         // full markdown, shown on profile
  logoUrl: string                 // URL or /logos/[slug].png
  websiteUrl: string              // canonical vendor website
  affiliateUrl: string | null     // affiliate link, nullable

  // Taxonomy (dual-axis)
  categories: string[]            // ["software", "integration"] — indexed
  verticals: string[]             // ["retail", "healthcare"] — indexed
  tags: string[]                  // freeform, indexed for search
  pricingModel: 'free' | 'freemium' | 'paid' | 'enterprise' | 'contact' | null

  // Directory metadata
  featured: boolean               // indexed — appears in featured section
  verified: boolean               // editorial verification badge
  listingScore: number            // computed sort weight

  // Timestamps
  createdAt: Date
  updatedAt: Date
}
```

**Indexes:**
```
{ slug: 1 }                              unique
{ categories: 1, listingScore: -1 }      category listing sort
{ verticals: 1, listingScore: -1 }       vertical listing sort
{ featured: 1, listingScore: -1 }        featured vendors query
{ name: 'text', tagline: 'text', tags: 'text', shortDescription: 'text' }
                                          weighted text search
```

#### Click Document (MongoDB)

```typescript
// models/Click.ts
interface IClick {
  vendorSlug: string              // indexed
  sourcePath: string              // page the click originated from
  destinationUrl: string          // where user was sent
  isAffiliate: boolean            // true if affiliateUrl was used
  timestamp: Date                 // indexed, TTL for cleanup
  userAgent: string
}
```

**Indexes:**
```
{ vendorSlug: 1, timestamp: -1 }  click analytics queries
{ timestamp: 1 }                   TTL index (expire after 90 days)
```

### Taxonomy Definition

**Segments (categories):**
| Slug | Display Name |
|------|-------------|
| software | Software & CMS |
| hardware | Hardware & Displays |
| media-players | Media Players |
| content-creation | Content Creation |
| integration | System Integration |
| consulting | Consulting & Strategy |

**Verticals:**
| Slug | Display Name |
|------|-------------|
| retail | Retail & Stores |
| healthcare | Healthcare |
| education | Education |
| corporate | Corporate & Office |
| hospitality | Hospitality & Hotels |
| transportation | Transportation |
| qsr | QSR & Restaurants |

### SEO Architecture

**URL structure:**
```
/                                   Homepage
/vendors                            Full directory with search/filters
/vendors/[slug]                     Vendor profile (ISR, JSON-LD LocalBusiness)
/category/[slug]                    Category listing (ISR, dedicated H1/meta)
/vertical/[slug]                    Vertical listing (ISR, dedicated H1/meta)
/guides/[slug]                      Editorial article (ISR, JSON-LD Article)
/go/[slug]                          Affiliate redirect (no-index, no-follow)
/sitemap.xml                        Dynamic sitemap
/robots.txt                         Generated robots.txt
```

**Canonical strategy:**
- `/vendors?category=software` canonical → `/vendors` (filtered state not indexable)
- `/category/software` canonical → itself (dedicated indexable page)
- `/vertical/retail` canonical → itself (dedicated indexable page)

**Structured data:**
- Vendor profiles: `@type: LocalBusiness` JSON-LD
- Editorial articles: `@type: Article` JSON-LD
- Homepage: `@type: WebSite` with SearchAction
- Category pages: `@type: ItemList` with vendor entries

**Root layout metadata:**
```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://signagehub.com'),
  title: {
    default: 'SignageHub | Digital Signage Directory',
    template: '%s | SignageHub',
  },
  openGraph: {
    siteName: 'SignageHub',
    type: 'website',
  },
}
```

### Implementation Phases

#### Phase 1: Foundation (Days 1-3)

Set up the project skeleton, database, and core rendering pipeline.

**Tasks:**
- [x] `npx create-next-app@latest SignageHub` with App Router, TypeScript, Tailwind v4, ESLint
- [x] Configure `postcss.config.mjs` with `@tailwindcss/postcss` (Tailwind v4)
- [x] Configure `app/globals.css` with `@import "tailwindcss"` and `@theme` customization
- [x] Set up MongoDB connection singleton in `lib/db.ts` (serverless-safe pattern with global cache, `bufferCommands: false`)
- [x] Create `models/Vendor.ts` Mongoose schema with all indexes
- [x] Create `models/Click.ts` Mongoose schema with TTL index
- [x] Define taxonomy constants in `types/taxonomy.ts`
- [x] Create `lib/vendors.ts` with `getAllVendorSlugs()`, `getVendorBySlug()`, `searchVendors()`
- [x] Create `scripts/seed-vendors.ts` to import from `data/vendors.json`
- [x] Curate initial `data/vendors.json` with 30-50 vendors (manual research, validate data)
- [ ] Set up Vercel project, connect repo, configure `MONGODB_URI` env var
- [x] Create root `app/layout.tsx` with `metadataBase`, fonts (`next/font`), Vercel Analytics
- [x] Create `app/robots.ts` and `app/sitemap.ts`

**Files:**
```
app/layout.tsx
app/globals.css
app/robots.ts
app/sitemap.ts
lib/db.ts
lib/vendors.ts
lib/taxonomy.ts
models/Vendor.ts
models/Click.ts
types/vendor.ts
types/taxonomy.ts
scripts/seed-vendors.ts
data/vendors.json
postcss.config.mjs
next.config.ts
```

**Success criteria:** `npm run dev` serves a blank page connected to MongoDB. `seed-vendors.ts` populates 30-50 vendors. Sitemap generates correct URLs.

#### Phase 2: Core Directory (Days 4-8)

Build the directory browsing experience — the core product.

**Tasks:**
- [x] Build `components/VendorCard.tsx` (server component — logo, name, tagline, categories, pricing badge)
- [x] Build `app/(directory)/layout.tsx` (directory shell with nav bar)
- [x] Build `app/(directory)/vendors/[slug]/page.tsx` with ISR, `generateStaticParams`, `generateMetadata`, JSON-LD
- [x] Build `components/VendorProfile.tsx` (full profile: description, features, categories, verticals, website link, related vendors)
- [x] Build `components/JsonLd.tsx` (reusable structured data component)
- [x] Build `app/(directory)/vendors/page.tsx` (SSR listing, reads `searchParams`)
- [x] Build `components/FilterBar.tsx` (client component — category checkboxes, vertical select, pricing filter, sort toggle)
- [x] Build `components/SearchInput.tsx` (client component — debounced text input, updates URL `?q=`)
- [x] Build `components/Pagination.tsx` (server component — link-based, 24 per page)
- [x] Build `app/(directory)/category/[slug]/page.tsx` with ISR, custom H1/meta per category
- [x] Build `app/(directory)/vertical/[slug]/page.tsx` with ISR, custom H1/meta per vertical
- [x] Build `app/go/[slug]/route.ts` (affiliate redirect — log click to `clicks` collection, redirect to `affiliateUrl || websiteUrl`)
- [x] Build `lib/clicks.ts` with `logClick()` function
- [ ] Build `app/(directory)/vendors/[slug]/opengraph-image.tsx` (dynamic OG image per vendor)
- [x] Wire up related vendors on profile page (same primary category, shared verticals, max 4)

**Files:**
```
app/(directory)/layout.tsx
app/(directory)/vendors/page.tsx
app/(directory)/vendors/[slug]/page.tsx
app/(directory)/vendors/[slug]/opengraph-image.tsx
app/(directory)/category/[slug]/page.tsx
app/(directory)/vertical/[slug]/page.tsx
app/go/[slug]/route.ts
components/VendorCard.tsx
components/VendorProfile.tsx
components/FilterBar.tsx
components/SearchInput.tsx
components/Pagination.tsx
components/JsonLd.tsx
lib/clicks.ts
```

**Success criteria:** Browse vendors by category/vertical. Search by name/tags. Filter narrows results with URL-persisted state. Click "Visit Website" routes through `/go/[slug]` and logs to MongoDB. Vendor profile pages have correct meta tags, OG images, and JSON-LD. Lighthouse SEO score 90+.

#### Phase 3: Homepage + Content (Days 9-13)

Build the homepage and editorial content layer — the SEO engine.

**Tasks:**
- [x] Build `app/page.tsx` (homepage — hero search bar, category grid, featured vendors, recent articles)
- [x] Build `components/CategoryGrid.tsx` (6 category cards with icons and vendor counts)
- [x] Build `components/FeaturedVendors.tsx` (top 6 featured vendors, visually distinct section)
- [x] Install `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `remark-gfm`
- [x] Configure `next.config.ts` with MDX support (`createMDX` wrapper, `pageExtensions`)
- [x] Create `app/(content)/layout.tsx` (prose container, article nav)
- [x] Create `app/(content)/guides/[slug]/page.tsx` with `generateStaticParams`, `generateMetadata`, Article JSON-LD
- [x] Write 5 initial MDX articles:
  - `content/guides/best-digital-signage-software-2026.mdx`
  - `content/guides/digital-signage-for-retail.mdx`
  - `content/guides/digital-signage-hardware-comparison.mdx`
  - `content/guides/what-is-digital-signage.mdx`
  - `content/guides/digital-signage-cost-guide.mdx`
- [x] Each article exports `metadata` (title, description, publishedAt, tags) and links to relevant vendor profiles
- [x] Add article listing to homepage (3 most recent)

**Files:**
```
app/page.tsx
app/(content)/layout.tsx
app/(content)/guides/[slug]/page.tsx
components/CategoryGrid.tsx
components/FeaturedVendors.tsx
content/guides/*.mdx (5 articles)
next.config.ts (updated with MDX)
```

**Success criteria:** Homepage loads in <1s, displays search, categories, featured vendors, and articles. MDX articles render with proper typography, link to vendor profiles. Article pages have Article JSON-LD. Google Search Console accepts sitemap with all URLs.

#### Phase 4: Data Seeding + Polish (Days 14-18)

Scale from 50 to 200+ vendors and polish the UX.

**Tasks:**
- [ ] Research and curate vendor data for remaining 150-250 vendors (scrape from Digital Signage Today vendor list, company websites, press releases)
- [ ] Build `scripts/scrape-vendors.ts` — scrape public vendor info into standardized JSON format
- [ ] Validate and clean all vendor data (descriptions, correct categories, working URLs, logos)
- [ ] Download/process vendor logos → optimize with sharp, store in `public/logos/` or upload to Cloudinary
- [ ] Configure `next.config.ts` `images.remotePatterns` for logo hosting
- [ ] Add responsive design polish — mobile filter bottom sheet, card grid breakpoints
- [x] Add empty state / zero results component
- [x] Add "About SignageHub" page with editorial policy (trust signal)
- [ ] Set up Plausible or Umami analytics (self-hosted or cloud)
- [ ] Performance audit: Lighthouse 90+ on all Core Web Vitals
- [ ] Test all flows: search → filter → profile → affiliate redirect → back (filter state preserved)
- [x] Write 5 more MDX articles (total 10)

**Files:**
```
scripts/scrape-vendors.ts
data/vendors.json (expanded to 200+)
public/logos/*.png
app/about/page.tsx
components/EmptyState.tsx
components/MobileFilterSheet.tsx
```

**Success criteria:** 200+ vendor profiles live. Mobile UX is polished. All outbound clicks tracked. Lighthouse Performance 90+, SEO 95+. Analytics collecting data.

#### Phase 5: Monetization Foundation (Days 19-25)

Add the revenue infrastructure.

**Tasks:**
- [ ] Research affiliate programs for top 20 signage vendors (BrightSign, ScreenCloud, Rise Vision, Novisign, Mvix, etc.)
- [ ] Set up affiliate accounts, get tracking links, populate `affiliateUrl` field
- [ ] Build affiliate click dashboard page (internal/admin — total clicks per vendor, per day, conversion tracking)
- [ ] Add "Featured" badge and visual treatment for sponsored vendors in listings
- [ ] Add Google AdSense or direct ad placements (sidebar banner on listing pages)
- [ ] Write 10 more MDX articles (total 20) — focus on high-value SEO keywords:
  - "best digital signage for [each vertical]" (7 articles)
  - "digital signage pricing guide 2026"
  - "open source digital signage software"
  - "digital signage vs static signage"
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Search Console monitoring
- [ ] Add newsletter signup (Buttondown or ConvertKit) — footer CTA + article bottom CTA
- [x] Set up `app/api/revalidate/route.ts` webhook for on-demand ISR

**Files:**
```
app/admin/clicks/page.tsx (internal dashboard)
app/api/revalidate/route.ts
components/AdBanner.tsx
components/NewsletterSignup.tsx
content/guides/*.mdx (10 more articles)
```

**Success criteria:** Affiliate links live for 10+ vendors. Click dashboard shows tracking data. 20 SEO articles published. Newsletter collecting subscribers. Site indexed in Google.

### Technology Stack Details

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | Next.js | 16.x | App Router, ISR, `params` is `Promise` in v16 |
| Database | MongoDB Atlas | 7.x | Free tier (M0) sufficient, 500 connection limit |
| ODM | Mongoose | 8.x | `bufferCommands: false` for serverless |
| CSS | Tailwind CSS | v4 | CSS-first `@theme`, no `tailwind.config.js` |
| Content | @next/mdx | latest | JS-export metadata, `remark-gfm` |
| Hosting | Vercel | - | Free tier, ISR, image optimization |
| Analytics | Plausible/Umami | - | Privacy-friendly, no cookie banner needed |
| Images | next/image | built-in | `remotePatterns` for vendor logos |
| Fonts | next/font | built-in | Inter via `next/font/google` |

### Key Technical Gotchas (from research)

1. **Next.js 16 `params` is a Promise** — always `const { slug } = await params` in every page, layout, and `generateMetadata`
2. **`revalidateTag` only works with `fetch`**, not Mongoose queries — use `revalidatePath` for MongoDB-backed pages
3. **Never check `MONGODB_URI` at module top-level** — breaks `next build`. Check inside `dbConnect()` function.
4. **Tailwind v4: no `tailwind.config.js`** — all customization via `@theme` in CSS. PostCSS plugin is `@tailwindcss/postcss`.
5. **Tailwind v4: `space-x/y` selector changed** — migrate to `gap` for flex/grid layouts
6. **Mongoose model guard** — use `mongoose.models.Vendor || mongoose.model(...)` to prevent hot-reload redefinition
7. **Atlas M0 connections** — set `maxPoolSize: 5` on free tier to stay under 500 limit
8. **Vercel image optimization** — set `minimumCacheTTL: 604800` (7 days) for logos to minimize billing
9. **Contentlayer is dead** — do NOT use `contentlayer` or `contentlayer2` with Next.js 16. Use `@next/mdx` or Velite.

## Acceptance Criteria

### Functional Requirements

- [ ] 200+ vendor profiles with name, description, categories, verticals, logo, website link
- [ ] Search vendors by name, description, tags with weighted text search
- [ ] Filter vendors by segment (multi-select, OR logic) and vertical (single-select)
- [ ] Sort vendors by featured-first, alphabetical, or newest
- [ ] Pagination at 24 vendors per page with URL-serialized state
- [ ] Category browse pages at `/category/[slug]` (6 segments)
- [ ] Vertical browse pages at `/vertical/[slug]` (7 verticals)
- [ ] Vendor profile pages with full description, related vendors, outbound link
- [ ] 20+ SEO editorial articles at `/guides/[slug]`
- [ ] Affiliate redirect at `/go/[slug]` with click logging to MongoDB
- [ ] Dynamic sitemap including all vendor, category, vertical, and guide URLs
- [ ] Homepage with search bar, category grid, featured vendors, recent articles

### Non-Functional Requirements

- [ ] Lighthouse Performance score 90+
- [ ] Lighthouse SEO score 95+
- [ ] Lighthouse Accessibility score 90+
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] Vendor profile pages fully rendered at edge (ISR)
- [ ] Mobile-responsive at all breakpoints (375px, 768px, 1024px, 1440px)
- [ ] No client-side JS on vendor profile pages (server components only, except outbound click tracking)

### Quality Gates

- [ ] All pages have valid meta titles, descriptions, and canonical URLs
- [ ] All vendor profiles have valid JSON-LD structured data
- [ ] No broken outbound links (validate all websiteUrls)
- [ ] Filter state preserved on browser back navigation
- [ ] Zero console errors in production build

## Success Metrics

| Metric | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|----------|
| Vendor profiles | 200+ | 250+ | 300+ |
| SEO articles | 20 | 30 | 40+ |
| Monthly organic visits | 1,000 | 5,000 | 10,000 |
| Monthly affiliate clicks | 100 | 500 | 2,000 |
| Revenue (MRR) | $0-100 | $200-500 | $500-2,000 |
| Google indexed pages | 250+ | 300+ | 400+ |
| Newsletter subscribers | 50 | 200 | 500 |

## Dependencies & Prerequisites

- MongoDB Atlas account (free M0 tier)
- Vercel account (free Hobby tier)
- Domain name (signagehub.com or alternative)
- Affiliate program accounts with 10+ signage vendors
- 200+ vendor data points (names, descriptions, URLs, logos, categories)

## Risk Analysis & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Vendor data quality/staleness | Users lose trust if info is wrong | Add "Last verified" date, "Report an issue" link, quarterly data refresh process |
| SEO takes 3-6 months to compound | No traffic = no revenue early on | Supplement with direct outreach to vendors, social media, digital signage forums |
| Affiliate programs may not exist for many vendors | Revenue limited to ads only | Prioritize vendors with partner programs, supplement with direct sponsored listings |
| MongoDB Atlas free tier limits | 500 connections, 512MB storage | Sufficient for MVP; upgrade to M10 ($57/mo) if needed |
| Legal risk from scraping vendor data | Vendor complaints | Follow Yelp/G2 precedent — publicly available info. Add claim/update path for vendors. Remove on request. |

## Future Considerations

**v1.1 (Month 3-6):**
- Vendor claim-your-profile flow (email domain verification)
- User reviews and ratings
- Side-by-side comparison tool
- Newsletter with weekly digest

**v2 (Month 6-12):**
- Vendor self-service dashboard with analytics
- Lead generation / RFQ forms
- Tiered subscription plans ($49/$149/$399)
- Interactive "Solution Finder" quiz
- Sponsored content / advertorial articles

## References

### Architecture Patterns
- Next.js ISR: `generateStaticParams` + `revalidate` for vendor profiles
- MongoDB serverless: global singleton pattern with `bufferCommands: false`
- URL-driven filters: `useSearchParams` + `useTransition` + `router.push`
- Affiliate tracking: intermediate redirect at `/go/[slug]`

### External Documentation
- [Next.js App Router ISR](https://nextjs.org/docs/app/guides/incremental-static-regeneration)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Next.js Sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)
- [MongoDB Text Indexes](https://www.mongodb.com/docs/manual/core/index-text/)
- [Tailwind v4 Migration](https://tailwindcss.com/docs/upgrade-guide)

### Brainstorm
- [SignageHub Brainstorm](../brainstorms/2026-02-24-signage-hub-brainstorm.md)
