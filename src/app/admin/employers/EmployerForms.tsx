"use client";

import { startTransition, useActionState, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextArea, TextField } from "@/components/ui/Field";
import { createEmployer, createInvite, updateEmployer, type SimpleState } from "../actions";

function useForm(fn: (p: SimpleState, fd: FormData) => Promise<SimpleState>) {
  const [state, action, pending] = useActionState<SimpleState, FormData>(fn, {});
  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    startTransition(() => action(fd));
  };
  return { state, pending, onSubmit };
}

export function EmployerForm({ employer }: { employer?: { id: string; name: string; notes: string } }) {
  const { state, pending, onSubmit } = useForm(employer ? updateEmployer : createEmployer);
  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
      {employer && <input type="hidden" name="id" value={employer.id} />}
      {state.error && <Alert>{state.error}</Alert>}
      {state.saved && !pending && <Alert tone="success" title="Saved." />}
      <TextField label="Company name" name="name" defaultValue={employer?.name} error={state.fieldErrors?.name} />
      <TextArea label="Notes" name="notes" defaultValue={employer?.notes} rows={3} optional hint="Staff only. Agreement details, Flex option, contacts." />
      <div>
        <Button type="submit" loading={pending} className="w-full sm:w-auto">
          {employer ? "Save" : "Add employer"}
        </Button>
      </div>
    </form>
  );
}

export function InviteForm({ employerId }: { employerId: string }) {
  const { state, pending, onSubmit } = useForm(createInvite);
  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-start" noValidate>
      <input type="hidden" name="employer_id" value={employerId} />
      <TextField
        label="Invite by email"
        name="email"
        type="email"
        inputMode="email"
        hint="They must sign up or log in with this exact email."
        error={state.fieldErrors?.email}
      />
      <Button type="submit" loading={pending} className="sm:mt-[3.25rem]">
        Create invite link
      </Button>
      {state.error && <Alert>{state.error}</Alert>}
    </form>
  );
}

// Builds the full link from the site's own address and copies it.
export function CopyInviteLink({ token }: { token: string }) {
  const [copied, setCopied] = useState(false);
  const path = `/employer/join?token=${token}`;
  return (
    <button
      type="button"
      className="inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4 hover:text-ink"
      onClick={async () => {
        await navigator.clipboard.writeText(`${window.location.origin}${path}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      <span aria-live="polite">{copied ? "Copied!" : "Copy invite link"}</span>
    </button>
  );
}
