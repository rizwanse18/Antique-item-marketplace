import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignInForm } from "@/components/auth/AuthForms";
import { getCurrentUser } from "@/lib/current-user";

export const metadata = { title: "Sign In" };
export const instant = false;

export default async function SignInPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your account"
      subtitle="Access your watchlist, active bids and consignor dashboard."
    >
      <SignInForm />
    </AuthLayout>
  );
}