# SignageScout — Knowledge Document

## What It Is

SignageScout is a curated directory of 200+ digital signage vendors targeting the $13B digital signage market. It helps buyers (IT managers, operations teams, facility directors) discover and compare vendors across software, hardware, services, and consulting.

- **Domain**: signagescout.com
- **Revenue model**: Affiliate commissions + sponsored placements (no payment for inclusion)
- **Editorial policy**: Profiles based on public info + vendor verification; featured badges don't influence recommendations
- **Contact**: hello@signagescout.com

---

## Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4, PostCSS, `@tailwindcss/typography` |
| Database | MongoDB Atlas + Mongoose 9.2 (serverless pooling) |
| Content | MDX via `@next/mdx` + `remark-gfm` |
| Deployment | Vercel |
| Images | Cloudinary (optional, via `next.config.ts` remote patterns) |

### Rendering Strategy

| Route | Strategy | Revalidation |
|-------|----------|-------------|
| Vendor profiles (`/vendors/[slug]`) | ISR | 1 hour |
| Category pages (`/category/[slug]`) | ISR | 30 minutes |
| Vertical pages (`/vertical/[slug]`) | ISR | 30 minutes |
| Homepage (`/`) | SSR | On demand |
| Guides (`/guides/[slug]`) | Static | Filesystem-based (no DB) |
| Sitemap (`/sitemap.ts`) | Dynamic | Daily |

### Data Model

**Vendor** (`models/Vendor.ts`):
- `name`, `slug` (unique, indexed), `tagline` (160 chars), `shortDescription` (320 chars), `longDescription`
- `logoUrl`, `websiteUrl`, `affiliateUrl`
- `categories[]` — software, hardware, media-players, content-creation, integration, consulting
- `verticals[]` — retail, healthcare, education, corporate, hospitality, transportation, qsr
- `tags[]`, `pricingModel` (free/freemium/paid/enterprise/contact)
- `featured`, `verified`, `listingScore` (0-100, drives sort priority)
- Text search index: `name` (weight 10), `tagline` (5), `tags` (3), `shortDescription` (1)

**Click** (`models/Click.ts`):
- `vendorSlug`, `sourcePath`, `destinationUrl`, `isAffiliate`, `timestamp`, `userAgent`
- TTL index: auto-expires after 90 days

**Vendor seed data**: `data/vendors.json` (200+ vendors, ~209 KB)

### Database Connection

`lib/db.ts` uses cached Mongoose connection with serverless pooling:
- `serverSelectionTimeoutMS: 5000`
- `maxPoolSize: 5`
- `bufferCommands: false`
- Connection deferred into `dbConnect()` — builds succeed without `MONGODB_URI`

### Folder Structure

```
SignageScout/
├── app/
│   ├── (content)/
│   │   ├── guides/              # Buyer guides list + [slug] detail
│   │   └── layout.tsx
│   ├── (directory)/
│   │   ├── vendors/             # Directory list + [slug] profile
│   │   ├── category/[slug]/     # 6 category pages
│   │   ├── vertical/[slug]/     # 7 vertical/industry pages
│   │   └── layout.tsx
│   ├── go/[slug]/route.ts       # Affiliate click redirect + tracking
│   ├── api/revalidate/route.ts  # ISR webhook (POST, requires secret)
│   ├── about/page.tsx
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout
│   ├── sitemap.ts               # Dynamic XML sitemap
│   └── robots.ts
├── components/
│   ├── VendorCard.tsx           # Card for grid display
│   ├── VendorProfile.tsx        # Full vendor detail view
│   ├── FilterBar.tsx            # Category/vertical/sort filters
│   ├── SearchInput.tsx          # Full-text search
│   ├── Pagination.tsx           # 24 vendors per page
│   ├── CategoryGrid.tsx         # Homepage category tiles
│   ├── FeaturedVendors.tsx      # Featured vendor carousel
│   ├── EmptyState.tsx           # No results state
│   └── JsonLd.tsx               # Schema.org structured data
├── lib/
│   ├── db.ts                    # MongoDB connection (cached, serverless)
│   ├── vendors.ts               # Vendor queries (search, filter, counts)
│   ├── clicks.ts                # Click tracking logger
│   ├── guides.ts                # Guide metadata + listing
│   └── taxonomy.ts              # Category/vertical definitions
├── models/
│   ├── Vendor.ts
│   └── Click.ts
├── types/
│   ├── vendor.ts                # IVendor, VendorSort
│   └── taxonomy.ts              # TaxonomyItem, CATEGORIES, VERTICALS
├── content/guides/              # 10 MDX buyer guides
├── data/vendors.json            # 200+ vendor seed data
├── scripts/seed-vendors.ts      # Seed CLI
└── docs/                        # Planning docs
```

