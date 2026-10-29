import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { BecomeSellerForm } from "@/components/seller/BecomeSellerForm";
import { getCurrentUser } from "@/lib/current-user";
import { getSellerProfileForCurrentUser } from "@/lib/seller";

export const metadata = { title: "Become a Seller" };
export const instant = false;

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/seller/onboarding");
  const profile = await getSellerProfileForCurrentUser();
  if (profile) redirect("/seller");

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-paper to-cream py-11">
        <Container>
          <p className="eyebrow">Consign With ANTIQUA</p>
          <h1 className="mt-2.5 text-4xl md:text-5xl">Become a Seller</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Reach collectors in 128 countries. Complete this one-step setup to unlock your seller dashboard.
          </p>
        </Container>
      </section>
      <section className="py-12">
        <Container>
          <div className="max-w-xl">
            <BecomeSellerForm defaultName={user.name} />
          </div>
        </Container>
      </section>
    </>
  );
}