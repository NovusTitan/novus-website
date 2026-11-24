"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type RequestState = {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
  done?: boolean;
};

const schema = z.object({
  company: z.string().min(2, "Add your company name.").max(200),
  contact_name: z.string().min(2, "Add your name.").max(120),
  email: z.email("Enter a full email, like name@company.com."),
  phone: z
    .string()
    .max(30, "That phone number is too long.")
    .refine((v) => v === "" || v.replace(/\D/g, "").length >= 10, "Enter a phone number with area code."),
  roles: z.string().min(2, "Tell us which roles you're hiring for.").max(2000, "Keep this under 2,000 characters."),
  location: z.string().max(200),
});

const FIELDS = ["company", "contact_name", "email", "phone", "roles", "location"] as const;

export async function submitSearchRequest(_prev: RequestState, fd: FormData): Promise<RequestState> {
  // Honeypot: real people never see or fill this field.
  if (String(fd.get("website") ?? "") !== "") return { done: true };

  const values = Object.fromEntries(FIELDS.map((k) => [k, String(fd.get(k) ?? "").trim()]));
  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const i of parsed.error.issues) fieldErrors[String(i.path[0])] ??= i.message;
    return { fieldErrors, values };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("search_requests").insert(parsed.data);
  if (error) return { error: "We couldn't send your request. Please try again, or call us.", values };
  return { done: true };
}
