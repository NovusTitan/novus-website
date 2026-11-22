@AGENTS.md

# Novus Talent Company — Project Guide

Read this file before every task and follow it.

## Company
- **Name:** Novus Talent Company (novustalent.co)
- **One-liner:** "Novus is an infrastructure talent company. We find the engineers, builders and technicians behind America's infrastructure, and we only get paid when they stay."
- **Lockup:** NOVUS | INFRASTRUCTURE TALENT
- **Tagline:** "Building better futures, together."
- **Industries:** Engineering; Architecture; Data Centers & Critical Infrastructure; Construction; Telecommunications.
- **Contact:** 5700 Memorial Hwy Suite 122, Tampa, FL 33615 · 656-263-8230

Shared copy lives in `src/lib/site.ts`. Use it instead of retyping company details.

## Brand
"Refined earth" palette. The style is minimal, clean and warm. Logo files go in `/public/brand`. The full Brand & UX rules come in Phase 0B; add them to this file when they arrive.

| Token (Tailwind) | Hex | Use |
|---|---|---|
| `brand` | #E67D22 | Brand orange. Accents, rules, icons, large display only |
| `action` | #B35A2E | Buttons and links |
| `ink` | #342D2D | Main text |
| `ink-soft` | #56514D | Secondary text |
| `cream` | #FFFFF8 | Page background |
| `sand` | #F9F3E5 | Section/card background |
| `olive` | #87855D | Decorative accents |
| `olive-deep` | #48432B | Dark sections, text |

Use them as classes, for example `bg-cream text-ink`, `bg-action text-cream`, `border-brand`.

**Contrast (WCAG AA). Check this before pairing colors:**
- OK for any text: `ink`, `ink-soft` or `olive-deep` on `cream` or `sand`; `cream` on `action` (4.7:1); `cream` on `ink` or `olive-deep`; `ink` on `brand` (4.7:1).
- `action` text on `cream` passes (4.7:1). On `sand` it is only 4.3:1, so use it there for large or bold text 18.66px+ only, or switch to `ink`.
- **Never** put normal-size text in `brand` orange (2.9:1) or `olive` (3.8:1). Don't put `cream` text on `brand` either.

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
2. **WCAG AA accessibility:** semantic HTML, labels on every input, visible focus states, 44px minimum tap targets, AA contrast, keyboard navigable.
3. **Plain, friendly language.** No jargon.
4. **Never expose candidate names or contact info to employers** until Novus releases them. Enforce this in the database (RLS / views), not just the UI.
5. **Every database table uses Supabase row-level security.** Enable RLS and write policies in the same migration that creates the table.
6. **Keep features simple.** Do not add features that weren't asked for.

## Tech
- Next.js 16 (App Router, TypeScript, `src/` dir). Middleware is now `src/proxy.ts`. See AGENTS.md and read `node_modules/next/dist/docs/` for APIs that changed.
- Tailwind CSS v4. Theme tokens are in `src/app/globals.css` (`@theme`).
- Supabase via `@supabase/ssr`:
  - `src/lib/supabase/client.ts` for client components
  - `src/lib/supabase/server.ts` for server components and actions
  - `src/proxy.ts` refreshes the auth session
- Env vars: `.env.local` (git-ignored) holds the real values. Keep `.env.example` in sync.
- Shared layout: `src/components/SiteHeader.tsx`, `src/components/SiteFooter.tsx`.
