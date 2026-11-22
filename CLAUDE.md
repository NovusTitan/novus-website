@AGENTS.md

# Novus Talent Company — Project Guide

Read this file before every task and follow it. The **Brand & UX** section applies to every page.

## Company
- **Name:** Novus Talent Company (novustalent.co)
- **Industries:** Engineering; Architecture; Data Centers & Critical Infrastructure; Construction; Telecommunications.
- **Contact:** 5700 Memorial Hwy Suite 122, Tampa, FL 33615 · 656-263-8230

Shared copy lives in `src/lib/site.ts`. Use it instead of retyping company details.

## Users
- **Job seekers:** often on phones, often trades and field workers. Keep it fast, simple and thumb-friendly.
- **Employers:** hiring managers and HR.
- **Novus recruiters/admins**

## Pricing model: Novus Flex
- An **activation fee** opens a search. One fee covers a group of roles opened together.
- The employer then picks **Flex 0** (one-time fee), **Flex 3**, **Flex 6**, or a **weekly-payment agreement**.
- Fees are **12–25% of salary**.

## Rules (always)
1. **Mobile-first** on every page. Design for ~360px wide first, then scale up.
2. **WCAG AA accessibility** (details in Brand & UX below).
3. **Plain, friendly language.**
4. **Never expose candidate names or contact info to employers** until Novus releases them. Enforce this in the database (RLS / views), not just the UI.
5. **Every database table uses Supabase row-level security.** Enable RLS and write policies in the same migration that creates the table.
6. **Keep features simple.** Do not add features that weren't asked for.

---

## Brand & UX

Live reference: **`/styleguide`** (not indexed by search engines). Build pages from the shared components:
- `src/components/ui/Button.tsx`: `Button`, `ButtonLink`, `buttonClass`
- `src/components/ui/Tag.tsx`
- `src/components/ui/Field.tsx`: `TextField`, `TextArea`, `SelectField`, `Checkbox`

Don't hand-roll new versions of these.

### Brand
- **Logo lockup:** NOVUS | INFRASTRUCTURE TALENT.
- **Logo files** live in `/public/brand`:
  - the n-mark in white, orange and charcoal
  - square, circle and rounded icons
  - horizontal lockups
- **Favicon and app icon:** the rounded orange icon.
  - Originals from the brand kit: `/public/brand/logo` and `/public/brand/icon`.
  - The site uses tightly cropped copies in `/public/brand/site`. The kit's SVGs have about 25% built-in padding; the cropped copies keep the same artwork and change only the viewBox.
  - `src/components/Logo.tsx`: the header shows the "novus" wordmark below `lg` and the full lockup at `lg` and up. Dark backgrounds use `<Logo tone="dark" />` (white lockup).
  - Favicon and app icons: `src/app/favicon.ico`, `icon.svg`, `apple-icon.png`, and `manifest.ts`.
  - The kit's README: orange or charcoal logo on light backgrounds, white logo on dark or orange backgrounds.
- **Tagline:** "Building better futures, together."
- **Elevator pitch:** "Novus is an infrastructure talent company. We find the engineers, builders and technicians behind America's infrastructure, and we only get paid when they stay."
- **Meaning:** *Novus* is Latin for "new."
  - Foundation verses: "Let us rise up and build" (Nehemiah 2:18) and "all things are become new" (2 Corinthians 5:17).
  - The verses appear **only on the About page**, never in the main UI.

### Color: "Refined earth"
These are the only colors. Tailwind's default palette is removed in `src/app/globals.css`, so `bg-gray-*`, `text-white` and the like don't exist. **Do not add other colors.**

| Tailwind token | Hex | Use |
|---|---|---|
| `brand-orange` | #E67D22 | Logo, icons, small accents only |
| `action` | #B35A2E | All buttons and links (cream text on it) |
| `highlight` | #F0944D | Small highlights and illustrations only. Never text |
| `ink` | #342D2D | Headlines and body text |
| `ink-soft` | #56514D | Secondary text, captions |
| `cream` | #FFFFF8 | Main page background |
| `sand` | #F9F3E5 | Alternate section background |
| `olive` | #87855D | Tags, icons, dividers. Decorative only, never body text |
| `deep-olive` | #48432B | Footer or one dark section. Cream text on it |
| `chip` | #E9E8DC | Tag chip background, with `deep-olive` text |

