import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { flex } from "@/lib/flex";
import { site } from "@/lib/site";
import { RequestForm } from "./RequestForm";

export const metadata: Metadata = {
  title: "For Employers",
  description: `Hire engineers, builders and technicians who stay. ${flex.name}: one activation fee, then pay your way. Fees are ${flex.feeRange}.`,
};

export default function EmployersPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
          <p className="flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-ink-soft">
            <span aria-hidden="true" className="h-0.5 w-8 bg-brand-orange" />
            For employers
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight md:text-6xl">Hire people who stay.</h1>
          <p className="mt-6 max-w-2xl text-lg md:text-xl">
            We find the engineers, builders and technicians behind America&apos;s infrastructure, and we only get paid when
            they stay. You tell us what you need; we bring you people worth keeping.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#open-a-search" className="min-h-14 px-8 text-lg">
              Open a search
            </ButtonLink>
            <ButtonLink href={`tel:${site.phone.tel}`} variant="outline" className="min-h-14 px-8 text-lg">
              Call {site.phone.display}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Novus Flex */}
      <section aria-labelledby="flex" className="bg-sand">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h2 id="flex" className="text-2xl font-bold md:text-3xl">How {flex.name} works</h2>
          <p className="mt-3 max-w-2xl text-lg text-ink-soft">
            Simple pricing that rewards hires who stick. Fees are <strong className="text-ink">{flex.feeRange}</strong>.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_2fr]">
            <div className="rounded-lg border-l-4 border-brand-orange bg-cream p-6">
              <p className="text-sm font-medium uppercase tracking-widest text-ink-soft">Step 1</p>
              <h3 className="mt-2 text-xl font-bold">{flex.activation.title}</h3>
              <p className="mt-2 text-ink-soft">{flex.activation.body}</p>
            </div>
            <div className="rounded-lg bg-cream p-6">
              <p className="text-sm font-medium uppercase tracking-widest text-ink-soft">Step 2</p>
              <h3 className="mt-2 text-xl font-bold">Pick how you pay</h3>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {flex.options.map((o) => (
                  <li key={o.name} className="rounded-md bg-sand p-4">
                    <p className="font-bold">{o.name}</p>
                    <p className="mt-1 text-ink-soft">{o.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Request form */}
      <section aria-labelledby="open-a-search" className="bg-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1fr_1.4fr] md:py-20">
          <div>
            <h2 id="open-a-search" className="scroll-mt-24 text-2xl font-bold md:text-3xl">Open a search</h2>
            <p className="mt-3 text-lg text-ink-soft">
              Tell us what you&apos;re hiring for, and a recruiter will reach out to talk through your roles and how{" "}
              {flex.name} fits.
            </p>
            <p className="mt-6 text-ink-soft">
              Already working with Novus?{" "}
              <Link href="/login?next=/employer" className="inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4 hover:text-ink">
                Log in to your employer portal
              </Link>
            </p>
          </div>
          <RequestForm />
        </div>
      </section>
    </>
  );
}
