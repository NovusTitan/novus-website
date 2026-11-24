import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/layout/Narrow";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { requireStaff } from "@/lib/auth";
import { JOB_STATUS_LABELS, jobLocation } from "@/lib/jobs";
import { createClient } from "@/lib/supabase/server";
import { deleteInvite, removeMember } from "../../actions";
import { NoAccess } from "../../NoAccess";
import { CopyInviteLink, EmployerForm, InviteForm } from "../EmployerForms";

export const metadata: Metadata = { title: "Employer · Recruiter dashboard", robots: { index: false } };

export default function EmployerAdminPage({ params }: PageProps<"/admin/employers/[id]">) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Link href="/admin/employers" className="inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4 hover:text-ink">
        ← All employers
      </Link>
      <Suspense fallback={<FormSkeleton />}>
        <Employer params={params} />
      </Suspense>
    </section>
  );
}

// Runs at request time (inside Suspense, after the session is read), so reading the clock is fine.
const isPast = (iso: string) => new Date(iso).getTime() < Date.now();

const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

async function Employer({ params }: Pick<PageProps<"/admin/employers/[id]">, "params">) {
  const { id } = await params;
  if (!(await requireStaff(`/admin/employers/${id}`))) return <NoAccess />;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await createClient();
  const [{ data: employer }, { data: members }, { data: invites }, { data: jobs }] = await Promise.all([
    supabase.from("employers").select("id, name, notes").eq("id", id).maybeSingle(),
    supabase.from("employer_members").select("user_id, created_at, profiles(full_name, email)").eq("employer_id", id),
    supabase.from("employer_invites").select("id, email, token, accepted_at, expires_at").eq("employer_id", id).is("accepted_at", null).order("created_at", { ascending: false }),
    supabase.from("job_internal").select("jobs(id, title, city, state, status)").eq("employer_id", id),
  ]);
  if (!employer) notFound();

  return (
    <>
      <h1 className="mt-3 text-3xl font-bold md:text-4xl">{employer.name}</h1>

      <section aria-labelledby="searches" className="mt-10">
        <h2 id="searches" className="text-2xl font-bold">Searches</h2>
        <p className="mt-1 text-sm text-ink-soft">
          To add one, open a job and choose this employer under &ldquo;Internal&rdquo;.
        </p>
        {!jobs?.length ? (
          <p className="mt-4 rounded-lg bg-sand p-5 text-ink-soft">No jobs linked yet.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {jobs.map(({ jobs: j }) =>
              j ? (
                <li key={j.id}>
                  <Link href={`/admin/jobs/${j.id}`} className="flex items-center justify-between gap-3 rounded-lg border border-chip bg-cream p-4 hover:border-action">
                    <span>
                      <span className="font-semibold">{j.title}</span>
                      <span className="block text-sm text-ink-soft">{jobLocation(j)}</span>
                    </span>
                    <Tag>{JOB_STATUS_LABELS[j.status]}</Tag>
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        )}
      </section>

      <section aria-labelledby="users" className="mt-12">
        <h2 id="users" className="text-2xl font-bold">Employer users</h2>
        <p className="mt-1 text-sm text-ink-soft">
          People at {employer.name} who can log in to the employer portal. They see shortlisted candidates for this
          company&apos;s jobs, with no names or contact details until you release them.
        </p>
        {!!members?.length && (
          <ul className="mt-4 grid gap-3">
            {members.map((m) => (
              <li key={m.user_id} className="flex flex-col gap-2 rounded-lg border border-chip bg-cream p-4 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  <span className="font-semibold">{m.profiles?.full_name || m.profiles?.email}</span>
                  <span className="block text-sm text-ink-soft">{m.profiles?.email} · joined {fmt(m.created_at)}</span>
                </span>
                <form action={removeMember}>
                  <input type="hidden" name="employer_id" value={employer.id} />
                  <input type="hidden" name="user_id" value={m.user_id} />
                  <Button type="submit" variant="outline" className="min-h-11 px-4">
                    Remove<span className="sr-only"> {m.profiles?.email}</span>
                  </Button>
                </form>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 rounded-lg bg-sand p-5">
          <InviteForm employerId={employer.id} />
          {!!invites?.length && (
            <>
              <h3 className="mt-6 font-bold">Pending invites</h3>
              <p className="text-sm text-ink-soft">Copy the link and send it to them by email. Links expire after 14 days.</p>
              <ul className="mt-3 grid gap-2">
                {invites.map((i) => {
                  const expired = isPast(i.expires_at);
                  return (
                    <li key={i.id} className="flex flex-col gap-1 rounded-md bg-cream p-3 sm:flex-row sm:items-center sm:justify-between">
                      <span>
                        <span className="font-semibold">{i.email}</span>
                        <span className="block text-sm text-ink-soft">Expires {fmt(i.expires_at)}{expired ? " (expired)" : ""}</span>
                      </span>
                      <span className="flex items-center gap-4">
                        <CopyInviteLink token={i.token} />
                        <form action={deleteInvite}>
                          <input type="hidden" name="id" value={i.id} />
                          <button type="submit" className="inline-flex min-h-11 items-center font-semibold text-ink underline underline-offset-4 hover:text-action">
                            Cancel<span className="sr-only"> invite for {i.email}</span>
                          </button>
                        </form>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </section>

      <section aria-labelledby="details" className="mt-12 border-t border-chip pt-10">
        <h2 id="details" className="mb-6 text-2xl font-bold">Company details</h2>
        <EmployerForm employer={employer} />
      </section>
    </>
  );
}
