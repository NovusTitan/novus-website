import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/layout/Narrow";
import { ButtonLink } from "@/components/ui/Button";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "../AdminNav";
import { NoAccess } from "../NoAccess";

export const metadata: Metadata = { title: "Employers · Recruiter dashboard", robots: { index: false } };

export default function EmployersAdminPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <Suspense fallback={<FormSkeleton />}>
        <Employers />
      </Suspense>
    </section>
  );
}

async function Employers() {
  if (!(await requireStaff("/admin/employers"))) return <NoAccess />;
  const supabase = await createClient();
  const { data: employers } = await supabase
    .from("employers")
    .select("id, name, employer_members(count), job_internal(count)")
    .order("name");

  return (
    <>
      <AdminNav current="/admin/employers" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold md:text-4xl">Employers</h1>
          <p className="mt-2 text-ink-soft">Client companies with an active Novus Flex agreement.</p>
        </div>
        <ButtonLink href="/admin/employers/new">Add employer</ButtonLink>
      </div>
      {!employers?.length ? (
        <p className="mt-8 rounded-lg bg-sand p-6">No employers yet.</p>
      ) : (
        <ul className="mt-8 grid gap-3">
          {employers.map((e) => {
            const users = e.employer_members[0]?.count ?? 0;
            const jobs = e.job_internal[0]?.count ?? 0;
            return (
              <li key={e.id}>
                <Link
                  href={`/admin/employers/${e.id}`}
                  className="flex flex-col gap-1 rounded-lg border border-chip bg-cream p-5 transition-colors duration-150 hover:border-action sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-lg font-semibold">{e.name}</span>
                  <span className="text-sm text-ink-soft">
                    {jobs} {jobs === 1 ? "job" : "jobs"} · {users} {users === 1 ? "user" : "users"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
