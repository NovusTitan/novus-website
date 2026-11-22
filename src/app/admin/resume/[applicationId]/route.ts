import { NextResponse, type NextRequest } from "next/server";
import { getProfile, isStaff } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// Staff-only: open an applicant's resume through a short-lived private link.
export async function GET(_req: NextRequest, ctx: RouteContext<"/admin/resume/[applicationId]">) {
  const { applicationId } = await ctx.params;
  if (!isStaff(await getProfile())) return new NextResponse("Not found", { status: 404 });

  const supabase = await createClient();
  const { data: app } = await supabase.from("applications").select("resume_path").eq("id", applicationId).maybeSingle();
  if (!app?.resume_path) return new NextResponse("Not found", { status: 404 });

  const { data } = await supabase.storage.from("resumes").createSignedUrl(app.resume_path, 60);
  if (!data?.signedUrl) return new NextResponse("Not found", { status: 404 });
  return NextResponse.redirect(data.signedUrl);
}
