import type { Metadata } from "next";
import { Suspense } from "react";
import { NewPasswordForm } from "@/components/auth/AuthForms";
import { FormSkeleton, Narrow } from "@/components/layout/Narrow";
import { requireProfile } from "@/lib/auth";

export const metadata: Metadata = { title: "Set a new password" };

export default function ResetPasswordPage() {
  return (
    <Narrow title="Set a new password">
      <Suspense fallback={<FormSkeleton />}>
        <ResetContent />
      </Suspense>
    </Narrow>
  );
}

async function ResetContent() {
  // The reset link logs the user in; without a session, send them to log in.
  await requireProfile("/account/reset-password");
  return <NewPasswordForm />;
}
