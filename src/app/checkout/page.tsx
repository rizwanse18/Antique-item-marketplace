import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import CheckoutClient from "./CheckoutClient";

export const metadata = {
  title: "Secure Checkout | ANTIQUA",
};

export default async function CheckoutPage() {
  // SECURITY LOCK: Check if user is logged in
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in?redirect=/checkout");
  }

  return <CheckoutClient />;
}