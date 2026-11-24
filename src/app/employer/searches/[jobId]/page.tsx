import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/layout/Narrow";
import { Tag } from "@/components/ui/Tag";
import { requireProfile } from "@/lib/auth";
import { jobLocation } from "@/lib/jobs";
import { site } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Candidates · Employer portal", robots: { index: false } };

export default function SearchPage({ params }: PageProps<"/employer/searches/[jobId]">) {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <Link href="/employer" className="inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4 hover:text-ink">
        ← Your searches
      </Link>
      <Suspense fallback={<FormSkeleton />}>
        <Candidates params={params} />
      </Suspense>
    </section>
  );
}

async function Candidates({ params }: Pick<PageProps<"/employer/searches/[jobId]">, "params">) {
  const { jobId } = await params;
  await requireProfile(`/employer/searches/${jobId}`);
  if (!/^[0-9a-f-]{36}$/i.test(jobId)) notFound();

  const supabase = await createClient();
  // Both functions only return this employer's data, with names and contact
  // details blank until Novus releases a candidate (enforced in the database).
  const [{ data: searches }, { data: candidates }] = await Promise.all([
    supabase.rpc("employer_searches"),
    supabase.rpc("employer_candidates", { p_job_id: jobId }),
  ]);
  const search = searches?.find((s) => s.job_id === jobId);
  if (!search) notFound();

  return (
    <>
      <h1 className="mt-3 text-3xl font-bold md:text-4xl">{search.title}</h1>
      <p className="mt-1 text-ink-soft">
        {jobLocation(search)} · {search.industry}
      </p>
      <p className="mt-6 max-w-2xl rounded-md bg-sand p-4">
        These are the candidates Novus recommends. Names and contact details appear once your recruiter introduces
        you. Want to meet someone? Call {site.phone.display}.
      </p>

      {!candidates?.length ? (
        <p className="mt-8 rounded-lg border-2 border-dashed border-olive p-6">
          Your recruiter is still screening candidates. They&apos;ll show up here as soon as they&apos;re shortlisted.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4">
          {candidates.map((c) => (
            <li key={c.shortlist_id} className="grid gap-3 rounded-lg border border-chip bg-cream p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-bold">{c.full_name ?? c.label}</h2>
                <Tag>{c.released_at ? "Introduced" : "Anonymous"}</Tag>
              </div>
              <p className="text-ink-soft">
                {[c.trade, c.years_experience != null ? `${c.years_experience} ${c.years_experience === 1 ? "year" : "years"} experience` : null]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {c.summary && <p>{c.summary}</p>}
              {c.released_at ? (
                <div className="flex flex-col gap-x-6 border-t border-chip pt-3 text-sm sm:flex-row sm:flex-wrap">
                  {c.phone && (
                    <a href={`tel:${c.phone}`} className="inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4">
                      {c.phone}
                    </a>
                  )}
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4">
                      {c.email}
                    </a>
                  )}
                  {c.has_resume && (
                    <a
                      href={`/employer/resume/${c.shortlist_id}`}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4"
                    >
                      Open resume<span className="sr-only"> for {c.full_name}</span>
                    </a>
                  )}
                </div>
              ) : (
                <p className="border-t border-chip pt-3 text-sm text-ink-soft">Name and contact details shared after introduction.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
