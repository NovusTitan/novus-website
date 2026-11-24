"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getProfile, isStaff } from "@/lib/auth";
import { APPLICATION_STATUSES, EMPLOYMENT_TYPES, INDUSTRIES, US_STATES, makeSlug } from "@/lib/jobs";
import { createClient } from "@/lib/supabase/server";

export type JobFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  saved?: boolean;
};

const optionalMoney = z
  .string()
  .transform((v) => v.replace(/[$,\s]/g, ""))
  .refine((v) => v === "" || (!Number.isNaN(Number(v)) && Number(v) >= 0), "Enter a number, like 35 or 90000.")
  .transform((v) => (v === "" ? null : Number(v)));

const jobSchema = z
  .object({
    title: z.string().trim().min(3, "Add a job title.").max(120),
    industry: z.enum(INDUSTRIES, { message: "Choose an industry." }),
    city: z.string().trim().min(2, "Add a city.").max(80),
    state: z.enum(US_STATES, { message: "Choose a state." }),
    employment_type: z.enum(EMPLOYMENT_TYPES),
    pay_min: optionalMoney,
    pay_max: optionalMoney,
    pay_period: z.enum(["", "hour", "year"]).transform((v) => (v === "" ? null : v)),
    summary: z.string().trim().max(300, "Keep the summary under 300 characters."),
    description: z.string().trim().max(10000),
    requirements: z.string().trim().max(10000),
    status: z.enum(["draft", "open", "closed"]),
    client_name: z.string().trim().max(200),
    notes: z.string().trim().max(5000),
    employer_id: z.union([z.literal(""), z.uuid()]).transform((v) => (v === "" ? null : v)),
  })
  .superRefine((d, ctx) => {
    if ((d.pay_min != null || d.pay_max != null) && !d.pay_period) {
      ctx.addIssue({ code: "custom", path: ["pay_period"], message: "Choose per hour or per year." });
    }
    if (d.pay_min != null && d.pay_max != null && d.pay_max < d.pay_min) {
      ctx.addIssue({ code: "custom", path: ["pay_max"], message: "The top of the range must be at least the bottom." });
    }
    if (d.status === "open" && !d.description) {
      ctx.addIssue({ code: "custom", path: ["description"], message: "Add a description before opening the job." });
    }
  });

async function staffOnly() {
  const profile = await getProfile();
  if (!isStaff(profile)) throw new Error("Not allowed");
}

export async function saveJob(_prev: JobFormState, fd: FormData): Promise<JobFormState> {
  await staffOnly();
  const raw = Object.fromEntries(
    ["title", "industry", "city", "state", "employment_type", "pay_min", "pay_max", "pay_period", "summary",
      "description", "requirements", "status", "client_name", "notes", "employer_id"].map((k) => [k, String(fd.get(k) ?? "")]),
  );
  const parsed = jobSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }
  const { client_name, notes, employer_id, ...job } = parsed.data;
  const id = String(fd.get("id") ?? "");
  const supabase = await createClient();

  if (id) {
    const { error } = await supabase.from("jobs").update(job).eq("id", id);
    if (error) return { error: "We couldn't save this job. Please try again." };
    const { error: e2 } = await supabase.from("job_internal").upsert({ job_id: id, client_name, notes, employer_id });
    if (e2) return { error: "The job saved, but the internal details didn't. Please try again." };
    updateTag("jobs");
    refresh();
    return { saved: true };
  }

  const { data, error } = await supabase
    .from("jobs")
    .insert({ ...job, slug: makeSlug(job.title, job.city, job.state) })
    .select("id")
    .single();
  if (error || !data) return { error: "We couldn't create this job. Please try again." };
  await supabase.from("job_internal").insert({ job_id: data.id, client_name, notes, employer_id });
  updateTag("jobs");
  redirect(`/admin/jobs/${data.id}?created=1`);
}

const statusSchema = z.object({ id: z.uuid(), status: z.enum(APPLICATION_STATUSES) });

export async function updateApplicationStatus(fd: FormData) {
  await staffOnly();
  const parsed = statusSchema.safeParse({ id: fd.get("id"), status: fd.get("status") });
  if (!parsed.success) return;
  const supabase = await createClient();
  await supabase.from("applications").update({ status: parsed.data.status }).eq("id", parsed.data.id);
  refresh();
}
