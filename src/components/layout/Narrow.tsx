import type { ReactNode } from "react";

// Narrow single-column page for forms (login, sign-up, apply).
export function Narrow({ title, intro, children }: { title: string; intro?: ReactNode; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-xl px-4 py-12 md:py-20">
      <h1 className="text-3xl font-bold leading-tight md:text-4xl">{title}</h1>
      {intro && <p className="mt-3 text-lg text-ink-soft">{intro}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function FormSkeleton() {
  return (
    <div aria-hidden="true" className="grid gap-5">
      {[0, 1, 2].map((i) => (
        <div key={i} className="grid gap-2">
          <div className="h-4 w-24 rounded bg-chip" />
          <div className="h-12 rounded-md bg-sand" />
        </div>
      ))}
    </div>
  );
}
