export interface TaxonomyItem {
  slug: string
  name: string
  description: string
  icon: string
}

export const CATEGORIES: TaxonomyItem[] = [
  {
    slug: "software",
    name: "Software & CMS",
    description:
      "Digital signage content management systems and cloud platforms",
    icon: "monitor",
  },
  {
    slug: "hardware",
    name: "Hardware & Displays",
    description: "Commercial displays, screens, kiosks, and mounting solutions",
    icon: "tv",
  },
  {
    slug: "media-players",
    name: "Media Players",
    description:
      "Dedicated media player devices for driving digital signage content",
    icon: "cpu",
  },
  {
    slug: "content-creation",
    name: "Content Creation",
    description:
      "Design tools, templates, and content production services for signage",
    icon: "palette",
  },
  {
    slug: "integration",
    name: "System Integration",
    description:
      "AV integrators, installation services, and system design firms",
    icon: "wrench",
  },
  {
    slug: "consulting",
    name: "Consulting & Strategy",
    description:
      "Digital signage strategy, ROI planning, and advisory services",
    icon: "lightbulb",
  },
]

export const VERTICALS: TaxonomyItem[] = [
  {
    slug: "retail",
    name: "Retail & Stores",
    description: "In-store displays, POS signage, and retail media networks",
    icon: "shopping-bag",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    description:
      "Hospital wayfinding, waiting room displays, and patient communication",
    icon: "heart",
  },
  {
    slug: "education",
    name: "Education",
    description:
      "Campus directories, classroom displays, and event boards",
    icon: "graduation-cap",
  },
  {
    slug: "corporate",
    name: "Corporate & Office",
    description:
      "Lobby directories, meeting room signs, and internal communications",
    icon: "building",
  },
  {
    slug: "hospitality",
    name: "Hospitality & Hotels",
    description:
      "Hotel lobbies, event venues, and guest-facing digital displays",
    icon: "bed",
  },
  {
    slug: "transportation",
    name: "Transportation",
    description:
      "Airport FIDS, transit displays, and wayfinding systems",
    icon: "plane",
  },
  {
    slug: "qsr",
    name: "QSR & Restaurants",
    description:
      "Digital menu boards, drive-thru displays, and kitchen displays",
    icon: "utensils",
  },
]

export function getCategoryBySlug(slug: string): TaxonomyItem | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getVerticalBySlug(slug: string): TaxonomyItem | undefined {
  return VERTICALS.find((v) => v.slug === slug)
}
