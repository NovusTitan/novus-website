"use client";

import { startTransition, useActionState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextArea, TextField } from "@/components/ui/Field";
import { site } from "@/lib/site";
import { submitSearchRequest, type RequestState } from "./actions";

export function RequestForm() {
  const [state, action, pending] = useActionState<RequestState, FormData>(submitSearchRequest, {});

  if (state.done) {
    return (
      <Alert tone="success" title="Thanks, we got your request.">
        A Novus recruiter will reach out to talk through your roles. Want to talk now? Call {site.phone.display}.
      </Alert>
    );
  }

  const v = state.values ?? {};
  const e = state.fieldErrors ?? {};
  return (
    <form
      className="grid gap-5"
      noValidate
      onSubmit={(ev) => {
        ev.preventDefault();
        const fd = new FormData(ev.currentTarget);
        startTransition(() => action(fd));
      }}
    >
      {state.error && <Alert>{state.error}</Alert>}
      <TextField label="Company" name="company" autoComplete="organization" defaultValue={v.company} error={e.company} />
      <TextField label="Your name" name="contact_name" autoComplete="name" defaultValue={v.contact_name} error={e.contact_name} />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Work email" name="email" type="email" autoComplete="email" inputMode="email" defaultValue={v.email} error={e.email} />
        <TextField label="Phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" defaultValue={v.phone} error={e.phone} optional />
      </div>
      <TextArea
        label="Which roles are you hiring for?"
        name="roles"
        hint="For example: 2 journeyman electricians, 1 project engineer."
        defaultValue={v.roles}
        error={e.roles}
        rows={3}
        maxLength={2000}
      />
      <TextField label="Job location" name="location" hint="City and state." defaultValue={v.location} error={e.location} optional />
      {/* Honeypot for bots: hidden from people and screen readers. */}
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <Button type="submit" loading={pending} className="w-full sm:w-auto">
          {pending ? "Sending…" : "Open a search"}
        </Button>
      </div>
    </form>
  );
}
