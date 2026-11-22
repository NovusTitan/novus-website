import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SignUpForm } from "@/components/auth/AuthForms";
import { FormSkeleton, Narrow } from "@/components/layout/Narrow";
import { getUser } from "@/lib/auth";
import { safeNext } from "@/lib/jobs";

export const metadata: Metadata = { title: "Create an account" };

export default function SignUpPage({ searchParams }: PageProps<"/signup">) {
  return (
    <Narrow title="Create an account" intro="One account lets you apply to any Novus job and see where your applications stand.">
      <Suspense fallback={<FormSkeleton />}>
        <SignUpContent searchParams={searchParams} />
      </Suspense>
    </Narrow>
  );
}

async function SignUpContent({ searchParams }: Pick<PageProps<"/signup">, "searchParams">) {
  const next = safeNext((await searchParams).next);
  if (await getUser()) redirect(next);
  return (
    <>
      <SignUpForm next={next} />
      <p className="mt-6">
        Already have an account?{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4 hover:text-ink">
          Log in
        </Link>
      </p>
    </>
  );
}
