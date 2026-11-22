import Link from "next/link";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-ink-soft">
          <span aria-hidden="true" className="mr-2 inline-block h-0.5 w-8 bg-brand align-middle" />
          Infrastructure talent
        </p>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
          {site.oneLiner}
        </h1>
        <p className="mt-4 text-lg text-ink-soft">{site.tagline}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/jobs" className="flex min-h-12 items-center justify-center rounded-md bg-action px-6 font-semibold text-cream hover:bg-ink">
            Find Jobs
          </Link>
          <Link href="/employers" className="flex min-h-12 items-center justify-center rounded-md border-2 border-ink px-6 font-semibold text-ink hover:bg-ink hover:text-cream">
            For Employers
          </Link>
        </div>
      </section>

      <section aria-labelledby="industries" className="bg-sand">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 id="industries" className="text-2xl font-bold">Industries we serve</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {site.industries.map((name) => (
              <li key={name} className="rounded-md border-l-4 border-brand bg-cream px-4 py-4 font-medium">
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
