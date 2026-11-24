import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { FormSkeleton, Narrow } from "@/components/layout/Narrow";
import { Alert } from "@/components/ui/Alert";
import { ButtonLink } from "@/components/ui/Button";
import { getProfile } from "@/lib/auth";
import { site } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Join your employer portal", robots: { index: false } };

export default function JoinPage({ searchParams }: PageProps<"/employer/join">) {
  return (
    <Narrow title="Your Novus employer portal" intro="See the candidates Novus has shortlisted for your open roles.">
      <Suspense fallback={<FormSkeleton />}>
        <Join searchParams={searchParams} />
      </Suspense>
    </Narrow>
  );
}

const MESSAGES: Record<string, string> = {
  invalid: "This invite link isn't valid. Ask your Novus recruiter for a new one.",
  used: "This invite link has already been used. Ask your Novus recruiter for a new one.",
  expired: "This invite link has expired. Ask your Novus recruiter for a new one.",
};

async function Join({ searchParams }: Pick<PageProps<"/employer/join">, "searchParams">) {
  const { token } = await searchParams;
  const valid = typeof token === "string" && /^[0-9a-f-]{36}$/i.test(token);
  if (!valid) return <Alert>{MESSAGES.invalid}</Alert>;

  const profile = await getProfile();
  if (!profile) {
    return (
      <>
        <p className="mb-6">
          Create your account or log in <strong>with the email address your invite was sent to</strong>.
        </p>
        <AuthPanel next={`/employer/join?token=${token}`} />
      </>
    );
  }

  const supabase = await createClient();
  const { data: result } = await supabase.rpc("accept_employer_invite", { p_token: token });
  if (result === "ok") redirect("/employer");

  if (result === "wrong_email") {
    return (
      <Alert title="This invite is for a different email">
        You&apos;re logged in as {profile.email}. Log out, then open the link again and use the email the invite was sent
        to. Questions? Call {site.phone.display}.
      </Alert>
    );
  }
  return (
    <div className="grid gap-6">
      <Alert>{MESSAGES[result ?? "invalid"] ?? MESSAGES.invalid}</Alert>
      <ButtonLink href={`tel:${site.phone.tel}`}>Call {site.phone.display}</ButtonLink>
    </div>
  );
}
