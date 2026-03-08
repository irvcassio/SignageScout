import Link from "next/link"
import { CATEGORIES, type TaxonomyItem } from "@/types/taxonomy"

const iconMap: Record<string, string> = {
  monitor: "🖥️",
  tv: "📺",
  cpu: "⚙️",
  palette: "🎨",
  wrench: "🔧",
  lightbulb: "💡",
}

function CategoryCard({ item }: { item: TaxonomyItem }) {
  return (
    <Link
      href={`/category/${item.slug}`}
      className="group rounded-xl border border-border bg-surface p-5 hover:shadow-md transition-all hover:border-primary/30"
    >
      <div className="text-2xl mb-3">{iconMap[item.icon] ?? "📁"}</div>
      <h3 className="font-semibold text-foreground group-hover:text-primary">
        {item.name}
      </h3>
      <p className="text-sm text-muted mt-1">{item.description}</p>
    </Link>
  )
}

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {CATEGORIES.map((cat) => (
        <CategoryCard key={cat.slug} item={cat} />
      ))}
    </div>
  )
}
