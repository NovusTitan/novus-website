import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/layout/Narrow";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { NoAccess } from "../../NoAccess";
import { JobForm } from "../JobForm";

export const metadata: Metadata = { title: "Post a job · Recruiter dashboard", robots: { index: false } };

export default function NewJobPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <Link href="/admin/jobs" className="inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4 hover:text-ink">
        ← All jobs
      </Link>
      <h1 className="mt-3 text-3xl font-bold md:text-4xl">Post a job</h1>
      <p className="mt-2 text-ink-soft">Save it as a draft first if you&apos;re not ready to publish.</p>
      <div className="mt-8">
        <Suspense fallback={<FormSkeleton />}>
          <NewJob />
        </Suspense>
      </div>
    </section>
  );
}

async function NewJob() {
  if (!(await requireStaff("/admin/jobs/new"))) return <NoAccess />;
  const supabase = await createClient();
  const { data: employers } = await supabase.from("employers").select("id, name").order("name");
  return <JobForm employers={employers ?? []} />;
}
