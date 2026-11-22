import { useId, type ComponentProps, type ReactNode } from "react";

// Every form control gets a visible label, optional hint, and an error message
// that's announced to screen readers. Big tap targets (48px tall).

const control =
  "block w-full min-h-12 rounded-md border-2 border-ink-soft bg-cream px-4 text-base text-ink " +
  "transition-colors duration-150 hover:border-ink focus:border-action focus-visible:outline-offset-0 " +
  "aria-invalid:border-action";

type Common = { label: string; hint?: string; error?: string; optional?: boolean };

function Wrapper({
  id, label, hint, error, optional, children,
}: Common & { id: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-semibold text-ink">
        {label}
        {optional && <span className="font-normal text-ink-soft"> (optional)</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-ink-soft">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="flex items-center gap-1.5 text-sm font-semibold text-action">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 7v6M12 17h.01" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, hint?: string, error?: string) {
  return [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
}

export function TextField({ label, hint, error, optional, ...rest }: Common & ComponentProps<"input">) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        id={id}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={control}
        {...rest}
      />
    </Wrapper>
  );
}

export function TextArea({ label, hint, error, optional, ...rest }: Common & ComponentProps<"textarea">) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} hint={hint} error={error} optional={optional}>
      <textarea
        id={id}
        rows={4}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={`${control} py-3`}
        {...rest}
      />
    </Wrapper>
  );
}

export function SelectField({
  label, hint, error, optional, children, ...rest
}: Common & ComponentProps<"select">) {
  const id = useId();
  return (
    <Wrapper id={id} label={label} hint={hint} error={error} optional={optional}>
      <select
        id={id}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, hint, error)}
        className={control}
        {...rest}
      >
        {children}
      </select>
    </Wrapper>
  );
}

export function Checkbox({ label, ...rest }: { label: ReactNode } & ComponentProps<"input">) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex min-h-11 cursor-pointer items-center gap-3 text-ink">
      <input id={id} type="checkbox" className="h-6 w-6 shrink-0 accent-action" {...rest} />
      <span>{label}</span>
    </label>
  );
}
