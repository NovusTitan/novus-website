"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Logo } from "./Logo";
import { buttonClass } from "./ui/Button";
import { contactLink, loginLink, mainNav, site } from "@/lib/site";

// Header: 5 items max (4 links + Contact button), sticky, simple mobile menu.
// On phones the Contact button and phone number stay visible next to the menu button.
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Close the mobile menu on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-chip bg-cream">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2">
        <Link href="/" className="flex min-h-11 items-center rounded" onClick={close}>
          <Logo />
          <span className="sr-only"> home</span>
        </Link>

        {/* Phone-only quick actions: call + menu */}
        <div className="flex items-center gap-1 md:hidden">
          <a
            href={`tel:${site.phone.tel}`}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded text-action"
            aria-label={`Call Novus at ${site.phone.display}`}
          >
            <PhoneIcon />
          </a>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded text-ink"
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen(!open)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>

        <nav
          id="main-nav"
          aria-label="Main"
          className={`${open ? "block" : "hidden"} absolute inset-x-0 top-full border-b border-chip bg-cream px-4 pb-4 md:static md:block md:border-0 md:p-0`}
        >
          {/* The current-page highlight needs the URL, which streams in; the links work before it does. */}
          <Suspense fallback={<NavItems pathname="" onNavigate={close} />}>
            <NavItemsForCurrentPage onNavigate={close} />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}

function NavItemsForCurrentPage({ onNavigate }: { onNavigate: () => void }) {
  return <NavItems pathname={usePathname()} onNavigate={onNavigate} />;
}

function NavItems({ pathname, onNavigate }: { pathname: string; onNavigate: () => void }) {
  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const linkClass = (href: string) =>
    `flex min-h-11 items-center rounded px-2 font-medium transition-colors duration-150 hover:text-action md:px-0 ${
      isCurrent(href) ? "text-action" : "text-ink"
    }`;

  return (
    <ul className="flex flex-col gap-1 md:flex-row md:items-center md:gap-6">
      {mainNav.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            aria-current={isCurrent(item.href) ? "page" : undefined}
            className={linkClass(item.href)}
            onClick={onNavigate}
          >
            {item.label}
          </Link>
        </li>
      ))}
      {/* Log in lives in the footer on desktop; in the mobile menu it's here. */}
      <li className="md:hidden">
        <Link href={loginLink.href} className={linkClass(loginLink.href)} onClick={onNavigate}>
          {loginLink.label}
        </Link>
      </li>
      <li className="mt-2 md:mt-0">
        <Link href={contactLink.href} className={buttonClass("solid", "w-full min-h-11 px-5 md:w-auto")} onClick={onNavigate}>
          {contactLink.label}
        </Link>
      </li>
    </ul>
  );
}

function PhoneIcon() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}
