"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { INDUSTRIES } from "@/lib/jobs";

export type ApplyState = { error?: string; fieldErrors?: Record<string, string>; done?: boolean };

const schema = z.object({
  job_id: z.uuid(),
  trade: z.enum(INDUSTRIES, { message: "Choose your trade." }),
  note: z.string().max(2000, "Keep your note under 2,000 characters."),
  resume_path: z.string().max(300),
});

export async function submitApplication(_prev: ApplyState, fd: FormData): Promise<ApplyState> {
  const parsed = schema.safeParse({
    job_id: fd.get("job_id"),
    trade: fd.get("trade"),
    note: String(fd.get("note") ?? "").trim(),
    resume_path: String(fd.get("resume_path") ?? ""),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { fieldErrors };
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { error: "Your session ended. Please log in again." };

  const { job_id, trade, note, resume_path } = parsed.data;
  // The resume must be in this user's own folder (the database checks this too).
  if (resume_path && !resume_path.startsWith(`${auth.user.id}/`)) {
    return { error: "Something went wrong with your resume upload. Please try again." };
  }

  const { error } = await supabase.from("applications").insert({
    job_id,
    trade,
    note,
    resume_path: resume_path || null,
  });
  if (error) {
    if (error.code === "23505") return { done: true }; // already applied: treat as success
    if (error.code === "42501") return { error: "This job is no longer taking applications." };
    return { error: "We couldn't send your application. Please try again." };
  }

  // Remember their trade for next time (ignore failures; the application is in).
  await supabase.from("profiles").update({ trade }).eq("id", auth.user.id);
  return { done: true };
}
