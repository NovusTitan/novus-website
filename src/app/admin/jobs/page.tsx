import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/layout/Narrow";
import { ButtonLink } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { requireStaff } from "@/lib/auth";
import { JOB_STATUS_LABELS, jobLocation } from "@/lib/jobs";
import { createClient } from "@/lib/supabase/server";
import { NoAccess } from "../NoAccess";

export const metadata: Metadata = { title: "Jobs · Recruiter dashboard", robots: { index: false } };

export default function AdminJobsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <Suspense fallback={<FormSkeleton />}>
        <AdminJobs />
      </Suspense>
    </section>
  );
}

async function AdminJobs() {
  const staff = await requireStaff("/admin/jobs");
  if (!staff) return <NoAccess />;

  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from("jobs")
    .select("id, slug, title, city, state, status, updated_at, applications(count)")
    .order("updated_at", { ascending: false });

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-ink-soft">Recruiter dashboard</p>
          <h1 className="mt-1 text-3xl font-bold md:text-4xl">Jobs</h1>
        </div>
        <ButtonLink href="/admin/jobs/new">Post a job</ButtonLink>
      </div>

      {!jobs?.length ? (
        <p className="mt-8 rounded-lg bg-sand p-6">No jobs yet. Post your first one.</p>
      ) : (
        <ul className="mt-8 grid gap-3">
          {jobs.map((job) => {
            const count = job.applications[0]?.count ?? 0;
            return (
              <li key={job.id}>
                <Link
                  href={`/admin/jobs/${job.id}`}
                  className="flex flex-col gap-2 rounded-lg border border-chip bg-cream p-5 transition-colors duration-150 hover:border-action sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-lg font-semibold">{job.title}</p>
                    <p className="text-sm text-ink-soft">
                      {jobLocation(job)} · Updated {new Date(job.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold">
                      {count} {count === 1 ? "applicant" : "applicants"}
                    </span>
                    <Tag>{JOB_STATUS_LABELS[job.status]}</Tag>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
