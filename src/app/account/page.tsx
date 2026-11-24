import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { logOut } from "@/app/actions/auth";
import { FormSkeleton } from "@/components/layout/Narrow";
import { Alert } from "@/components/ui/Alert";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { isEmployer, isStaff, requireProfile } from "@/lib/auth";
import { APPLICATION_STATUS_LABELS, jobLocation } from "@/lib/jobs";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My account", robots: { index: false } };

export default function AccountPage({ searchParams }: PageProps<"/account">) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="text-3xl font-bold md:text-4xl">My account</h1>
      <div className="mt-8">
        <Suspense fallback={<FormSkeleton />}>
          <AccountContent searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}

async function AccountContent({ searchParams }: Pick<PageProps<"/account">, "searchParams">) {
  const profile = await requireProfile("/account");
  const { password } = await searchParams;

  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("applications")
    .select("id, status, created_at, jobs(title, slug, city, state, status)")
    .eq("candidate_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <div className="grid gap-10">
      {password === "updated" && <Alert tone="success" title="Your password was updated." />}

      <div className="flex flex-col gap-4 rounded-lg bg-sand p-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xl font-bold">{profile.full_name || "Your profile"}</p>
          <p className="mt-1 text-ink-soft">{profile.email}</p>
          {profile.phone && <p className="text-ink-soft">{profile.phone}</p>}
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          {isStaff(profile) && <ButtonLink href="/admin/jobs">Recruiter dashboard</ButtonLink>}
          {isEmployer(profile) && <ButtonLink href="/employer">Employer portal</ButtonLink>}
          <form action={logOut}>
            <Button type="submit" variant="outline" className="w-full sm:w-auto">
              Log out
            </Button>
          </form>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold">My applications</h2>
        {!applications?.length ? (
          <div className="mt-4 flex flex-col items-start gap-4 rounded-lg border-2 border-dashed border-olive p-6">
            <p>You haven&apos;t applied to any jobs yet.</p>
            <ButtonLink href="/jobs">See open jobs</ButtonLink>
          </div>
        ) : (
          <ul className="mt-4 grid gap-3">
            {applications.map((a) => (
              <li key={a.id} className="flex flex-col gap-2 rounded-lg border border-chip bg-cream p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {a.jobs?.status === "open" ? (
                    <Link href={`/jobs/${a.jobs.slug}`} className="text-lg font-semibold underline-offset-4 hover:text-action hover:underline">
                      {a.jobs.title}
                    </Link>
                  ) : (
                    <p className="text-lg font-semibold">{a.jobs?.title ?? "Job"}</p>
                  )}
                  <p className="text-sm text-ink-soft">
                    {a.jobs ? `${jobLocation(a.jobs)} · ` : ""}Applied{" "}
                    {new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {a.jobs?.status === "closed" ? " · Job closed" : ""}
                  </p>
                </div>
                <Tag>{APPLICATION_STATUS_LABELS[a.status]}</Tag>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
