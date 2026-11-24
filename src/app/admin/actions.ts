"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getProfile, isStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// Staff-only actions for search requests, employers, invites and the shortlist.
// Every one re-checks staff access; RLS enforces it again in the database.

async function staffClient() {
  const profile = await getProfile();
  if (!isStaff(profile)) throw new Error("Not allowed");
  return { supabase: await createClient(), profile: profile! };
}

export type SimpleState = { error?: string; fieldErrors?: Record<string, string>; saved?: boolean };

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const uuid = z.uuid();

// ---------- Search requests ----------
const requestSchema = z.object({
  id: z.uuid(),
  status: z.enum(["new", "contacted", "active", "closed"]),
  staff_notes: z.string().max(5000),
});

export async function updateSearchRequest(fd: FormData) {
  const { supabase } = await staffClient();
  const parsed = requestSchema.safeParse({ id: fd.get("id"), status: fd.get("status"), staff_notes: str(fd, "staff_notes") });
  if (!parsed.success) return;
  const { id, ...rest } = parsed.data;
  await supabase.from("search_requests").update(rest).eq("id", id);
  refresh();
}

// ---------- Employers ----------
const employerSchema = z.object({
  name: z.string().min(2, "Add the company name.").max(200),
  notes: z.string().max(5000),
});

export async function createEmployer(_prev: SimpleState, fd: FormData): Promise<SimpleState> {
  const { supabase } = await staffClient();
  const parsed = employerSchema.safeParse({ name: str(fd, "name"), notes: str(fd, "notes") });
  if (!parsed.success) return { fieldErrors: { name: parsed.error.issues[0].message } };
  const { data, error } = await supabase.from("employers").insert(parsed.data).select("id").single();
  if (error || !data) return { error: "We couldn't add this employer. Please try again." };
  redirect(`/admin/employers/${data.id}`);
}

export async function updateEmployer(_prev: SimpleState, fd: FormData): Promise<SimpleState> {
  const { supabase } = await staffClient();
  const id = uuid.safeParse(fd.get("id"));
  const parsed = employerSchema.safeParse({ name: str(fd, "name"), notes: str(fd, "notes") });
  if (!id.success) return { error: "Something went wrong." };
  if (!parsed.success) return { fieldErrors: { name: parsed.error.issues[0].message } };
  const { error } = await supabase.from("employers").update(parsed.data).eq("id", id.data);
  if (error) return { error: "We couldn't save. Please try again." };
  refresh();
  return { saved: true };
}

// ---------- Invites ----------
export async function createInvite(_prev: SimpleState, fd: FormData): Promise<SimpleState> {
  const { supabase } = await staffClient();
  const employerId = uuid.safeParse(fd.get("employer_id"));
  const email = z.email().safeParse(str(fd, "email").toLowerCase());
  if (!employerId.success) return { error: "Something went wrong." };
  if (!email.success) return { fieldErrors: { email: "Enter a full email, like name@company.com." } };
  const { error } = await supabase.from("employer_invites").insert({ employer_id: employerId.data, email: email.data });
  if (error) return { error: "We couldn't create the invite. Please try again." };
  refresh();
  return { saved: true };
}

export async function deleteInvite(fd: FormData) {
  const { supabase } = await staffClient();
  const id = uuid.safeParse(fd.get("id"));
  if (!id.success) return;
  await supabase.from("employer_invites").delete().eq("id", id.data).is("accepted_at", null);
  refresh();
}

export async function removeMember(fd: FormData) {
  const { supabase } = await staffClient();
  const employerId = uuid.safeParse(fd.get("employer_id"));
  const userId = uuid.safeParse(fd.get("user_id"));
  if (!employerId.success || !userId.success) return;
  await supabase.from("employer_members").delete().eq("employer_id", employerId.data).eq("user_id", userId.data);
  refresh();
}

// ---------- Shortlist + release ----------
const shortlistSchema = z.object({
  years_experience: z
    .string()
    .refine((v) => v === "" || (/^\d+$/.test(v) && Number(v) <= 60), "Enter whole years, 0 to 60.")
    .transform((v) => (v === "" ? null : Number(v))),
  summary: z.string().max(500, "Keep the summary under 500 characters."),
});

export async function addToShortlist(_prev: SimpleState, fd: FormData): Promise<SimpleState> {
  const { supabase } = await staffClient();
  const applicationId = uuid.safeParse(fd.get("application_id"));
  const parsed = shortlistSchema.safeParse({ years_experience: str(fd, "years_experience"), summary: str(fd, "summary") });
  if (!applicationId.success) return { error: "Something went wrong." };
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { fieldErrors };
  }
  const { error } = await supabase.from("shortlist").insert({ application_id: applicationId.data, ...parsed.data });
  if (error && error.code !== "23505") return { error: "We couldn't add this candidate. Please try again." };
  refresh();
  return { saved: true };
}

export async function updateShortlist(_prev: SimpleState, fd: FormData): Promise<SimpleState> {
  const { supabase } = await staffClient();
  const id = uuid.safeParse(fd.get("id"));
  const parsed = shortlistSchema.safeParse({ years_experience: str(fd, "years_experience"), summary: str(fd, "summary") });
  if (!id.success) return { error: "Something went wrong." };
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { fieldErrors };
  }
  const { error } = await supabase.from("shortlist").update(parsed.data).eq("id", id.data);
  if (error) return { error: "We couldn't save. Please try again." };
  refresh();
  return { saved: true };
}

export async function releaseCandidate(fd: FormData) {
  const { supabase, profile } = await staffClient();
  const id = uuid.safeParse(fd.get("id"));
  if (!id.success) return;
  await supabase
    .from("shortlist")
    .update({ released_at: new Date().toISOString(), released_by: profile.id })
    .eq("id", id.data)
    .is("released_at", null);
  refresh();
}

export async function removeFromShortlist(fd: FormData) {
  const { supabase } = await staffClient();
  const id = uuid.safeParse(fd.get("id"));
  if (!id.success) return;
  await supabase.from("shortlist").delete().eq("id", id.data);
  refresh();
}
