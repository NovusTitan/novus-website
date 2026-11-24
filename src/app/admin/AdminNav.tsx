import Link from "next/link";

const items = [
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/requests", label: "Search requests" },
  { href: "/admin/employers", label: "Employers" },
] as const;

// Recruiter dashboard tabs. `current` marks the active section.
export function AdminNav({ current }: { current: (typeof items)[number]["href"] }) {
  return (
    <nav aria-label="Recruiter dashboard" className="mb-8 border-b border-chip">
      <p className="text-sm font-medium uppercase tracking-widest text-ink-soft">Recruiter dashboard</p>
      <ul className="-mb-px mt-2 flex gap-6 overflow-x-auto">
        {items.map((i) => (
          <li key={i.href}>
            <Link
              href={i.href}
              aria-current={current === i.href ? "page" : undefined}
              className={`inline-flex min-h-11 items-center whitespace-nowrap border-b-4 font-semibold transition-colors duration-150 ${
                current === i.href ? "border-action text-ink" : "border-transparent text-ink-soft hover:text-ink"
              }`}
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
