import Link from "next/link";
import { site } from "@/lib/site";
import { CurrentYear } from "./CurrentYear";

const legal = [
  { href: "/eeo", label: "EEO statement" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function SiteFooter() {
  const { address, phone } = site;
  return (
    <footer className="mt-auto bg-olive-deep text-cream">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
        <div>
          <p className="text-lg font-semibold">{site.name}</p>
          <p className="mt-1">{site.tagline}</p>
          <address className="mt-4 not-italic leading-relaxed">
            {address.street}
            <br />
            {address.city}, {address.region} {address.postal}
            <br />
            <a href={`tel:${phone.tel}`} className="inline-flex min-h-11 items-center underline underline-offset-4">
              {phone.display}
            </a>
          </address>
        </div>
        <nav aria-label="Legal" className="md:justify-self-end">
          <ul className="flex flex-col gap-1 md:items-end">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:no-underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-cream/20 px-4 py-4 text-center text-sm">
        © <CurrentYear /> {site.name}. All rights reserved.
      </p>
    </footer>
  );
}
