import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { getSellerProfileForCurrentUser } from "@/lib/seller";

export const metadata = { title: "Sell an Item" };
export const instant = false;

export default async function SellPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?next=/sell");
  const profile = await getSellerProfileForCurrentUser();
  if (!profile) redirect("/seller/onboarding");
  redirect("/seller/listings/new");
}