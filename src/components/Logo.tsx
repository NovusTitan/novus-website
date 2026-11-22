// Text lockup for now. When the logo files land in /public/brand,
// swap this for <Image src="/brand/..." alt="Novus Talent Company" />.
export function Logo() {
  return (
    <span className="flex items-center gap-2 font-semibold tracking-wide text-ink">
      <span className="text-xl">NOVUS</span>
      <span aria-hidden="true" className="h-5 w-px bg-brand" />
      <span className="text-[0.7rem] leading-tight text-ink-soft sm:text-xs">
        INFRASTRUCTURE TALENT
      </span>
    </span>
  );
}
