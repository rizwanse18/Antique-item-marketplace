import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignUpForm } from "@/components/auth/AuthForms";
import { getCurrentUser } from "@/lib/current-user";

export const metadata = { title: "Create Account" };
export const instant = false;

export default async function SignUpPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <AuthLayout
      eyebrow="Join ANTIQUA"
      title="Create your account"
      subtitle="Free to join. Track lots, bid live, and consign worldwide."
    >
      <SignUpForm />
    </AuthLayout>
  );
}