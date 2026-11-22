import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/jobs";

// Where links in Supabase emails land (confirm sign-up, reset password).
// Handles both link styles:
//  - ?token_hash=...&type=...  (recommended email template; works in any browser)
//  - ?code=...                 (Supabase's default template; same browser only)
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNext(searchParams.get("next"));
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");

  const supabase = await createClient();
  let ok = false;
  if (tokenHash && type) {
    ok = !(await supabase.auth.verifyOtp({ type, token_hash: tokenHash })).error;
  } else if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  }

  if (ok) return NextResponse.redirect(new URL(next, origin));
  return NextResponse.redirect(new URL(`/login?error=link&next=${encodeURIComponent(next)}`, origin));
}
