import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";

export const metadata: Metadata = { title: "EEO Statement" };

export default function Page() {
  return <ComingSoon title="EEO Statement" />;
}
