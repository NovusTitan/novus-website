import { ButtonLink } from "@/components/ui/Button";

export function NoAccess() {
  return (
    <div className="flex flex-col items-start gap-4 rounded-lg bg-sand p-6">
      <p className="text-lg font-semibold">This page is for Novus staff.</p>
      <p className="text-ink-soft">If you work at Novus, ask an admin to give your account recruiter access.</p>
      <ButtonLink href="/account">Go to my account</ButtonLink>
    </div>
  );
}
