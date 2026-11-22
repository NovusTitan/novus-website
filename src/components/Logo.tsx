import Image from "next/image";

// Logo files: /public/brand (originals from the brand kit).
// The site uses tightly cropped copies in /public/brand/site so the logo isn't
// shrunk by the kit's built-in padding. Same artwork, viewBox only.
//
// Header: "novus" wordmark on small screens, full NOVUS | INFRASTRUCTURE TALENT lockup on large.
// Dark backgrounds use the white lockup.

const ALT = "Novus Infrastructure Talent";
const LOCKUP_RATIO = 2473 / 277;
const WORDMARK_RATIO = 1297 / 277;

export function Logo({ tone = "light" }: { tone?: "light" | "dark" }) {
  if (tone === "dark") {
    const h = 34;
    return (
      <Image src="/brand/site/lockup-horizontal-white.svg" alt={ALT} width={Math.round(h * LOCKUP_RATIO)} height={h} unoptimized />
    );
  }

  return (
    <>
      <Image
        src="/brand/site/wordmark-orange.svg"
        alt={ALT}
        width={Math.round(28 * WORDMARK_RATIO)}
        height={28}
        unoptimized
        priority
        className="h-7 w-auto lg:hidden"
      />
      <Image
        src="/brand/site/lockup-horizontal-orange.svg"
        alt={ALT}
        width={Math.round(34 * LOCKUP_RATIO)}
        height={34}
        unoptimized
        priority
        className="hidden h-[34px] w-auto lg:block"
      />
    </>
  );
}
