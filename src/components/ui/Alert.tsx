import type { ReactNode } from "react";

// Form-level messages. Errors are announced right away; success politely.
export function Alert({ tone = "error", title, children }: { tone?: "error" | "success"; title?: string; children?: ReactNode }) {
  const error = tone === "error";
  return (
    <div
      role={error ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-md border-l-4 bg-cream p-4 ${error ? "border-action" : "border-olive"}`}
    >
      <svg aria-hidden="true" className={`mt-0.5 shrink-0 ${error ? "text-action" : "text-deep-olive"}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {error ? (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 7v6M12 17h.01" />
          </>
        ) : (
          <path d="M5 12l5 5L20 7" />
        )}
      </svg>
      <div>
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={title ? "text-sm text-ink-soft" : ""}>{children}</div>}
      </div>
    </div>
  );
}

// "Step 1 of 2" progress for multi-step forms (Brand & UX rule).
export function StepProgress({ step, total, label }: { step: number; total: number; label: string }) {
  return (
    <div className="mb-8">
      <p className="text-sm font-medium uppercase tracking-widest text-ink-soft">
        Step {step} of {total}
      </p>
      <p className="mt-1 text-lg font-semibold">{label}</p>
      <div
        className="mt-3 flex gap-2"
        role="progressbar"
        aria-label={`Step ${step} of ${total}`}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step}
      >
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`h-2 flex-1 rounded-full ${i < step ? "bg-action" : "bg-chip"}`} />
        ))}
      </div>
    </div>
  );
}
