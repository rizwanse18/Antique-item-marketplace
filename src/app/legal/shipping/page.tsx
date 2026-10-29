import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Shipping Policy" };
export const instant = false;

export default function ShippingPage() {
  return (
    <LegalPage
      eyebrow="Delivery"
      title="Shipping Policy"
      updated="October 2026"
      intro="Shipping antiques safely is part of the value of the marketplace. Sellers ship; ANTIQUA sets the standards."
    >
      <h2>1. Who ships</h2>
      <p>
        Sellers ship every lot directly to the buyer. ANTIQUA facilitates
        tracking and dispute resolution but does not operate a warehouse.
      </p>

      <h2>2. Shipping timelines</h2>
      <ul>
        <li>Sellers must dispatch within 3 business days of cleared payment.</li>
        <li>Tracking numbers must be uploaded to the order page immediately.</li>
        <li>International shipments must comply with export/import regulations.</li>
      </ul>

      <h2>3. Cost</h2>
      <p>
        Shipping cost is disclosed on each lot page. Some sellers include
        shipping in the price; others add it separately. The exact amount is
        always shown before you complete checkout.
      </p>

      <h2>4. Insurance</h2>
      <p>
        All shipments must be insured for the full purchase price. Losses
        during transit are the seller&rsquo;s responsibility to claim with the carrier
        — buyers receive a full refund or replacement.
      </p>

      <h2>5. Packaging</h2>
      <p>
        Antiques require professional packing. Sellers are expected to use
        double-boxed packaging, corner protection, and appropriate cushioning.
        Fragile items (ceramics, glass, marble) should use crating services above
        $2,500 in value.
      </p>

      <h2>6. Carriers</h2>
      <p>
        Sellers choose the carrier but must use one that offers tracking and
        insurance. For high-value items, ANTIQUA recommends specialist art
        couriers — Crozier, Gander &amp; White, or comparable.
      </p>

      <h2>7. International</h2>
      <p>
        Buyers are responsible for any import duties, VAT, GST, or customs
        clearance fees. Sellers must accurately declare contents and value for
        customs — misdeclaration is grounds for account suspension.
      </p>

      <h2>8. Lost or damaged packages</h2>
      <ol>
        <li>Buyer reports the issue via the order page within 48 hours of the delivery estimate.</li>
        <li>Seller opens a claim with the carrier and uploads claim reference.</li>
        <li>If unrecovered in 21 days, ANTIQUA refunds the buyer and pursues the seller&rsquo;s claim separately.</li>
      </ol>

      <h2>9. Undeliverable addresses</h2>
      <p>
        If a shipment is returned due to an incorrect address supplied by the
        buyer, the buyer is responsible for re-shipment costs. If the seller
        mis-addressed the package, the seller bears re-shipment costs.
      </p>
    </LegalPage>
  );
}