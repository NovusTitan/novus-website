"use client";

import { startTransition, useActionState, useState } from "react";
import { Alert, StepProgress } from "@/components/ui/Alert";
import { Button, ButtonLink } from "@/components/ui/Button";
import { SelectField, TextArea } from "@/components/ui/Field";
import { INDUSTRIES, type Industry } from "@/lib/jobs";
import { createClient } from "@/lib/supabase/client";
import { submitApplication, type ApplyState } from "./actions";

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

export function ApplyForm({
  jobId,
  jobTitle,
  userId,
  defaultTrade,
}: {
  jobId: string;
  jobTitle: string;
  userId: string;
  defaultTrade: Industry;
}) {
  const [fileError, setFileError] = useState<string>();
  const [uploading, setUploading] = useState(false);

  // Upload the resume straight to private storage first, then send the application.
  const [state, action, pending] = useActionState(async (prev: ApplyState, fd: FormData) => {
    setFileError(undefined);
    const file = fd.get("resume");
    fd.delete("resume");
    if (file instanceof File && file.size > 0) {
      const ext = TYPES[file.type];
      if (!ext) {
        setFileError("Upload a PDF or Word file.");
        return prev;
      }
      if (file.size > MAX_BYTES) {
        setFileError("That file is over 5 MB. Try a smaller PDF.");
        return prev;
      }
      setUploading(true);
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await createClient().storage.from("resumes").upload(path, file, { contentType: file.type });
      setUploading(false);
      if (error) {
        setFileError("We couldn't upload your resume. Try again, or apply without it.");
        return prev;
      }
      fd.set("resume_path", path);
    }
    return submitApplication(prev, fd);
  }, {});

  if (state.done) {
    return (
      <div className="grid gap-6">
        <Alert tone="success" title="Application sent">
          Thanks for applying to {jobTitle}. A Novus recruiter will review it and reach out by phone or email.
        </Alert>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href="/account">See my applications</ButtonLink>
          <ButtonLink href="/jobs" variant="outline">
            Browse more jobs
          </ButtonLink>
        </div>
      </div>
    );
  }

  const busy = pending || uploading;
  return (
    <>
      <StepProgress step={2} total={2} label="Send your application" />
      <form
        className="grid gap-6"
        noValidate
        // Submit manually so the chosen file and note survive an error.
        onSubmit={(ev) => {
          ev.preventDefault();
          const fd = new FormData(ev.currentTarget);
          startTransition(() => action(fd));
        }}
      >
        <input type="hidden" name="job_id" value={jobId} />
        {state.error && <Alert>{state.error}</Alert>}
        <SelectField label="Your trade" name="trade" defaultValue={defaultTrade} error={state.fieldErrors?.trade}>
          {INDUSTRIES.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </SelectField>
        <ResumeField error={fileError} />
        <TextArea
          label="Anything we should know?"
          name="note"
          optional
          hint="Certifications, when you can start, or the best time to call."
          maxLength={2000}
          error={state.fieldErrors?.note}
        />
        <div>
          <Button type="submit" loading={busy} className="w-full sm:w-auto">
            {uploading ? "Uploading resume…" : pending ? "Sending…" : "Send application"}
          </Button>
        </div>
      </form>
    </>
  );
}

function ResumeField({ error }: { error?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="resume" className="font-semibold">
        Resume <span className="font-normal text-ink-soft">(optional)</span>
      </label>
      <p id="resume-hint" className="text-sm text-ink-soft">
        PDF or Word, up to 5 MB. No resume? No problem, a recruiter will call you.
      </p>
      <input
        id="resume"
        name="resume"
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        aria-describedby={error ? "resume-hint resume-error" : "resume-hint"}
        aria-invalid={error ? true : undefined}
        className="block w-full rounded-md border-2 border-dashed border-ink-soft bg-cream p-3 text-base file:mr-4 file:min-h-11 file:cursor-pointer file:rounded-md file:border-0 file:bg-chip file:px-4 file:font-semibold file:text-deep-olive"
      />
      {error && (
        <p id="resume-error" className="text-sm font-semibold text-action">
          {error}
        </p>
      )}
    </div>
  );
}
