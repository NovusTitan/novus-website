import type { Database } from "@/lib/database.types";

// Shared job-board types, labels and formatting. Safe to import anywhere.

type Enums = Database["public"]["Enums"];
export type Industry = Enums["industry"];
export type EmploymentType = Enums["employment_type"];
export type JobStatus = Enums["job_status"];
export type PayPeriod = Enums["pay_period"];
export type ApplicationStatus = Enums["application_status"];
export type Job = Database["public"]["Tables"]["jobs"]["Row"];

// Columns any visitor may see. Never add internal fields here.
export const PUBLIC_JOB_COLUMNS =
  "id, slug, title, industry, city, state, employment_type, pay_min, pay_max, pay_period, summary, description, requirements, published_at";
export type PublicJob = Pick<
  Job,
  | "id" | "slug" | "title" | "industry" | "city" | "state" | "employment_type"
  | "pay_min" | "pay_max" | "pay_period" | "summary" | "description" | "requirements" | "published_at"
>;

export const INDUSTRIES: Industry[] = [
  "Engineering",
  "Architecture",
  "Data Centers & Critical Infrastructure",
  "Construction",
  "Telecommunications",
];

export const EMPLOYMENT_TYPES: EmploymentType[] = ["Full-time", "Contract", "Contract-to-hire", "Part-time"];

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  draft: "Draft",
  open: "Open",
  closed: "Closed",
};

// What candidates (and recruiters) see for an application's status.
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  new: "Received",
  reviewing: "In review",
  interviewing: "Interviewing",
  placed: "Hired",
  not_selected: "Not selected",
};
export const APPLICATION_STATUSES = Object.keys(APPLICATION_STATUS_LABELS) as ApplicationStatus[];

export const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS",
  "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC",
  "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
] as const;

export function jobLocation(job: Pick<Job, "city" | "state">) {
  return `${job.city}, ${job.state}`;
}

const money = (n: number, period: PayPeriod) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: period === "hour" && n % 1 !== 0 ? 2 : 0,
  });

// "$35–$45 an hour", "From $90,000 a year", or null when pay isn't listed.
export function formatPay(job: Pick<Job, "pay_min" | "pay_max" | "pay_period">) {
  const { pay_min: min, pay_max: max, pay_period: period } = job;
  if (!period || (min == null && max == null)) return null;
  const per = period === "hour" ? "an hour" : "a year";
  if (min != null && max != null) {
    return min === max ? `${money(min, period)} ${per}` : `${money(min, period)}–${money(max, period)} ${per}`;
  }
  if (min != null) return `From ${money(min, period)} ${per}`;
  return `Up to ${money(max!, period)} ${per}`;
}

// "electrician-tampa-fl-4k2x": readable and unique enough; the DB enforces uniqueness.
export function makeSlug(title: string, city: string, state: string) {
  const base = `${title} ${city} ${state}`
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || "job"}-${suffix}`;
}

// Only allow redirects back into this site (blocks "//evil.com" and full URLs).
export function safeNext(next: unknown, fallback = "/account") {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")
    ? next
    : fallback;
}
