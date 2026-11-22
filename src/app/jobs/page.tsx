import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Find Jobs" };

export default function Page() {
  return <ComingSoon title="Find Jobs" />;
}
