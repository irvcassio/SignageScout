# SignageHub — Directory Listing Website for Digital Signage Industry

**Date:** 2026-02-24
**Status:** Brainstorm complete, ready for planning

---

## What We're Building

A curated directory listing website for the digital signage industry — the go-to resource for buyers evaluating software, hardware, media players, content services, and integration partners. Directory-first with SEO content (comparison guides, buyer articles) driving organic traffic.

**Target:** $500-2K/mo revenue within 6-12 months as a side project.

## Who It's For

### Buyers (traffic side)
- IT managers evaluating signage solutions for their org
- Retail operations teams (like EL) deploying in-store displays
- Facilities managers in healthcare, education, corporate, hospitality
- AV integrators researching vendor partnerships

### Vendors (revenue side)
- Digital signage software companies (ScreenCloud, Rise Vision, Mvix, Novisign, etc.)
- Hardware manufacturers and resellers (BrightSign, Samsung, LG commercial)
- Media player companies
- Content creation agencies
- System integrators and consultants

## Why This Approach

### Market gap
- $13.2B industry in 2026, growing to $28.88B by 2030
- 13+ major software vendors, hundreds of integrators, fragmented landscape
- No dominant curated directory — digitalsignagedirectory.com is basic, Digital Signage Today is news-first
- G2/Capterra cover digital signage but aren't specialized (generic SaaS comparison)

### Lean Directory + SEO Engine (Approach 1)
Chosen over full platform MVP or micro-SaaS tool because:
1. Fastest path to revenue — affiliate links + sponsored listings don't require a vendor sales cycle
2. SEO content compounds — "best digital signage for retail 2026" articles build traffic over months
3. Scraped/curated profiles provide immediate value without vendor cooperation
4. Low maintenance once seeded — content + profiles are relatively static
5. Side project compatible — can build incrementally

### Adjacent experience advantage
Builder works in retail tech (EssilorLuxottica), sees signage deployed in stores, understands the buyer's evaluation pain. Not a vendor — brings unbiased credibility.

## Key Decisions

### 1. Tech Stack: Custom Next.js + MongoDB
- Leverages existing experience (Stoke project uses same stack)
- Full control over UX, SEO, vendor profiles, monetization
- Next.js App Router for SSG/ISR (critical for SEO performance)
- MongoDB for flexible vendor profile schemas
- Tailwind for rapid UI development
- Vercel for hosting (free tier sufficient initially)

### 2. Core Model: Directory-first
- Rich, searchable vendor profiles as the primary experience
- SEO content (guides, comparisons, "best of" lists) drives traffic to the directory
- Not a news site, not a blog with a directory bolted on

### 3. Revenue Model: Layered monetization
**Phase 1 (months 1-3):** Affiliate links on vendor profiles (most SaaS signage companies have partner programs)
**Phase 2 (months 3-6):** Sponsored/featured listings ($49-149/mo), banner ads
**Phase 3 (months 6-12):** Vendor claim-your-profile, lead gen (RFQ forms), sponsored articles

### 4. Launch Strategy: Scrape + Content Combo
- Auto-populate 200-300 vendor profiles from public data (websites, LinkedIn, press releases, existing directories)
- Simultaneously publish 20-30 SEO-targeted articles ("Best digital signage software for retail 2026", "Digital signage hardware comparison", etc.)
- Vendors can claim and enhance their profiles later (free initially, premium features paid)

### 5. Taxonomy — Dual-axis categorization
**By segment:** Software | Hardware | Media Players | Content Creation | Integration | Consulting
**By vertical:** Retail | Healthcare | Education | Corporate | Hospitality | Transportation | QSR/Restaurants

## MVP Feature Scope

### Must have (v1 launch)
- Vendor profile pages (name, description, category, verticals, website, pricing tier, logo)
- Category/vertical browse pages
- Search with filters (segment, vertical, pricing, features)
- 20-30 SEO content pages (buyer guides, comparisons)
- Responsive design, fast (90+ Lighthouse)
- Basic analytics (Plausible or Umami)
- Affiliate link tracking

### Nice to have (v1.1)
- Vendor claim-your-profile flow
- User reviews/ratings
- "Compare" tool (side-by-side vendor comparison)
- Newsletter signup
- Sponsored listing placement

### Future (v2+)
- Vendor self-service dashboard
- Lead gen / RFQ forms
- Tiered subscription plans
- Interactive solution finder quiz
- Vendor analytics (profile views, clicks, leads)

## Open Questions

1. **Domain:** Is signagehub.com available? Alternatives: signagehub.io, thesignagehub.com, signage.directory
2. **Scraping approach:** Manual curation vs. automated scraping? How to handle vendor data accuracy?
3. **Affiliate programs:** Which signage vendors actually have partner/affiliate programs? Need to research.
4. **Content strategy:** Who writes the 20-30 SEO articles? AI-assisted with human editing? Hire writers?
5. **Legal:** Any concerns with scraping vendor info and creating profiles without permission? (Yelp/G2 model is established precedent)

## Competitive Positioning

| Feature | SignageHub | Digital Signage Today | G2/Capterra | digitalsignagedirectory.com |
|---------|-----------|----------------------|-------------|---------------------------|
| Specialized for signage | Yes | Yes (news-first) | No (generic) | Yes (basic) |
| Rich vendor profiles | Yes | Basic list | Yes | Basic |
| Buyer guides/comparisons | Yes | News articles | Yes | No |
| Search & filter | Yes | Limited | Yes | Limited |
| Vertical-specific content | Yes | Some | No | No |
| Modern UX | Yes | Dated | Yes | Very dated |
| Reviews/ratings | v1.1 | No | Yes | No |

## Success Metrics

- **Month 3:** 200+ vendor profiles live, 20+ content pages, 1K+ monthly organic visits
- **Month 6:** 5K+ monthly visits, first sponsored listings revenue, 3+ affiliate partnerships
- **Month 12:** 10K+ monthly visits, $500-2K/mo revenue, 50+ claimed vendor profiles
