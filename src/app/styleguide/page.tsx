import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { Checkbox, SelectField, TextArea, TextField } from "@/components/ui/Field";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
};

const colors = [
  { token: "brand-orange", hex: "#E67D22", use: "Logo, icons, small accents only", text: "No text on it, never white text" },
  { token: "action", hex: "#B35A2E", use: "All buttons and links", text: "Cream text on it: 4.7:1 ✓" },
  { token: "highlight", hex: "#F0944D", use: "Small highlights and illustrations", text: "Never text, never white text on it" },
  { token: "ink", hex: "#342D2D", use: "Headlines and body text", text: "On cream: 13.4:1 ✓", dark: true },
  { token: "ink-soft", hex: "#56514D", use: "Secondary text, captions", text: "On cream: 7.8:1 ✓", dark: true },
  { token: "cream", hex: "#FFFFF8", use: "Main page background (~60%)", text: "" },
  { token: "sand", hex: "#F9F3E5", use: "Alternate section background", text: "" },
  { token: "olive", hex: "#87855D", use: "Tags, icons, dividers. Decorative only", text: "Never body text" },
  { token: "deep-olive", hex: "#48432B", use: "Footer or one dark section", text: "Cream text on it: 9.9:1 ✓", dark: true },
  { token: "chip", hex: "#E9E8DC", use: "Tag chip background", text: "Deep-olive text on it: 8.1:1 ✓" },
];

const swatchBg: Record<string, string> = {
  "brand-orange": "bg-brand-orange",
  action: "bg-action",
  highlight: "bg-highlight",
  ink: "bg-ink",
  "ink-soft": "bg-ink-soft",
  cream: "bg-cream",
  sand: "bg-sand",
  olive: "bg-olive",
  "deep-olive": "bg-deep-olive",
  chip: "bg-chip",
};

