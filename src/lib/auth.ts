import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/database.types";

// Data access helpers for the logged-in user. They read cookies, so call them
// only inside a <Suspense> boundary (Cache Components rule) or in Server Actions.

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export async function getUser() {
  const supabase = await createClient();
  // getUser() asks Supabase to verify the session (don't trust cookies alone).
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data } = await supabase.from("profiles").select("*").eq("id", auth.user.id).maybeSingle();
  return data;
}

export function isStaff(profile: Pick<Profile, "role"> | null) {
  return profile?.role === "recruiter" || profile?.role === "admin";
}

// Pages that need a login: send logged-out visitors to /login and back afterwards.
export async function requireProfile(next: string): Promise<Profile> {
  const profile = await getProfile();
  if (!profile) redirect(`/login?next=${encodeURIComponent(next)}`);
  return profile;
}

// Staff pages. Non-staff get null so the page can show a plain "no access" message.
// RLS still protects the data even if this check were skipped.
export async function requireStaff(next: string): Promise<Profile | null> {
  const profile = await requireProfile(next);
  return isStaff(profile) ? profile : null;
}

export function isEmployer(profile: Pick<Profile, "role"> | null) {
  return profile?.role === "employer";
}
