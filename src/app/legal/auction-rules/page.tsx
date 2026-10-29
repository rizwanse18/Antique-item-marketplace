import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Auction Rules" };
export const instant = false;

export default function AuctionRulesPage() {
  return (
    <LegalPage
      eyebrow="Live Auctions"
      title="Auction Rules"
      updated="October 2026"
      intro="Every bid on ANTIQUA is a binding offer. These rules ensure fair, transparent, server-authoritative auctions for everyone."
    >
      <h2>1. Bids are binding</h2>
      <p>
        When you place a bid, you are committing to purchase the lot at that
        price if you win. Retracting a bid is not permitted except in cases of
        documented seller misrepresentation.
      </p>

      <h2>2. Bid increments</h2>
      <p>
        Each lot has a minimum bid increment — typically 5% of the current bid,
        with a $10 minimum. The exact next-bid amount is always displayed in the
        bid form.
      </p>

      <h2>3. Anti-sniping</h2>
      <p>
        If a bid is placed in the final 60 seconds of an auction, the auction
        is automatically extended by an additional 60 seconds. Extensions
        continue as long as bids keep arriving. This ensures every bidder has
        the opportunity to respond.
      </p>

      <h2>4. Server-authoritative validation</h2>
      <p>
        Every bid is validated server-side at the moment it is received. Client
        information is never trusted. Two users placing bids at the same instant
        are resolved by the database transaction — one bid succeeds, the other
        returns a clear error.
      </p>

      <h2>5. Auction states</h2>
      <ul>
        <li><strong>Live:</strong> bids are accepted.</li>
        <li><strong>Ending soon:</strong> less than 1 hour remains.</li>
        <li><strong>Ended:</strong> the time has passed; bids no longer accepted.</li>
        <li><strong>Sold:</strong> winning bidder identified and notified.</li>
        <li><strong>Unsold:</strong> ended with no bids or all bids below reserve.</li>
      </ul>

      <h2>6. Payment window</h2>
      <p>
        Winning bidders must complete payment within 48 hours of auction close.
        Non-payment results in a cancellation, negative feedback on the account,
        and possible suspension after repeat occurrences.
      </p>

      <h2>7. Reserve prices</h2>
      <p>
        Where a lot has a reserve price, bidding will not be considered a
        winning bid unless the reserve is met. Reserve prices are disclosed as
        &ldquo;Reserve not met&rdquo; throughout the auction.
      </p>

      <h2>8. Withdrawals</h2>
      <p>
        Sellers may withdraw a lot only in documented circumstances (provenance
        discovery, legal restriction, force majeure). Bidders who have placed
        bids on a withdrawn lot are notified immediately and their bids voided.
      </p>

      <h2>9. Bidder identity</h2>
      <p>
        Bid history is displayed with anonymised first names to protect privacy.
        The winning bidder&rsquo;s full details are shared only with the seller.
      </p>

      <h2>10. System failures</h2>
      <p>
        If an auction is materially affected by a technical failure, ANTIQUA may
        extend the auction or declare it void, notifying all bidders. All valid
        bids are preserved and honoured where possible.
      </p>
    </LegalPage>
  );
}