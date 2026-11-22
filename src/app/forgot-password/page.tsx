import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/AuthForms";
import { Narrow } from "@/components/layout/Narrow";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <Narrow title="Reset your password" intro="Enter the email you signed up with and we'll send you a link to set a new password.">
      <ForgotPasswordForm />
    </Narrow>
  );
}
