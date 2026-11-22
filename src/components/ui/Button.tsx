import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "solid" | "outline" | "on-dark";

// Solid = main action. Outline = second action. Max 2 buttons per section.
const variants: Record<Variant, string> = {
  solid: "bg-action text-cream border-2 border-action hover:bg-ink hover:border-ink",
  outline: "bg-cream text-action border-2 border-action hover:bg-action hover:text-cream",
  "on-dark": "bg-cream text-deep-olive border-2 border-cream hover:bg-sand hover:border-sand",
};

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-6 text-base font-semibold " +
  "transition-colors duration-150 active:translate-y-px " +
  "disabled:cursor-not-allowed aria-disabled:cursor-not-allowed";

export function buttonClass(variant: Variant = "solid", extra = "") {
  return `${base} ${variants[variant]} ${extra}`;
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; loading?: boolean };

export function Button({ variant = "solid", loading, disabled, children, className = "", ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonClass(variant, `${disabled ? "opacity-60" : loading ? "cursor-wait" : ""} ${className}`)}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; children: ReactNode };

export function ButtonLink({ variant = "solid", className = "", ...rest }: ButtonLinkProps) {
  return <Link {...rest} className={buttonClass(variant, className)} />;
}

function Spinner() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
