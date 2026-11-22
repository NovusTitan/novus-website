import Link from "next/link";
import { contactLink, loginLink, site } from "@/lib/site";
import { ButtonLink } from "./ui/Button";
import { CurrentYear } from "./CurrentYear";

const links = [
  contactLink,
  loginLink,
  { href: "/eeo", label: "EEO statement" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

// The site's one dark section. `on-dark` switches focus rings to cream.
export function SiteFooter() {
  const { address, phone } = site;
  return (
    <footer className="on-dark mt-auto bg-deep-olive text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2">
        <div>
          <p className="text-lg font-bold">{site.name}</p>
          <p className="mt-1">{site.tagline}</p>
          <address className="mt-5 not-italic">
            {address.street}
            <br />
            {address.city}, {address.region} {address.postal}
          </address>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href={contactLink.href} variant="on-dark">
              Contact us
            </ButtonLink>
            <a
              href={`tel:${phone.tel}`}
              className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4 hover:no-underline"
            >
              Call {phone.display}
            </a>
          </div>
        </div>
        <nav aria-label="Footer" className="md:justify-self-end">
          <ul className="flex flex-col md:items-end">
            {links.map((l) => (
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
