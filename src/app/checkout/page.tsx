import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { MultiCheckoutForm } from "@/components/cart/MultiCheckoutForm";
import { getCurrentUser } from "@/lib/current-user";

export const metadata = { title: "Checkout" };
export const instant = false;

export default async function MultiCheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/checkout");

  return (
    <section className="py-12">
      <Container>
        <div className="mb-8">
          <p className="eyebrow">Secure Checkout</p>
          <h1 className="mt-2.5 text-3xl md:text-4xl">Complete your order</h1>
        </div>
        <MultiCheckoutForm defaultName={user.name} defaultEmail={user.email} />
      </Container>
    </section>
  );
}