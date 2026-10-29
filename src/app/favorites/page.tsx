import Link from "next/link";
import { Heart } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ItemCard } from "@/components/marketplace/ItemCard";
import { getMyFavoriteItems } from "@/lib/favorites";
import { getCurrentUser } from "@/lib/current-user";

export const metadata = { title: "Watchlist" };
export const instant = false;

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  const items = user ? await getMyFavoriteItems() : [];

  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-paper to-cream py-11">
        <Container>
          <p className="eyebrow">Your Collection</p>
          <h1 className="mt-2.5 text-4xl md:text-5xl">Watchlist</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted">
            Lots you are tracking. We will alert you before they close.
          </p>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          {!user ? (
            <div className="mx-auto max-w-md rounded-md border border-dashed border-line-2 bg-paper/60 px-6 py-16 text-center">
              <Heart className="mx-auto h-10 w-10 text-line-2" />
              <p className="mt-5 font-display text-2xl">Sign in to view your watchlist</p>
              <p className="mt-2 text-sm text-muted">
                Track lots and receive alerts before they close.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link href="/sign-in"><Button variant="gold">Sign In</Button></Link>
                <Link href="/sign-up"><Button variant="outline">Create Account</Button></Link>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="mx-auto max-w-md rounded-md border border-dashed border-line-2 bg-paper/60 px-6 py-16 text-center">
              <Heart className="mx-auto h-10 w-10 text-line-2" />
              <p className="mt-5 font-display text-2xl">Your watchlist is empty</p>
              <p className="mt-2 text-sm text-muted">
                Tap the heart on any lot to track it here.
              </p>
              <div className="mt-6">
                <Link href="/discover"><Button variant="gold">Browse lots</Button></Link>
              </div>
            </div>
          ) : (
            <>
              <p className="mb-6 text-xs text-muted">
                <span className="font-semibold text-ink">{items.length}</span>{" "}
                lot{items.length === 1 ? "" : "s"} in your watchlist
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} isFavorited />
                ))}
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  );
}