---

## Key Features

### Vendor Directory (`/vendors`)
- Full-text search across names, taglines, tags, descriptions
- Multi-select category filters (checkbox)
- Single-select vertical filters (radio buttons)
- Sort: Featured First (default), A-Z, Newest
- 24 vendors per page with pagination

### Vendor Profiles (`/vendors/[slug]`)
- Initials avatar, name, tagline, featured/verified badges, pricing model
- Long description, tags, categories, verticals as clickable links
- "Visit Website" CTA — redirects via `/go/[slug]` for click tracking
- 4 related vendors (same categories/verticals)
- All slugs pre-generated at build time

### Affiliate Click Tracking (`/go/[slug]`)
1. User clicks "Visit Website"
2. Click logged async (slug, referer, destination, affiliate flag, user agent)
3. Redirects to `affiliateUrl` (if set) or `websiteUrl`
4. 90-day data retention via TTL index

### Buyer Guides (`/guides`)
- 10 MDX articles (e.g., "Best Digital Signage Software in 2026", "Digital Signage Cost Guide")
- Filesystem-based — no database dependency
- Rich prose rendering via Tailwind typography
- Metadata: title, description, publishedAt, tags

### Taxonomy
- **6 Categories**: software, hardware, media-players, content-creation, integration, consulting
- **7 Verticals**: retail, healthcare, education, corporate, hospitality, transportation, qsr

### SEO
- Dynamic page titles and descriptions
- Open Graph tags
- Schema.org structured data (`JsonLd.tsx`)
- Dynamic XML sitemap (vendors, categories, verticals)
- Canonical URLs

---

## Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Vercel account (for deployment)

### Local Development

```bash
cd ~/SignageScout
npm install
```

Create `.env.local`:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/signagescout
NEXT_PUBLIC_SITE_URL=http://localhost:3000
REVALIDATE_SECRET=your-random-secret-key
```

Seed the database and start:

```bash
npm run seed       # Loads 200+ vendors from data/vendors.json into MongoDB
npm run dev        # http://localhost:3000
```

### Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Development server (port 3000) |
| `npm run build` | Production build (generates static pages + ISR) |
| `npm run start` | Production server |
| `npm run seed` | Seed vendors from `data/vendors.json` to MongoDB |
| `npm run lint` | ESLint |

### Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public URL for SEO metadata |
| `REVALIDATE_SECRET` | Yes | Secret for ISR webhook (`/api/revalidate`) |

### Production Deployment (Vercel)

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Automatic deployments on push to `main`
4. Domain: signagescout.com

### ISR Revalidation Webhook

Trigger on-demand revalidation for a specific path:

```bash
curl -X POST https://signagescout.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: your-secret" \
  -d '{"path": "/vendors/screencloud"}'
```

---

## Design System

| Token | Value |
|-------|-------|
| Primary | `#2563eb` (blue) |
| Primary Dark | `#1d4ed8` |
| Accent | `#0891b2` (cyan) |
| Background | `#ffffff` |
| Foreground | `#0f172a` (dark slate) |
| Muted | `#64748b` (gray) |
| Border | `#e2e8f0` (light gray) |
| Card | `#f8fafc` |
| Font Sans | Inter |
| Font Mono | Geist Mono |

Pricing badge colors: green (free), blue (freemium), gray (paid), purple (enterprise), amber (contact).
