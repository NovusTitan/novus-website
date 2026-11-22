import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Log in" };

export default function Page() {
  return <ComingSoon title="Log in" />;
}
