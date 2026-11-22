import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { FormSkeleton } from "@/components/layout/Narrow";
import { Alert, StepProgress } from "@/components/ui/Alert";
import { ButtonLink } from "@/components/ui/Button";
import { getProfile } from "@/lib/auth";
import { getOpenJob } from "@/lib/data/jobs";
import { jobLocation } from "@/lib/jobs";
import { createClient } from "@/lib/supabase/server";
import { ApplyForm } from "./ApplyForm";

export const metadata: Metadata = { title: "Apply", robots: { index: false } };

export default function ApplyPage({ params }: PageProps<"/jobs/[slug]/apply">) {
  return (
    <section className="mx-auto max-w-xl px-4 py-10 md:py-16">
      <Suspense fallback={<FormSkeleton />}>
        <ApplyContent params={params} />
      </Suspense>
    </section>
  );
}

async function ApplyContent({ params }: Pick<PageProps<"/jobs/[slug]/apply">, "params">) {
  const { slug } = await params;
  const job = await getOpenJob(slug);
  if (!job) notFound();

  const profile = await getProfile();
  const heading = (
    <>
      <Link href={`/jobs/${job.slug}`} className="inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4 hover:text-ink">
        ← Back to job
      </Link>
      <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">Apply: {job.title}</h1>
      <p className="mt-2 mb-8 text-lg text-ink-soft">
        {jobLocation(job)} · {job.employment_type}
      </p>
    </>
  );

  // Step 1: create an account (or log in).
  if (!profile) {
    return (
      <>
        {heading}
        <StepProgress step={1} total={2} label="Create your account" />
        <AuthPanel next={`/jobs/${job.slug}/apply`} />
      </>
    );
  }

  // Already applied? Don't ask twice.
  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("job_id", job.id)
    .eq("candidate_id", profile.id)
    .maybeSingle();

  if (existing) {
    return (
      <>
        {heading}
        <div className="grid gap-6">
          <Alert tone="success" title="You already applied to this job">
            You can check where it stands on your account page.
          </Alert>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/account">See my applications</ButtonLink>
            <ButtonLink href="/jobs" variant="outline">
              Browse more jobs
            </ButtonLink>
          </div>
        </div>
      </>
    );
  }

  // Step 2: the application itself.
  return (
    <>
      {heading}
      <ApplyForm jobId={job.id} jobTitle={job.title} userId={profile.id} defaultTrade={profile.trade ?? job.industry} />
    </>
  );
}
