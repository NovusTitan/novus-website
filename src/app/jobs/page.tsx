import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { JobCard } from "@/components/jobs/JobCard";
import { Button, ButtonLink } from "@/components/ui/Button";
import { SelectField } from "@/components/ui/Field";
import { getOpenJobs } from "@/lib/data/jobs";
import { INDUSTRIES, jobLocation } from "@/lib/jobs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Find Jobs",
  description: "Open jobs in engineering, architecture, data centers, construction and telecom, through Novus Talent Company.",
};

export default function JobsPage({ searchParams }: PageProps<"/jobs">) {
  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-12 md:pt-16">
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">Find your next job</h1>
          <p className="mt-3 max-w-2xl text-lg text-ink-soft">
            Real jobs with real employers in America&apos;s infrastructure. Apply in a few minutes from your phone.
          </p>
        </div>
      </section>
      <Suspense fallback={<ListSkeleton />}>
        <JobsList searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function JobsList({ searchParams }: Pick<PageProps<"/jobs">, "searchParams">) {
  const [sp, jobs] = await Promise.all([searchParams, getOpenJobs()]);
  const industry = typeof sp.industry === "string" ? sp.industry : "";
  const location = typeof sp.location === "string" ? sp.location : "";

  const locations = [...new Set(jobs.map(jobLocation))].sort();
  const shown = jobs.filter(
    (j) => (!industry || j.industry === industry) && (!location || jobLocation(j) === location),
  );
  const filtered = Boolean(industry || location);

  return (
    <section aria-labelledby="results" className="bg-sand">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* Plain GET form: works without JavaScript, and the URL can be shared. */}
        <form method="get" action="/jobs" className="grid gap-4 rounded-lg bg-cream p-5 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <SelectField label="Industry" name="industry" defaultValue={industry} optional hideOptionalLabel>
            <option value="">All industries</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </SelectField>
          <SelectField label="Location" name="location" defaultValue={location} optional hideOptionalLabel>
            <option value="">All locations</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </SelectField>
          <Button type="submit">Show jobs</Button>
        </form>

        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="results" className="text-2xl font-bold" aria-live="polite">
            {shown.length} open {shown.length === 1 ? "job" : "jobs"}
          </h2>
          {filtered && (
            <Link href="/jobs" className="inline-flex min-h-11 items-center font-semibold text-ink underline underline-offset-4 hover:text-action">
              Clear filters
            </Link>
          )}
        </div>

        {shown.length ? (
          <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((job) => (
              <li key={job.id}>
                <JobCard job={job} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-6 flex flex-col items-start gap-4 rounded-lg bg-cream p-6">
            <p className="text-lg font-semibold">
              {filtered ? "No jobs match those filters right now." : "No open jobs right now. New ones are added often."}
            </p>
            <p className="text-ink-soft">
              Tell a recruiter what you&apos;re looking for and we&apos;ll reach out when something fits.
            </p>
            <ButtonLink href={`tel:${site.phone.tel}`}>Call {site.phone.display}</ButtonLink>
          </div>
        )}
      </div>
    </section>
  );
}

function ListSkeleton() {
  return (
    <section aria-hidden="true" className="bg-sand">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 md:grid-cols-3 md:py-14">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-52 rounded-lg bg-cream" />
        ))}
      </div>
    </section>
  );
}
