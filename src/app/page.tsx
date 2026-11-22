import type { ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { contactLink, site } from "@/lib/site";

// Home page order is fixed by Brand & UX (CLAUDE.md):
// hero → industries → open roles → how it works → proof → contact. Nothing else.

function Section({ id, title, intro, tone = "cream", children }: {
  id: string; title: string; intro?: string; tone?: "cream" | "sand"; children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={tone === "sand" ? "bg-sand" : "bg-cream"}>
      <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h2 id={id} className="text-2xl font-bold md:text-3xl">{title}</h2>
        {intro && <p className="mt-3 max-w-2xl text-lg text-ink-soft">{intro}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

const steps = [
  { title: "Tell us what you need", body: "Looking for work or looking to hire? A quick call is all it takes to start." },
  { title: "We make the match", body: "We screen for skills and fit, then introduce you to the right job or the right person." },
  { title: "We stay with you", body: "We check in after day one. We only get paid when the hire stays." },
];

export default function Home() {
  return (
    <>
      {/* 1. Hero */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-28">
          <p className="flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-ink-soft">
            <span aria-hidden="true" className="h-0.5 w-8 bg-brand-orange" />
            Infrastructure talent
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">{site.tagline}</h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl">{site.oneLiner}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/jobs" className="min-h-14 px-8 text-lg">Build my career</ButtonLink>
            <ButtonLink href="/employers" variant="outline" className="min-h-14 px-8 text-lg">Build my team</ButtonLink>
          </div>
        </div>
      </section>

      {/* 2. Industries */}
      <Section id="industries" title="Industries we serve" tone="sand"
        intro="We focus on the people who design, build and keep America's infrastructure running.">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {site.industries.map((name) => (
            <li key={name} className="rounded-md border-l-4 border-brand-orange bg-cream px-5 py-5 text-lg font-semibold">
              {name}
            </li>
          ))}
        </ul>
      </Section>

      {/* 3. Open roles near you. Placeholder until the job board exists. */}
      <Section id="open-roles" title="Open roles near you">
        <div className="flex flex-col items-start gap-5 rounded-lg border-2 border-dashed border-olive p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <p className="text-lg font-semibold">Open roles are coming soon.</p>
            <p className="mt-1 text-ink-soft">New jobs in engineering, construction, data centers and more will show up here.</p>
          </div>
          <ButtonLink href="/jobs" className="shrink-0">See all jobs</ButtonLink>
        </div>
      </Section>

      {/* 4. How it works */}
      <Section id="how-it-works" title="How it works" tone="sand">
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-lg bg-cream p-6">
              <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-chip text-lg font-bold text-deep-olive">
                {i + 1}
              </span>
              <h3 className="mt-4 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-ink-soft">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* 5. Proof. Add testimonials here once we have real ones. */}
      <Section id="proof" title="We only get paid when they stay">
        <div className="max-w-2xl border-l-4 border-olive pl-6">
          <p className="text-lg">
            Our fees are tied to retention, not just placement. That keeps us focused on the right match, not the fastest one.
          </p>
          <p className="mt-4 text-ink-soft">
            Employers get people who stick. Candidates get jobs worth staying in.
          </p>
        </div>
      </Section>

      {/* 6. Contact */}
      <Section id="contact" title="Talk to a recruiter" tone="sand" intro="Questions about a job or a hire? We'll give you a straight answer.">
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={`tel:${site.phone.tel}`}>Call {site.phone.display}</ButtonLink>
          <ButtonLink href={contactLink.href} variant="outline">Contact us</ButtonLink>
        </div>
        <address className="mt-6 not-italic text-ink-soft">
          {site.address.street}, {site.address.city}, {site.address.region} {site.address.postal}
        </address>
      </Section>
    </>
  );
}
