import type { Metadata } from "next";
import { Suspense } from "react";
import { FormSkeleton } from "@/components/layout/Narrow";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { requireStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { updateSearchRequest } from "../actions";
import { AdminNav } from "../AdminNav";
import { NoAccess } from "../NoAccess";

export const metadata: Metadata = { title: "Search requests · Recruiter dashboard", robots: { index: false } };

const STATUS_LABELS = { new: "New", contacted: "Contacted", active: "Active search", closed: "Closed" } as const;

export default function RequestsPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <Suspense fallback={<FormSkeleton />}>
        <Requests />
      </Suspense>
    </section>
  );
}

async function Requests() {
  if (!(await requireStaff("/admin/requests"))) return <NoAccess />;
  const supabase = await createClient();
  const { data: requests } = await supabase.from("search_requests").select("*").order("created_at", { ascending: false });

  return (
    <>
      <AdminNav current="/admin/requests" />
      <h1 className="text-3xl font-bold md:text-4xl">Search requests</h1>
      <p className="mt-2 text-ink-soft">From the &ldquo;Open a search&rdquo; form on the For Employers page.</p>

      {!requests?.length ? (
        <p className="mt-8 rounded-lg bg-sand p-6">No requests yet.</p>
      ) : (
        <ul className="mt-8 grid gap-4">
          {requests.map((r) => (
            <li key={r.id} className="grid gap-4 rounded-lg border border-chip bg-cream p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-lg font-semibold">{r.company}</p>
                  <p className="text-sm text-ink-soft">
                    {r.contact_name} · {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {r.location ? ` · ${r.location}` : ""}
                  </p>
                </div>
                <Tag>{STATUS_LABELS[r.status]}</Tag>
              </div>
              <p className="whitespace-pre-line rounded-md bg-sand p-3">{r.roles}</p>
              <div className="flex flex-wrap gap-x-6 text-sm">
                <a href={`mailto:${r.email}`} className="inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4">
                  {r.email}
                </a>
                {r.phone && (
                  <a href={`tel:${r.phone}`} className="inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4">
                    {r.phone}
                  </a>
                )}
              </div>
              <form key={`${r.status}-${r.updated_at}`} action={updateSearchRequest} className="grid gap-3 border-t border-chip pt-4 sm:grid-cols-[12rem_1fr_auto] sm:items-end">
                <input type="hidden" name="id" value={r.id} />
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`status-${r.id}`} className="text-sm font-semibold">Status</label>
                  <select id={`status-${r.id}`} name="status" defaultValue={r.status} className="min-h-11 rounded-md border-2 border-ink-soft bg-cream px-3">
                    {Object.entries(STATUS_LABELS).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`notes-${r.id}`} className="text-sm font-semibold">Notes (staff only)</label>
                  <input id={`notes-${r.id}`} name="staff_notes" defaultValue={r.staff_notes} maxLength={5000} className="min-h-11 rounded-md border-2 border-ink-soft bg-cream px-3" />
                </div>
                <Button type="submit" variant="outline" className="min-h-11 px-4">
                  Save<span className="sr-only"> request from {r.company}</span>
                </Button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
