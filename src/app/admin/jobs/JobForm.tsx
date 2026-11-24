"use client";

import { startTransition, useActionState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { SelectField, TextArea, TextField } from "@/components/ui/Field";
import { EMPLOYMENT_TYPES, INDUSTRIES, JOB_STATUS_LABELS, US_STATES, type Job, type JobStatus } from "@/lib/jobs";
import { saveJob, type JobFormState } from "./actions";

type Initial = Partial<Job> & { client_name?: string; notes?: string; employer_id?: string | null };
type EmployerOption = { id: string; name: string };

export function JobForm({ job, employers = [] }: { job?: Initial; employers?: EmployerOption[] }) {
  const [state, action, pending] = useActionState<JobFormState, FormData>(saveJob, {});
  const e = state.fieldErrors ?? {};
  const v = job ?? {};
  const str = (n: number | null | undefined) => (n == null ? "" : String(n));

  return (
    <form
      className="grid gap-8"
      noValidate
      // Submit manually so the form keeps what was typed if there's an error.
      onSubmit={(ev) => {
        ev.preventDefault();
        const fd = new FormData(ev.currentTarget);
        startTransition(() => action(fd));
      }}
    >
      {v.id && <input type="hidden" name="id" value={v.id} />}
      {state.error && <Alert>{state.error}</Alert>}
      {state.saved && !pending && <Alert tone="success" title="Saved." />}

      <fieldset className="grid gap-5">
        <legend className="mb-2 text-xl font-bold">The job</legend>
        <TextField label="Job title" name="title" defaultValue={v.title} error={e.title} hint="For example: Journeyman Electrician" />
        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField label="Industry" name="industry" defaultValue={v.industry ?? ""} error={e.industry}>
            <option value="" disabled>
              Choose one
            </option>
            {INDUSTRIES.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </SelectField>
          <SelectField label="Job type" name="employment_type" defaultValue={v.employment_type ?? "Full-time"} error={e.employment_type}>
            {EMPLOYMENT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </SelectField>
        </div>
        <div className="grid gap-5 sm:grid-cols-[1fr_10rem]">
          <TextField label="City" name="city" defaultValue={v.city} error={e.city} />
          <SelectField label="State" name="state" defaultValue={v.state ?? "FL"} error={e.state}>
            {US_STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </SelectField>
        </div>
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="mb-2 text-xl font-bold">Pay</legend>
        <p className="-mt-3 text-sm text-ink-soft">Optional, but jobs with pay listed get more applicants.</p>
        <div className="grid gap-5 sm:grid-cols-3">
          <TextField label="From" name="pay_min" inputMode="decimal" defaultValue={str(v.pay_min)} error={e.pay_min} optional />
          <TextField label="To" name="pay_max" inputMode="decimal" defaultValue={str(v.pay_max)} error={e.pay_max} optional />
          <SelectField label="Per" name="pay_period" defaultValue={v.pay_period ?? ""} error={e.pay_period} optional>
            <option value="">—</option>
            <option value="hour">Hour</option>
            <option value="year">Year</option>
          </SelectField>
        </div>
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="mb-2 text-xl font-bold">Description</legend>
        <TextField
          label="Short summary"
          name="summary"
          defaultValue={v.summary}
          error={e.summary}
          maxLength={300}
          optional
          hint="One or two sentences shown on the job card."
        />
        <TextArea label="About the job" name="description" defaultValue={v.description} error={e.description} rows={8} maxLength={10000} />
        <TextArea label="What they'll need" name="requirements" defaultValue={v.requirements} error={e.requirements} rows={6} maxLength={10000} optional hint="Licenses, certifications, experience. One per line works well." />
      </fieldset>

      <fieldset className="grid gap-5 rounded-lg border-2 border-dashed border-olive p-5">
        <legend className="px-2 text-xl font-bold">Internal (Novus staff only)</legend>
        <p className="-mt-2 text-sm text-ink-soft">Never shown to candidates or the public.</p>
        <SelectField
          label="Employer account"
          name="employer_id"
          defaultValue={v.employer_id ?? ""}
          optional
          hint="Links this job to an employer so their users can see the shortlist in the employer portal."
        >
          <option value="">None</option>
          {employers.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </SelectField>
        <TextField label="Client company" name="client_name" defaultValue={v.client_name} error={e.client_name} optional />
        <TextArea label="Notes" name="notes" defaultValue={v.notes} error={e.notes} rows={3} optional />
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="mb-2 text-xl font-bold">Status</legend>
        <SelectField
          label="Who can see this job?"
          name="status"
          defaultValue={v.status ?? "draft"}
          error={e.status}
          hint="Draft: only staff. Open: on the website, taking applications. Closed: off the website."
        >
          {(Object.keys(JOB_STATUS_LABELS) as JobStatus[]).map((s) => (
            <option key={s} value={s}>
              {JOB_STATUS_LABELS[s]}
            </option>
          ))}
        </SelectField>
      </fieldset>

      <div>
        <Button type="submit" loading={pending} className="w-full sm:w-auto">
          {pending ? "Saving…" : v.id ? "Save changes" : "Create job"}
        </Button>
      </div>
    </form>
  );
}
