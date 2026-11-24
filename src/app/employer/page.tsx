import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/layout/Narrow";
import { ButtonLink } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { requireProfile } from "@/lib/auth";
import { JOB_STATUS_LABELS, jobLocation } from "@/lib/jobs";
import { site } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Employer portal", robots: { index: false } };

export default function EmployerPortalPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <p className="text-sm font-medium uppercase tracking-widest text-ink-soft">Employer portal</p>
      <h1 className="mt-1 text-3xl font-bold md:text-4xl">Your searches</h1>
      <div className="mt-8">
        <Suspense fallback={<FormSkeleton />}>
          <Searches />
        </Suspense>
      </div>
    </section>
  );
}

async function Searches() {
  await requireProfile("/employer");
  const supabase = await createClient();
  const { data: searches } = await supabase.rpc("employer_searches");

  if (!searches?.length) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-lg bg-sand p-6">
        <p className="text-lg font-semibold">No searches to show yet.</p>
        <p className="text-ink-soft">
          If Novus invited you, open the invite link from your email. Want to open a new search? We&apos;d love to help.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/employers#open-a-search">Open a search</ButtonLink>
          <ButtonLink href={`tel:${site.phone.tel}`} variant="outline">
            Call {site.phone.display}
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <>
      <p className="text-ink-soft">{searches[0].employer_name}</p>
      <ul className="mt-4 grid gap-3">
        {searches.map((s) => (
          <li key={s.job_id}>
            <Link
              href={`/employer/searches/${s.job_id}`}
              className="flex flex-col gap-2 rounded-lg border border-chip bg-cream p-5 transition-colors duration-150 hover:border-action sm:flex-row sm:items-center sm:justify-between"
            >
              <span>
                <span className="text-lg font-semibold">{s.title}</span>
                <span className="block text-sm text-ink-soft">
                  {jobLocation(s)} · {s.industry}
                </span>
              </span>
              <span className="flex items-center gap-3 text-sm">
                <span className="font-semibold">
                  {s.shortlisted} shortlisted{s.released ? ` · ${s.released} introduced` : ""}
                </span>
                <Tag>{JOB_STATUS_LABELS[s.job_status]}</Tag>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
