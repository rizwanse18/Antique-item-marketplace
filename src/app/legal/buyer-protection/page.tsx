import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Buyer Protection" };
export const instant = false;

export default function BuyerProtectionPage() {
  return (
    <LegalPage
      eyebrow="Trust & Safety"
      title="Buyer Protection"
      updated="October 2026"
      intro="Every purchase through ANTIQUA checkout is protected. If an item arrives materially different from its description, we will help you make it right."
    >
      <h2>What is covered</h2>
      <ul>
        <li>The item was never delivered.</li>
        <li>The item arrived damaged beyond what the condition report described.</li>
        <li>The item is materially different from its description or photos.</li>
        <li>The item is counterfeit — not authentic as described.</li>
        <li>The item was returned and the seller refuses the refund.</li>
      </ul>

      <h2>What is not covered</h2>
      <ul>
        <li>Buyer&rsquo;s remorse — you simply changed your mind.</li>
        <li>Normal wear consistent with the stated condition.</li>
        <li>Damage caused by shipping when insurance has already been claimed.</li>
        <li>Purchases made outside ANTIQUA checkout (private deals).</li>
        <li>Disputes about an item that was accurately described with photos.</li>
      </ul>

      <h2>How to open a case</h2>
      <ol>
        <li>Contact the seller directly via messages within 14 days of receipt.</li>
        <li>If unresolved in 7 days, message ANTIQUA through our <a href="/legal/contact" className="text-gold-dk underline">contact form</a>.</li>
        <li>Provide the order ID, photos of the item as received, and the original listing description.</li>
        <li>Our mediation team reviews within 5 business days.</li>
        <li>If the claim is upheld, we will arrange return shipping and full refund including original shipping.</li>
      </ol>

      <h2>Payout protection</h2>
      <p>
        Seller funds from completed sales are held in escrow for 14 days after
        delivery confirmation. During that window, the buyer may open a case.
        After the window closes, funds are released to the seller.
      </p>

      <h2>Refund timeline</h2>
      <p>
        Once a refund is approved, it is issued to the original payment method
        within 5 business days. Actual credit to your account depends on your
        bank or card issuer.
      </p>

      <h2>Limits</h2>
      <p>
        Buyer Protection is available on transactions where the buyer used
        ANTIQUA checkout. There is a lifetime cap of $25,000 per buyer per year
        for protection claims. Higher-value transactions may require additional
        due diligence before purchase.
      </p>
    </LegalPage>
  );
}