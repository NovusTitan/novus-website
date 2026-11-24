"use client";

import { startTransition, useActionState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextArea, TextField } from "@/components/ui/Field";
import {
  addToShortlist,
  releaseCandidate,
  removeFromShortlist,
  updateShortlist,
  type SimpleState,
} from "@/app/admin/actions";

type Entry = { id: string; years_experience: number | null; summary: string; released_at: string | null };

const SUMMARY_HINT =
  "The employer sees this before release. Don't include the candidate's name, employer names or contact details.";

// Shortlist + release controls for one applicant (staff only).
export function ShortlistPanel({
  applicationId,
  employerName,
  entry,
}: {
  applicationId: string;
  employerName: string;
  entry: Entry | null;
}) {
  const [state, action, pending] = useActionState<SimpleState, FormData>(entry ? updateShortlist : addToShortlist, {});
  const e = state.fieldErrors ?? {};

  const details = (
    <form
      className="grid gap-4"
      noValidate
      onSubmit={(ev) => {
        ev.preventDefault();
        const fd = new FormData(ev.currentTarget);
        startTransition(() => action(fd));
      }}
    >
      {entry ? <input type="hidden" name="id" value={entry.id} /> : <input type="hidden" name="application_id" value={applicationId} />}
      {state.error && <Alert>{state.error}</Alert>}
      <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
        <TextField
          label="Years"
          name="years_experience"
          inputMode="numeric"
          defaultValue={entry?.years_experience?.toString() ?? ""}
          error={e.years_experience}
          optional
        />
        <TextArea
          label="Summary for the employer"
          name="summary"
          rows={2}
          maxLength={500}
          defaultValue={entry?.summary ?? ""}
          error={e.summary}
          hint={SUMMARY_HINT}
          optional
        />
      </div>
      <div>
        <Button type="submit" variant={entry ? "outline" : "solid"} loading={pending} className="min-h-11 px-4">
          {entry ? "Save summary" : `Add to ${employerName}'s shortlist`}
        </Button>
      </div>
    </form>
  );

  if (!entry) {
    return (
      <details className="rounded-md border border-chip p-4">
        <summary className="min-h-11 cursor-pointer content-center font-semibold">Shortlist for {employerName}</summary>
        <div className="mt-4">{details}</div>
      </details>
    );
  }

  return (
    <div className="grid gap-4 rounded-md border-2 border-olive p-4">
      <p className="font-semibold">
        {entry.released_at
          ? `Released to ${employerName} on ${new Date(entry.released_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "America/New_York" })}. They can see this person's name, contact details and resume.`
          : `On ${employerName}'s shortlist. Anonymous: they see the trade, years and summary only.`}
      </p>
      {details}
      <div className="flex flex-col gap-3 border-t border-chip pt-4 sm:flex-row sm:items-center">
        {!entry.released_at && (
          <form
            action={releaseCandidate}
            onSubmit={(ev) => {
              if (!window.confirm(`Release this candidate's name, phone, email and resume to ${employerName}? This can't be undone.`)) {
                ev.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={entry.id} />
            <Button type="submit" className="min-h-11 px-4">
              Release to {employerName}
            </Button>
          </form>
        )}
        <form action={removeFromShortlist}>
          <input type="hidden" name="id" value={entry.id} />
          <button type="submit" className="inline-flex min-h-11 items-center font-semibold text-ink underline underline-offset-4 hover:text-action">
            Remove from shortlist
          </button>
        </form>
      </div>
    </div>
  );
}
