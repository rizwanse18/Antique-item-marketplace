import { getCurrentUser } from "@/lib/current-user";
import { HeaderClient } from "./HeaderClient";

export async function Header() {
  const user = await getCurrentUser();
  return <HeaderClient user={user} />;
}