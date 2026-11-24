import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { transition } from "@/lib/outplacement";
import { contactLink, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Outplacement",
  description: `${transition.name}: career transition support for the people you're letting go, from $750 per person. Résumés, coaching and introductions to employers that are hiring.`,
};

export default function OutplacementPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <p className="flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-ink-soft">
            <span aria-hidden="true" className="h-0.5 w-8 bg-brand-orange" />
            Outplacement
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Help your people land their next job.
          </h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl">
            Letting people go is hard. {transition.name} gives them real support finding what&apos;s next, including
            introductions to Novus clients that are hiring.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={contactLink.href} className="min-h-14 px-8 text-lg">
              Talk to us
            </ButtonLink>
            <ButtonLink href={`tel:${site.phone.tel}`} variant="outline" className="min-h-14 px-8 text-lg">
              Call {site.phone.display}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section aria-labelledby="packages" className="bg-sand">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h2 id="packages" className="text-2xl font-bold md:text-3xl">Pick a package for each person</h2>
          <p className="mt-3 max-w-2xl text-lg text-ink-soft">Priced per person. You only pay for people who enroll.</p>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {transition.packages.map((p) => (
              <li key={p.name} className="flex flex-col gap-3 rounded-lg bg-cream p-6">
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p>
                  <span className="text-3xl font-bold">{p.price}</span>{" "}
                  <span className="text-ink-soft">per person · {p.length}</span>
                </p>
                <ul className="grid gap-2 border-t border-chip pt-3">
                  {p.includes.map((i) => (
                    <li key={i} className="flex gap-2">
                      <Check />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how" className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h2 id="how" className="text-2xl font-bold md:text-3xl">How it works</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {transition.steps.map((s, i) => (
              <li key={s.title} className="rounded-lg bg-sand p-6">
                <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-chip text-lg font-bold text-deep-olive">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
                <p className="mt-2 text-ink-soft">{s.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 max-w-3xl border-l-4 border-olive pl-6">
            <h3 className="text-xl font-bold">50% placement credit</h3>
            <p className="mt-2">{transition.credit}</p>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section aria-labelledby="promises" className="bg-sand">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h2 id="promises" className="text-2xl font-bold md:text-3xl">Respectful to everyone involved</h2>
          <ul className="mt-6 grid max-w-3xl gap-3">
            {transition.promises.map((p) => (
              <li key={p} className="flex gap-2 text-lg">
                <Check />
                <span>{p}</span>
              </li>
            ))}
          </ul>
          <ul className="mt-8 grid gap-1 text-sm text-ink-soft">
            {transition.fineprint.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={contactLink.href}>Talk to us about outplacement</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

function Check() {
  return (
    <svg aria-hidden="true" className="mt-1 shrink-0 text-olive" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}
