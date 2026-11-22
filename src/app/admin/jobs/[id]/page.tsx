import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/layout/Narrow";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { requireStaff } from "@/lib/auth";
import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS, JOB_STATUS_LABELS } from "@/lib/jobs";
import { createClient } from "@/lib/supabase/server";
import { NoAccess } from "../../NoAccess";
import { updateApplicationStatus } from "../actions";
import { JobForm } from "../JobForm";

export const metadata: Metadata = { title: "Edit job · Recruiter dashboard", robots: { index: false } };

export default function EditJobPage(props: PageProps<"/admin/jobs/[id]">) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Link href="/admin/jobs" className="inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4 hover:text-ink">
        ← All jobs
      </Link>
      <Suspense fallback={<FormSkeleton />}>
        <EditJob {...props} />
      </Suspense>
    </section>
  );
}

async function EditJob({ params, searchParams }: PageProps<"/admin/jobs/[id]">) {
  const { id } = await params;
  if (!(await requireStaff(`/admin/jobs/${id}`))) return <NoAccess />;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await createClient();
  const [{ data: job }, { data: internal }, { data: applicants }] = await Promise.all([
    supabase.from("jobs").select("*").eq("id", id).maybeSingle(),
    supabase.from("job_internal").select("client_name, notes").eq("job_id", id).maybeSingle(),
    supabase
      .from("applications")
      .select("id, status, trade, note, resume_path, created_at, profiles(full_name, email, phone)")
      .eq("job_id", id)
      .order("created_at", { ascending: false }),
  ]);
  if (!job) notFound();
  const { created } = await searchParams;

  return (
    <>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold md:text-4xl">{job.title}</h1>
        <Tag>{JOB_STATUS_LABELS[job.status]}</Tag>
      </div>
      {job.status === "open" && (
        <Link href={`/jobs/${job.slug}`} className="mt-2 inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4 hover:text-ink">
          View on the website
        </Link>
      )}
      {created === "1" && (
        <div className="mt-6">
          <Alert tone="success" title="Job created.">
            {job.status === "open" ? "It's live on the website." : "It's saved as a draft. Set it to Open when you're ready."}
          </Alert>
        </div>
      )}

      <section aria-labelledby="applicants" className="mt-10">
        <h2 id="applicants" className="text-2xl font-bold">
          Applicants ({applicants?.length ?? 0})
        </h2>
        {!applicants?.length ? (
          <p className="mt-4 rounded-lg bg-sand p-5 text-ink-soft">No applications yet.</p>
        ) : (
          <ul className="mt-4 grid gap-4">
            {applicants.map((a) => (
              <li key={a.id} className="grid gap-4 rounded-lg border border-chip bg-cream p-5">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold">{a.profiles?.full_name || "Unnamed"}</p>
                    <p className="text-sm text-ink-soft">
                      {a.trade ?? "Trade not given"} · Applied{" "}
                      {new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <div className="flex flex-col text-sm sm:items-end">
                    {a.profiles?.phone && (
                      <a href={`tel:${a.profiles.phone}`} className="inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4">
                        {a.profiles.phone}
                      </a>
                    )}
                    {a.profiles?.email && (
                      <a href={`mailto:${a.profiles.email}`} className="inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4">
                        {a.profiles.email}
                      </a>
                    )}
                  </div>
                </div>
                {a.note && <p className="whitespace-pre-line rounded-md bg-sand p-3 text-sm">{a.note}</p>}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  {a.resume_path ? (
                    <a
                      href={`/admin/resume/${a.id}`}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4"
                    >
                      Open resume<span className="sr-only"> for {a.profiles?.full_name}</span>
                    </a>
                  ) : (
                    <p className="text-sm text-ink-soft">No resume uploaded</p>
                  )}
                  {/* key: remount after a change so the dropdown shows the saved status */}
                  <form key={a.status} action={updateApplicationStatus} className="flex items-end gap-2">
                    <input type="hidden" name="id" value={a.id} />
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor={`status-${a.id}`} className="text-sm font-semibold">
                        Status
                      </label>
                      <select
                        id={`status-${a.id}`}
                        name="status"
                        defaultValue={a.status}
                        className="min-h-11 rounded-md border-2 border-ink-soft bg-cream px-3"
                      >
                        {APPLICATION_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {APPLICATION_STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button type="submit" variant="outline" className="min-h-11 px-4">
                      Update<span className="sr-only"> status for {a.profiles?.full_name}</span>
                    </Button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="edit" className="mt-12 border-t border-chip pt-10">
        <h2 id="edit" className="mb-6 text-2xl font-bold">Edit job</h2>
        <JobForm job={{ ...job, client_name: internal?.client_name ?? "", notes: internal?.notes ?? "" }} />
      </section>
    </>
  );
}
