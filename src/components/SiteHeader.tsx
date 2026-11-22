"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { mainNav } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  // The menu remembers which page it was opened on, so it closes itself after navigating.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);

  // Close the mobile menu on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="relative border-b border-sand bg-cream">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex min-h-11 items-center rounded" aria-label="Novus Talent Company home">
          <Logo />
        </Link>

        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded text-ink md:hidden"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen(!open)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>

        <nav
          id="main-nav"
          aria-label="Main"
          className={`${open ? "block" : "hidden"} absolute inset-x-0 top-full z-40 border-b border-sand bg-cream px-4 pb-4 md:static md:block md:border-0 md:p-0`}
        >
          <ul className="flex flex-col gap-1 md:flex-row md:items-center md:gap-6">
            {mainNav.map((item) => {
              const current = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    className={`flex min-h-11 items-center rounded px-2 font-medium hover:text-action md:px-0 ${current ? "text-action" : "text-ink"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-2 md:mt-0">
              <Link
                href="/login"
                className="flex min-h-11 items-center justify-center rounded-md bg-action px-5 font-semibold text-cream hover:bg-ink"
              >
                Log in
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
