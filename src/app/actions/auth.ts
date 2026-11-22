"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/jobs";

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  // Echo text inputs back so the form keeps them after an error.
  values?: Record<string, string>;
  // Set after sign-up when the user must confirm their email first.
  checkEmail?: string;
  done?: boolean;
};

async function siteOrigin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    out[key] ??= issue.message;
  }
  return out;
}

const text = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

const signUpSchema = z.object({
  full_name: z.string().min(2, "Enter your full name.").max(120, "That name is too long."),
  email: z.email("Enter a full email, like name@example.com."),
  phone: z
    .string()
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Enter a phone number with area code.")
    .refine((v) => v.length <= 30, "That phone number is too long."),
  password: z.string().min(8, "Use at least 8 characters.").max(72, "Use 72 characters or fewer."),
});

export async function signUp(_prev: FormState, fd: FormData): Promise<FormState> {
  const values = { full_name: text(fd, "full_name"), email: text(fd, "email"), phone: text(fd, "phone") };
  const parsed = signUpSchema.safeParse({ ...values, password: String(fd.get("password") ?? "") });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error), values };

  const next = safeNext(fd.get("next"));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name, phone: parsed.data.phone },
      emailRedirectTo: `${await siteOrigin()}/auth/confirm?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    if (error.code === "weak_password") return { fieldErrors: { password: "Pick a stronger password." }, values };
    if (error.code === "user_already_exists") {
      return { error: "There's already an account with that email. Log in instead.", values };
    }
    if (error.status === 429) return { error: "Too many tries. Please wait a few minutes and try again.", values };
    return { error: "We couldn't create your account. Please try again.", values };
  }

  // Email confirmation off: the user is logged in now.
  if (data.session) redirect(next);
  // Email confirmation on: tell them to check their inbox.
  return { checkEmail: parsed.data.email };
}

const logInSchema = z.object({
  email: z.email("Enter a full email, like name@example.com."),
  password: z.string().min(1, "Enter your password."),
});

export async function logIn(_prev: FormState, fd: FormData): Promise<FormState> {
  const values = { email: text(fd, "email") };
  const parsed = logInSchema.safeParse({ ...values, password: String(fd.get("password") ?? "") });
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error), values };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    if (error.code === "email_not_confirmed") {
      return { error: "Please confirm your email first. Check your inbox for the link we sent.", values };
    }
    if (error.status === 429) return { error: "Too many tries. Please wait a few minutes and try again.", values };
    return { error: "That email and password don't match. Try again or reset your password.", values };
  }
  redirect(safeNext(fd.get("next")));
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordReset(_prev: FormState, fd: FormData): Promise<FormState> {
  const values = { email: text(fd, "email") };
  const parsed = z.email().safeParse(values.email);
  if (!parsed.success) return { fieldErrors: { email: "Enter a full email, like name@example.com." }, values };

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${await siteOrigin()}/auth/confirm?next=/account/reset-password`,
  });
  // Same answer either way, so this can't be used to check who has an account.
  return { done: true, values };
}

export async function updatePassword(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = z
    .string()
    .min(8, "Use at least 8 characters.")
    .max(72, "Use 72 characters or fewer.")
    .safeParse(String(fd.get("password") ?? ""));
  if (!parsed.success) return { fieldErrors: { password: parsed.error.issues[0].message } };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data });
  if (error) {
    if (error.code === "same_password") return { fieldErrors: { password: "Pick a password you haven't used before." } };
    if (error.code === "weak_password") return { fieldErrors: { password: "Pick a stronger password." } };
    return { error: "Your reset link may have expired. Request a new one and try again." };
  }
  redirect("/account?password=updated");
}
