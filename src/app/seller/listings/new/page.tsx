import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { NewListingForm } from "@/components/seller/NewListingForm";
import { getCurrentUser } from "@/lib/current-user";
import { getSellerProfileForCurrentUser } from "@/lib/seller";
import { CATEGORIES } from "@/lib/mock-data";

export const metadata = { title: "New Listing" };
export const instant = false;

export default async function NewListingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/seller/listings/new");
  const profile = await getSellerProfileForCurrentUser();
  if (!profile) redirect("/seller/onboarding");

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-paper to-cream py-11">
        <Container>
          <p className="eyebrow">Seller Dashboard</p>
          <h1 className="mt-2.5 text-4xl md:text-5xl">New Listing</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">Provide accurate provenance and condition details.</p>
        </Container>
      </section>
      <section className="py-12">
        <Container>
          <div className="max-w-3xl"><NewListingForm categories={CATEGORIES} /></div>
        </Container>
      </section>
    </>
  );
}