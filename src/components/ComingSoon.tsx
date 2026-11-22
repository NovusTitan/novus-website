import Link from "next/link";

export function ComingSoon({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-3 text-ink-soft">This page is coming soon.</p>
      <Link href="/" className="mt-6 inline-flex min-h-11 items-center font-semibold text-action underline underline-offset-4">
        Back to home
      </Link>
    </section>
  );
}
