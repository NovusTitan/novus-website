"use client";

import { useState } from "react";
import { LogInForm, SignUpForm } from "./AuthForms";

// Sign up or log in, in one place (used in step 1 of applying).
export function AuthPanel({ next, start = "signup" }: { next: string; start?: "signup" | "login" }) {
  const [mode, setMode] = useState(start);
  const toggle = "font-semibold text-action underline underline-offset-4 hover:text-ink min-h-11 inline-flex items-center";

  return mode === "signup" ? (
    <div>
      <SignUpForm next={next} />
      <p className="mt-6">
        Already have an account?{" "}
        <button type="button" className={toggle} onClick={() => setMode("login")}>
          Log in
        </button>
      </p>
    </div>
  ) : (
    <div>
      <LogInForm next={next} />
      <p className="mt-6">
        New to Novus?{" "}
        <button type="button" className={toggle} onClick={() => setMode("signup")}>
          Create an account
        </button>
      </p>
    </div>
  );
}
