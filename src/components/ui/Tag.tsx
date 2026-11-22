import type { ReactNode } from "react";

// Tag chip: chip background with deep-olive text (8:1 contrast).
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center self-start rounded-full bg-chip px-3 py-1 text-sm font-medium text-deep-olive">
      {children}
    </span>
  );
}
