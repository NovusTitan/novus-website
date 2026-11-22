import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { getOpenJob } from "@/lib/data/jobs";
import { formatPay, jobLocation } from "@/lib/jobs";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/jobs/[slug]">): Promise<Metadata> {
  const job = await getOpenJob((await params).slug);
  if (!job) return { title: "Job not found" };
  return {
    title: `${job.title} in ${jobLocation(job)}`,
    description: job.summary || `${job.employment_type} ${job.industry} job in ${jobLocation(job)}. Apply through Novus Talent Company.`,
  };
}

export default function JobPage({ params }: PageProps<"/jobs/[slug]">) {
  return (
    <Suspense fallback={<JobSkeleton />}>
      <JobDetails params={params} />
    </Suspense>
  );
}

async function JobDetails({ params }: Pick<PageProps<"/jobs/[slug]">, "params">) {
  const job = await getOpenJob((await params).slug);
  if (!job) notFound();
  const pay = formatPay(job);
  const applyHref = `/jobs/${job.slug}/apply`;

  return (
    <article>
      <header className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 md:pb-14">
          <Link href="/jobs" className="inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4 hover:text-ink">
            ← All jobs
          </Link>
          <div className="mt-4">
            <Tag>{job.industry}</Tag>
          </div>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">{job.title}</h1>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-lg text-ink-soft">
            <li>{jobLocation(job)}</li>
            <li>{job.employment_type}</li>
            {pay && <li className="font-semibold text-ink">{pay}</li>}
          </ul>
          {job.summary && <p className="mt-5 max-w-2xl text-lg">{job.summary}</p>}
          <ButtonLink href={applyHref} className="mt-8 min-h-14 w-full px-8 text-lg sm:w-auto">
            Apply now
          </ButtonLink>
        </div>
      </header>

      <div className="bg-sand">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1fr_18rem] md:py-16">
          <div className="grid gap-10">
            {job.description && (
              <section aria-labelledby="about-role">
                <h2 id="about-role" className="text-2xl font-bold">About the job</h2>
                <p className="mt-4 whitespace-pre-line">{job.description}</p>
              </section>
            )}
            {job.requirements && (
              <section aria-labelledby="requirements">
                <h2 id="requirements" className="text-2xl font-bold">What you&apos;ll need</h2>
                <p className="mt-4 whitespace-pre-line">{job.requirements}</p>
              </section>
            )}
            <div>
              <ButtonLink href={applyHref} className="w-full sm:w-auto">
                Apply for this job
              </ButtonLink>
            </div>
          </div>

          <aside className="h-fit rounded-lg bg-cream p-6">
            <h2 className="text-lg font-bold">Questions about this job?</h2>
            <p className="mt-2 text-ink-soft">
              Talk to a Novus recruiter. The hiring company stays confidential until you&apos;re introduced.
            </p>
            <a
              href={`tel:${site.phone.tel}`}
              className="mt-4 inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4 hover:text-ink"
            >
              Call {site.phone.display}
            </a>
          </aside>
        </div>
      </div>
    </article>
  );
}

function JobSkeleton() {
  return (
    <div aria-hidden="true" className="mx-auto max-w-6xl px-4 py-12">
      <div className="h-6 w-24 rounded bg-chip" />
      <div className="mt-4 h-12 w-2/3 rounded bg-sand" />
      <div className="mt-4 h-6 w-1/3 rounded bg-sand" />
    </div>
  );
}
