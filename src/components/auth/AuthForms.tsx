"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  logIn,
  requestPasswordReset,
  signUp,
  updatePassword,
  type FormState,
} from "@/app/actions/auth";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";

const initial: FormState = {};
const linkClass = "font-semibold text-action underline underline-offset-4 hover:text-ink";

export function SignUpForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(signUp, initial);

  if (state.checkEmail) {
    return (
      <Alert tone="success" title="Check your email">
        We sent a link to <strong>{state.checkEmail}</strong>. Tap it to confirm your account, and we&apos;ll bring you
        right back here. Don&apos;t see it? Check your spam folder.
      </Alert>
    );
  }

  const v = state.values ?? {};
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} className="grid gap-5" noValidate>
      <input type="hidden" name="next" value={next} />
      {state.error && <Alert>{state.error}</Alert>}
      <TextField label="Full name" name="full_name" autoComplete="name" defaultValue={v.full_name} error={e.full_name} />
      <TextField label="Email" name="email" type="email" autoComplete="email" inputMode="email" defaultValue={v.email} error={e.email} />
      <TextField
        label="Phone"
        name="phone"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        hint="So a recruiter can call or text you about jobs."
        defaultValue={v.phone}
        error={e.phone}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters."
        error={e.password}
      />
      <Button type="submit" loading={pending} className="w-full sm:w-auto">
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}

export function LogInForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(logIn, initial);
  const e = state.fieldErrors ?? {};
  return (
    <form action={action} className="grid gap-5" noValidate>
      <input type="hidden" name="next" value={next} />
      {state.error && <Alert>{state.error}</Alert>}
      <TextField label="Email" name="email" type="email" autoComplete="email" inputMode="email" defaultValue={state.values?.email} error={e.email} />
      <TextField label="Password" name="password" type="password" autoComplete="current-password" error={e.password} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" loading={pending} className="w-full sm:w-auto">
          {pending ? "Logging in…" : "Log in"}
        </Button>
        <Link href="/forgot-password" className={`${linkClass} inline-flex min-h-11 items-center`}>
          Forgot your password?
        </Link>
      </div>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, initial);
  if (state.done) {
    return (
      <Alert tone="success" title="Check your email">
        If there&apos;s an account for <strong>{state.values?.email}</strong>, we sent a link to reset your password.
      </Alert>
    );
  }
  return (
    <form action={action} className="grid gap-5" noValidate>
      {state.error && <Alert>{state.error}</Alert>}
      <TextField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        defaultValue={state.values?.email}
        error={state.fieldErrors?.email}
      />
      <Button type="submit" loading={pending} className="w-full sm:w-auto">
        {pending ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, initial);
  return (
    <form action={action} className="grid gap-5" noValidate>
      {state.error && <Alert>{state.error}</Alert>}
      <TextField
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        hint="At least 8 characters."
        error={state.fieldErrors?.password}
      />
      <Button type="submit" loading={pending} className="w-full sm:w-auto">
        {pending ? "Saving…" : "Save new password"}
      </Button>
    </form>
  );
}
