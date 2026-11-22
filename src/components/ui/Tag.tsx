import type { ReactNode } from "react";

// Tag chip: chip background with deep-olive text (8:1 contrast).
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-chip px-3 py-1 text-sm font-medium text-deep-olive">
      {children}
    </span>
  );
}
