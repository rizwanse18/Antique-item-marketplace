import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Seller Guidelines" };
export const instant = false;

export default function SellerGuidelinesPage() {
  return (
    <LegalPage
      eyebrow="For Sellers"
      title="Seller Guidelines"
      updated="October 2026"
      intro="These guidelines help maintain the quality and trust of the ANTIQUA marketplace. Following them protects both your reputation and your buyers."
    >
      <h2>1. Eligibility</h2>
      <ul>
        <li>You must complete identity verification before listing.</li>
        <li>You may represent yourself as an individual, business, or estate.</li>
        <li>You must have legal title to every item you consign.</li>
      </ul>

      <h2>2. Listing quality</h2>
      <ul>
        <li>Provide <strong>at least one clear, well-lit photo</strong> — preferably 6+ showing front, back, sides, close-ups, maker marks, and any damage.</li>
        <li>Write a factual, detailed description. Disclose all known imperfections.</li>
        <li>State the period, origin, and materials as accurately as you can.</li>
        <li>Include provenance and any documentation you have.</li>
      </ul>

      <h2>3. Prohibited conduct</h2>
      <ul>
        <li>Do not list reproductions or restorations as original antiques.</li>
        <li>Do not use stock photos or images from other sellers.</li>
        <li>Do not bid on your own listings or use shill accounts.</li>
        <li>Do not cancel auctions after a winning bid except in documented emergencies.</li>
      </ul>

      <h2>4. Pricing</h2>
      <p>
        Starting bids and buy-now prices are your decision. ANTIQUA takes an 8%
        commission on final sale price. Buyers may see a buyer&rsquo;s premium where
        disclosed. There are no listing fees.
      </p>

      <h2>5. Shipping obligations</h2>
      <ul>
        <li>Ship within 3 business days of payment.</li>
        <li>Use tracked, insured shipping appropriate to the item&rsquo;s value.</li>
        <li>Pack antiques to a professional standard — a broken antique is a broken reputation.</li>
        <li>Upload tracking numbers promptly so buyers can follow delivery.</li>
      </ul>

      <h2>6. Communication</h2>
      <ul>
        <li>Respond to buyer messages within 48 hours.</li>
        <li>Be honest and professional. Disclose issues proactively.</li>
        <li>Never ask buyers to move the transaction off-platform — it voids their protection.</li>
      </ul>

      <h2>7. Payouts</h2>
      <p>
        Seller proceeds are held in escrow for 14 days after the buyer confirms
        delivery (or 21 days after dispatch if delivery is not confirmed). After
        that window, funds are released to your bank account on file.
      </p>

      <h2>8. Seller tiers</h2>
      <ul>
        <li><strong>New seller:</strong> account created, verification pending.</li>
        <li><strong>Verified:</strong> identity checked, can list and sell.</li>
        <li><strong>Featured:</strong> track record of high-quality listings and 50+ sales; priority support and featured placement eligibility.</li>
      </ul>
    </LegalPage>
  );
}