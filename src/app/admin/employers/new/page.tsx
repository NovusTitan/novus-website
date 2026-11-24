import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/layout/Narrow";
import { requireStaff } from "@/lib/auth";
import { NoAccess } from "../../NoAccess";
import { EmployerForm } from "../EmployerForms";

export const metadata: Metadata = { title: "Add employer · Recruiter dashboard", robots: { index: false } };

export default function NewEmployerPage() {
  return (
    <section className="mx-auto max-w-xl px-4 py-12 md:py-16">
      <Link href="/admin/employers" className="inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4 hover:text-ink">
        ← All employers
      </Link>
      <h1 className="mt-3 text-3xl font-bold md:text-4xl">Add employer</h1>
      <div className="mt-8">
        <Suspense fallback={<FormSkeleton />}>
          <NewEmployer />
        </Suspense>
      </div>
    </section>
  );
}

async function NewEmployer() {
  if (!(await requireStaff("/admin/employers/new"))) return <NoAccess />;
  return <EmployerForm />;
}
