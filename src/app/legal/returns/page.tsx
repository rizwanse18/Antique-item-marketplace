import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Return Policy" };
export const instant = false;

export default function ReturnsPage() {
  return (
    <LegalPage
      eyebrow="Returns"
      title="Return Policy"
      updated="October 2026"
      intro="Antiques are one-of-a-kind. Returns are limited to materially misdescribed lots, and follow a simple, fair process."
    >
      <h2>1. What can be returned</h2>
      <p>
        You may return an item if it materially misrepresents its description.
        &ldquo;Materially&rdquo; means a reasonable buyer would have bid differently had
        the accurate condition been known. Examples:
      </p>
      <ul>
        <li>Item is a reproduction, not as described.</li>
        <li>Significant damage not disclosed in the condition report.</li>
        <li>Maker attribution incorrect.</li>
        <li>Material or dimensions materially different from the listing.</li>
      </ul>

      <h2>2. What cannot be returned</h2>
      <ul>
        <li>Buyer&rsquo;s remorse (you changed your mind).</li>
        <li>Damage caused after delivery.</li>
        <li>Normal wear consistent with the stated age and condition.</li>
        <li>Items that were accurately described with photos of the imperfection.</li>
        <li>Custom or commissioned pieces.</li>
      </ul>

      <h2>3. The 14-day window</h2>
      <p>
        Buyers must open a return within 14 days of receiving the item. After
        14 days, returns are not accepted.
      </p>

      <h2>4. Process</h2>
      <ol>
        <li>Message the seller via <a href="/messages" className="text-gold-dk underline">Messages</a> describing the issue with photos.</li>
        <li>If the seller agrees, they&rsquo;ll provide return shipping instructions.</li>
        <li>If unresolved in 7 days, escalate to ANTIQUA through <a href="/legal/contact" className="text-gold-dk underline">Contact</a>.</li>
        <li>Our team reviews and issues a determination within 5 business days.</li>
      </ol>

      <h2>5. Who pays for shipping</h2>
      <ul>
        <li>If the item was misdescribed: seller pays return shipping and refunds original shipping.</li>
        <li>If the item arrived damaged: seller pays and pursues the carrier claim.</li>
        <li>If the buyer simply changed their mind: no return accepted.</li>
      </ul>

      <h2>6. Refund timeline</h2>
      <p>
        Refunds are issued within 5 business days of the returned item being
        received by the seller in its original condition. Refunds go to the
        original payment method.
      </p>

      <h2>7. Condition on return</h2>
      <p>
        Returned items must arrive in the same condition they were shipped.
        Items returned damaged may have a partial refund deducted at the
        mediator&rsquo;s discretion.
      </p>
    </LegalPage>
  );
}