- **Balance:** about 60% cream backgrounds, 30% ink and dark sections, 10% orange and olive accents.
- **Contrast checks (AA):**
  - cream on action is 4.7:1 ✓
  - ink on cream is 13.4:1 ✓
  - ink-soft on cream is 7.8:1 ✓
  - cream on deep-olive is 9.9:1 ✓
  - deep-olive on chip is 8.1:1 ✓
- **Never** put white or cream text on `brand-orange` (2.9:1) or `highlight` (2.3:1).
- **Never** use `brand-orange`, `highlight` or `olive` for text.
- **Links on sand:** `action` text on `sand` is only 4.3:1, so in sand sections, text links use `ink` with an underline.
  - Buttons are fine on sand: solid buttons are cream on action, and outlined buttons have a cream fill for this reason.
- **Dark sections** (`deep-olive`) must have the `on-dark` class. It switches the focus ring to cream, because the action-colored ring is only 2.1:1 there. Buttons in dark sections use `variant="on-dark"`.

### Type
- **Font:** **Poppins** for everything (from the brand kit), loaded via `next/font` with an Arial fallback.
  - Bold (700) for headlines.
  - Medium (500), all caps with wide letter spacing (`text-sm font-medium uppercase tracking-widest`), for labels.
  - Regular (400) for body.
  - Semibold (600) for buttons and links.
- **Scale:**
  - H1: `text-4xl md:text-5xl font-bold`
  - H2: `text-2xl md:text-3xl font-bold`
  - H3: `text-xl font-bold`
  - Body: 16–18px (`text-base` / `text-lg`), line height ~1.65
  - Captions: `text-sm text-ink-soft`
- **Voice:** plain, confident, warm. Short sentences. No jargon, no buzzwords.
- **Imagery:** real photos of jobsites, our team and our candidates. **No generic stock photos.** Until real photos exist, use solid color sections and simple icons.

### UX rules
- **Minimal and clean:**
  - Lots of white space.
  - One main message per section.
  - **Max 2 buttons per section:** solid for the main action, outlined for the second.
- **Every page answers in 5 seconds:** what is this, who is it for, what do I do next.
- **Home page.** The sections, in this order, and nothing else:
  1. Hero: tagline, pitch, and two big buttons, "Build my career" (solid action, to /jobs) and "Build my team" (outlined action, to /employers)
  2. Industries
  3. Open roles near you
  4. How it works (3 steps)
  5. Proof: the retention promise, plus testimonials once we have them
  6. Contact
- **Navigation:**
  - 5 items max in the header: Find Jobs, For Employers, Outplacement, About, plus a **Contact** button.
  - **Log in** lives in the footer and the mobile menu.
  - On phones, a tap-to-call icon sits next to the menu button.
  - Sticky on scroll.
  - Simple mobile menu.
- **Speed:**
  - Lighthouse mobile 90+.
  - Optimize images with `next/image`.
  - No carousels, video backgrounds or heavy animations.
- **Accessibility (WCAG AA):**
  - AA contrast (see above).
  - Visible focus states.
  - A visible label on every form field.
  - Everything works with keyboard only.
  - Tap targets at least 44px.
  - Respect `prefers-reduced-motion`.
- **Micro-interactions:**
  - Subtle only: hover and press states with 150–200ms transitions.
  - Clear loading states (`<Button loading>`) and success states (`role="status"`) on forms.
  - Nothing moves on its own.
- **Forms:**
  - As few fields as possible.
  - Big tap targets (48px controls).
  - Errors say what to fix.
  - Show progress on multi-step forms.
- **Trust:**
  - Phone number and a Contact button are visible on every page.
  - Real recruiter photos and bios go on the About page.