function Section({ id, title, intro, children, tone = "cream" }: {
  id: string; title: string; intro?: string; children: ReactNode; tone?: "cream" | "sand";
}) {
  return (
    <section aria-labelledby={id} className={tone === "sand" ? "bg-sand" : "bg-cream"}>
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 id={id} className="text-2xl font-bold md:text-3xl">{title}</h2>
        {intro && <p className="mt-2 max-w-2xl text-ink-soft">{intro}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

export default function StyleGuide() {
  return (
    <>
      <header className="mx-auto max-w-6xl px-4 pt-12 pb-4 md:pt-16">
        <p className="text-sm font-medium uppercase tracking-widest text-ink-soft">Internal</p>
        <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">Novus style guide</h1>
        <p className="mt-3 max-w-2xl text-lg text-ink-soft">
          The building blocks for every page. If it isn&apos;t on this page, check with the team before adding it.
        </p>
      </header>

      <Section id="logo" title="Logo" intro="Orange or charcoal logo on light backgrounds, white logo on dark. Files are in /public/brand.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex min-h-32 items-center justify-center rounded-lg border border-chip bg-cream p-6">
            <Image src="/brand/site/lockup-horizontal-orange.svg" alt="Novus Infrastructure Talent, orange" width={321} height={36} unoptimized />
          </div>
          <div className="flex min-h-32 items-center justify-center rounded-lg bg-deep-olive p-6">
            <Image src="/brand/site/lockup-horizontal-white.svg" alt="Novus Infrastructure Talent, white" width={321} height={36} unoptimized />
          </div>
          <div className="flex min-h-32 items-center justify-center rounded-lg border border-chip bg-cream p-6">
            <Image src="/brand/logo/novus-lockup-stacked-orange.svg" alt="Stacked lockup" width={263} height={120} unoptimized />
          </div>
          <div className="flex min-h-32 items-center justify-center gap-6 rounded-lg border border-chip bg-cream p-6">
            <Image src="/brand/icon/novus-icon-rounded-orange.svg" alt="Rounded orange icon, used as the favicon and app icon" width={64} height={64} unoptimized />
            <Image src="/brand/icon/novus-n-mark-orange.svg" alt="n-mark, orange" width={64} height={64} unoptimized />
            <Image src="/brand/icon/novus-n-mark-charcoal.svg" alt="n-mark, charcoal" width={64} height={64} unoptimized />
          </div>
        </div>
        <p className="mt-4 text-sm text-ink-soft">
          Header: the &ldquo;novus&rdquo; wordmark on phones and tablets, the full lockup on large screens. The rounded orange icon is the favicon and app icon.
        </p>
      </Section>

      <Section id="colors" title="Colors" tone="sand"
        intro="“Refined earth.” Use only these. Balance: about 60% cream, 30% ink and dark sections, 10% orange and olive accents.">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {colors.map((c) => (
            <li key={c.token} className="overflow-hidden rounded-lg border border-chip bg-cream">
              <div className={`h-20 ${swatchBg[c.token]} ${c.token === "cream" ? "border-b border-chip" : ""}`} />
              <div className="p-4">
                <p className="font-bold">{c.token}</p>
                <p className="font-mono text-sm text-ink-soft">{c.hex}</p>
                <p className="mt-2 text-sm">{c.use}</p>
                {c.text && <p className="mt-1 text-sm text-ink-soft">{c.text}</p>}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="type" title="Type" intro="Poppins for everything. Bold headlines, Medium all-caps labels with wide spacing, Regular body at 16–18px with generous line height.">
        <div className="divide-y divide-chip">
          {[
            { label: "Heading 1 · 36/48px bold", el: <p className="text-4xl font-bold leading-tight md:text-5xl">Building better futures, together.</p> },
            { label: "Heading 2 · 24/30px bold", el: <p className="text-2xl font-bold md:text-3xl">Industries we serve</p> },
            { label: "Heading 3 · 20px bold", el: <p className="text-xl font-bold">Data Centers &amp; Critical Infrastructure</p> },
            { label: "Body large · 18px", el: <p className="max-w-2xl text-lg">{site.oneLiner}</p> },
            { label: "Body · 16px", el: <p className="max-w-2xl">We match you with a role that fits your skills, then stay in touch after you start.</p> },
            { label: "Label · 14px Medium, all caps, wide spacing", el: <p className="text-sm font-medium uppercase tracking-widest text-ink-soft">Infrastructure talent</p> },
            { label: "Small / caption · 14px, ink-soft", el: <p className="text-sm text-ink-soft">Posted 2 days ago · Tampa, FL</p> },
            { label: "Link · action, underlined", el: <p><a href="#type" className="font-semibold text-action underline underline-offset-4 transition-colors duration-150 hover:text-ink">See all open roles</a></p> },
          ].map((row) => (
            <div key={row.label} className="grid gap-2 py-5 md:grid-cols-[14rem_1fr] md:items-baseline">
              <p className="text-sm text-ink-soft">{row.label}</p>
              {row.el}
            </div>
          ))}
        </div>
      </Section>

      <Section id="buttons" title="Buttons" tone="sand" intro="Solid for the main action, outlined for the second. Two buttons per section at most.">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <ButtonLink href="/jobs">Find a job</ButtonLink>
          <ButtonLink href="/employers" variant="outline">Hire talent</ButtonLink>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button loading>Sending…</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="on-dark mt-6 flex flex-col gap-3 rounded-lg bg-deep-olive p-6 sm:flex-row">
          <ButtonLink href="#forms" variant="on-dark">Contact us</ButtonLink>
          <p className="self-center text-cream">On the dark section, buttons switch to cream.</p>
        </div>
        <p className="mt-4 text-sm text-ink-soft">Hover darkens to ink; press nudges down 1px. 150ms transitions, nothing moves on its own.</p>
      </Section>

      <Section id="tags" title="Tag chips">
        <div className="flex flex-wrap gap-2">
          {site.industries.map((i) => <Tag key={i}>{i}</Tag>)}
          <Tag>Full-time</Tag>
          <Tag>Tampa, FL</Tag>
        </div>
      </Section>

      <Section id="forms" title="Form fields" tone="sand"
        intro="As few fields as possible. Every field has a visible label. Big tap targets. Errors say what to fix.">
        <form className="grid max-w-xl gap-6" action="#">
          <TextField label="Full name" name="name" autoComplete="name" />
          <TextField label="Phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" hint="We'll text you about matching jobs." />
          <TextField label="Email" name="email" type="email" autoComplete="email" defaultValue="jordan@" error="Enter a full email, like name@example.com." />
          <SelectField label="Your trade" name="trade" defaultValue="">
            <option value="" disabled>Choose one</option>
            {site.industries.map((i) => <option key={i}>{i}</option>)}
          </SelectField>
          <TextArea label="Anything else we should know?" name="notes" optional />
          <Checkbox name="texts" label="Text me when new jobs match" />
          <div>
            <Button type="button">Send</Button>
          </div>
          <div role="status" className="flex items-start gap-3 rounded-md border-l-4 border-olive bg-cream p-4">
            <svg aria-hidden="true" className="mt-0.5 shrink-0 text-deep-olive" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12l5 5L20 7" />
            </svg>
            <div>
              <p className="font-semibold">Thanks, we got it.</p>
              <p className="text-sm text-ink-soft">A recruiter will reach out within one business day.</p>
            </div>
          </div>
        </form>
      </Section>
    </>
  );
}
