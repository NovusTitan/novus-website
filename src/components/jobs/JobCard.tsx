import Link from "next/link";
import { Tag } from "@/components/ui/Tag";
import { formatPay, jobLocation, type PublicJob } from "@/lib/jobs";

// One job in a list. The whole card is one link (big tap target).
export function JobCard({ job, headingLevel = "h3" }: { job: PublicJob; headingLevel?: "h2" | "h3" }) {
  const pay = formatPay(job);
  const H = headingLevel;
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="group flex h-full flex-col gap-3 rounded-lg border border-chip bg-cream p-5 transition-colors duration-150 hover:border-action"
    >
      <Tag>{job.industry}</Tag>
      <H className="text-xl font-bold group-hover:text-action">{job.title}</H>
      <p className="text-ink-soft">
        {jobLocation(job)} · {job.employment_type}
      </p>
      {pay && <p className="font-semibold">{pay}</p>}
      {job.summary && <p className="text-ink-soft">{job.summary}</p>}
      <span className="mt-auto pt-2 font-semibold text-action underline underline-offset-4">
        View job<span className="sr-only">: {job.title}</span>
      </span>
    </Link>
  );
}
