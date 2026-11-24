import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Employer: open a RELEASED candidate's resume through a 60-second private link.
// The database function returns nothing unless the candidate was released to
// this user's company, and storage RLS checks the same thing again.
export async function GET(_req: NextRequest, ctx: RouteContext<"/employer/resume/[shortlistId]">) {
  const { shortlistId } = await ctx.params;
  if (!/^[0-9a-f-]{36}$/i.test(shortlistId)) return new NextResponse("Not found", { status: 404 });

  const supabase = await createClient();
  const { data: path } = await supabase.rpc("employer_resume_path", { p_shortlist_id: shortlistId });
  if (!path) return new NextResponse("Not found", { status: 404 });

  const { data } = await supabase.storage.from("resumes").createSignedUrl(path, 60);
  if (!data?.signedUrl) return new NextResponse("Not found", { status: 404 });
  return NextResponse.redirect(data.signedUrl);
}