---

## Job board (Phase 1)

### Who can do what
- **Job seekers** (`candidate` role) create an account and apply.
- **Novus staff** (`recruiter` or `admin`) post jobs and review applicants.
- **Employers:** the `employer` role is reserved for Phase 3, as invite-only accounts. Nothing grants it yet.
- **Making someone staff** is done by hand in the Supabase SQL editor:
  ```sql
  update public.profiles set role = 'recruiter' where email = 'name@novustalent.co';
  ```
  No one can change their own role: column grants block it, and sign-up always creates `candidate`.

### Database
The schema lives in `supabase/migrations/`. New changes go in new migration files; never edit an applied migration.

| Table | Holds | Who can see it (RLS) |
|---|---|---|
| `profiles` | Name, email, phone, trade, role | Own row, or staff. Users may update only `full_name`, `phone` and `trade`. |
| `jobs` | Public job posts: `draft` / `open` / `closed` | Anyone sees `open` jobs. Staff see all. Candidates also see jobs they applied to. Staff-only writes. |
| `job_internal` | Client company and internal notes | Staff only. Kept in its own table so it can't leak through the public feed. |
| `applications` | Job, candidate, trade, note, resume path, status | Own rows, or staff. Candidates insert for themselves, into open jobs only, with status `new`. Only staff update. |
| `storage: resumes` | Private bucket, 5 MB, PDF/Word, stored at `<user id>/<file>` | Owner and staff. Staff open files through `/admin/resume/[id]` (60-second signed URL). |

- **Policy helpers** are `SECURITY DEFINER` functions: `is_staff()`, `job_is_open()` and `has_applied()`. They prevent policy recursion between `jobs` and `applications`.
- **RLS tests:** run the SQL checks from a fresh local database after any policy change.

### Pages
- **Public:**
  - `/jobs` (filters are a GET form)
  - `/jobs/[slug]`
  - `/jobs/[slug]/apply` (step 1: account; step 2: apply)
- **Account:**
  - `/login`, `/signup`, `/forgot-password`
  - `/account` (my applications)
  - `/account/reset-password`
  - `/auth/confirm` handles email links, both `token_hash` and `code` styles.
- **Staff:**
  - `/admin/jobs`, `/admin/jobs/new`
  - `/admin/jobs/[id]` (edit the job, applicants, status)
- **Data helpers:**
  - Public job data: `src/lib/data/jobs.ts`. These are cached with `use cache` and tagged `jobs`. Staff actions call `updateTag("jobs")`.
  - Session helpers: `src/lib/auth.ts`.
- **Cache Components rule:** anything that reads cookies, `params` or `searchParams` sits inside `<Suspense>`.
- **Client name:** never select `job_internal` outside `/admin`. Public job queries use `PUBLIC_JOB_COLUMNS` only.

### Local development
- `npm run db:start` runs a local Supabase. It needs Docker.
- Point `.env.local` at the local URL and key that it prints.
- Test emails show up in Mailpit at http://127.0.0.1:54324.
- After changing the schema, run `npm run db:reset`, then `npm run db:types`.

---

## Tech
- **Next.js 16** (App Router, TypeScript, `src/` dir).
  - Middleware is now `src/proxy.ts`.
  - See AGENTS.md, and read `node_modules/next/dist/docs/` for APIs that changed.
- **Tailwind CSS v4.** Theme tokens are in `src/app/globals.css` (`@theme`).
- **Supabase** via `@supabase/ssr`:
  - `src/lib/supabase/client.ts` for client components
  - `src/lib/supabase/server.ts` for server components and actions
  - `src/proxy.ts` refreshes the auth session
- **Env vars:** `.env.local` (git-ignored) holds the real values. Keep `.env.example` in sync.
  - On Vercel, `NEXT_PUBLIC_*` variables must be type **Config**, not Secret.
- **Shared layout:** `src/components/SiteHeader.tsx`, `src/components/SiteFooter.tsx`.
