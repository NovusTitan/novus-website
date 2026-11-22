import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LogInForm } from "@/components/auth/AuthForms";
import { FormSkeleton, Narrow } from "@/components/layout/Narrow";
import { Alert } from "@/components/ui/Alert";
import { getUser } from "@/lib/auth";
import { safeNext } from "@/lib/jobs";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage({ searchParams }: PageProps<"/login">) {
  return (
    <Narrow title="Log in" intro="Welcome back. Log in to apply for jobs and check on your applications.">
      <Suspense fallback={<FormSkeleton />}>
        <LoginContent searchParams={searchParams} />
      </Suspense>
    </Narrow>
  );
}

async function LoginContent({ searchParams }: Pick<PageProps<"/login">, "searchParams">) {
  const sp = await searchParams;
  const next = safeNext(sp.next);
  if (await getUser()) redirect(next);

  return (
    <>
      {sp.error === "link" && (
        <div className="mb-6">
          <Alert title="That link didn't work">
            It may have expired or already been used. Log in below, or reset your password to get a new link.
          </Alert>
        </div>
      )}
      <LogInForm next={next} />
      <p className="mt-6">
        New to Novus?{" "}
        <Link href={`/signup?next=${encodeURIComponent(next)}`} className="inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4 hover:text-ink">
          Create an account
        </Link>
      </p>
    </>
  );
}
