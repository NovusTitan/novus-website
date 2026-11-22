import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { PUBLIC_JOB_COLUMNS, type PublicJob } from "@/lib/jobs";

// Public job data, cached and shared by all visitors. Staff edits call
// updateTag("jobs") so changes show up right away.

async function fetchOpenJobs(): Promise<PublicJob[]> {
  "use cache";
  cacheTag("jobs");
  cacheLife("hours");

  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("jobs")
    .select(PUBLIC_JOB_COLUMNS)
    .eq("status", "open")
    .order("published_at", { ascending: false });
  if (error) throw new Error(`Couldn't load jobs: ${error.message}`);
  return data;
}

async function fetchOpenJob(slug: string): Promise<PublicJob | null> {
  "use cache";
  cacheTag("jobs");
  cacheLife("hours");

  const supabase = createPublicClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("jobs")
    .select(PUBLIC_JOB_COLUMNS)
    .eq("status", "open")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Couldn't load job: ${error.message}`);
  return data;
}

// Public wrappers: if Supabase is unreachable or not set up yet, show "no jobs"
// instead of breaking the page. Errors aren't cached, so the next visit retries.
export async function getOpenJobs(): Promise<PublicJob[]> {
  try {
    return await fetchOpenJobs();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getOpenJob(slug: string): Promise<PublicJob | null> {
  try {
    return await fetchOpenJob(slug);
  } catch (error) {
    console.error(error);
    return null;
  }
}
