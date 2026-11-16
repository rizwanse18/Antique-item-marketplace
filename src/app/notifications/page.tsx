import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/current-user";
import { getMyNotifications } from "@/lib/notifications";
import { Container } from "@/components/ui/Container";
import { NotificationsClient } from "./NotificationsClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Notifications | ANTIQUA",
  description: "Your bids, auctions and order updates.",
};

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const { items, unread } = await getMyNotifications(100);

  return (
    <main className="min-h-[calc(100vh-74px)] bg-[#f7f3ec] py-10">
      <Container>
        <NotificationsClient initialItems={items} initialUnread={unread} />
      </Container>
    </main>
  );
}