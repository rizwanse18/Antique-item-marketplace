import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Authenticity Guidelines" };
export const instant = false;

export default function AuthenticityPage() {
  return (
    <LegalPage
      eyebrow="Trust & Safety"
      title="Authenticity Guidelines"
      updated="October 2026"
      intro="Authenticity is the heart of the antique trade. Here is how ANTIQUA approaches it — and what sellers and buyers should expect."
    >
      <h2>Our philosophy</h2>
      <p>
        We are a platform, not an authenticator. We do not physically inspect
        every item listed. What we do is:
      </p>
      <ul>
        <li>Require sellers to attest to their items&rsquo; provenance and description accuracy.</li>
        <li>Verify sellers&rsquo; identity and business history.</li>
        <li>Provide tools for sellers to share provenance, certificates, and appraisals.</li>
        <li>Enforce disclosure of known restorations, repairs, and later modifications.</li>
        <li>Offer a dispute process when a buyer believes an item is not as described.</li>
      </ul>

      <h2>Documentation types</h2>
      <ul>
        <li><strong>Certificate of authenticity:</strong> typically from a gallery, auction house, or expert.</li>
        <li><strong>Provenance:</strong> history of ownership, ideally with auction records, receipts, or family documents.</li>
        <li><strong>Condition report:</strong> written description of the item&rsquo;s current state including flaws.</li>
        <li><strong>Appraisal:</strong> an independent value assessment, often for insurance purposes.</li>
      </ul>

      <h2>Authenticity status labels</h2>
      <p>
        Listings may carry one or more of these labels. They mean:
      </p>
      <ul>
        <li><strong>Seller Verified:</strong> the seller&rsquo;s identity and track record have been checked.</li>
        <li><strong>Documentation Provided:</strong> the seller has uploaded supporting papers.</li>
        <li><strong>Expert Verified:</strong> an independent expert has reviewed the item.</li>
        <li><strong>Provenance Available:</strong> ownership history is documented.</li>
        <li><strong>Not Verified:</strong> none of the above — buy with extra caution.</li>
      </ul>

      <h2>What we do not guarantee</h2>
      <p>
        ANTIQUA does not guarantee that any item is authentic unless a listing
        explicitly says <em>Expert Verified</em> with a named expert. Attribution
        and dating are the seller&rsquo;s responsibility. Buyers should do their own
        due diligence for significant purchases.
      </p>

      <h2>If you suspect a fake</h2>
      <p>
        Do not confront the seller. Report the listing and provide evidence
        (images, references, expert opinions). Our trust team investigates
        within 5 business days. Confirmed counterfeits are removed and the
        seller may be suspended.
      </p>

      <h2>For sellers</h2>
      <ul>
        <li>Disclose all known restorations.</li>
        <li>State attribution clearly — &ldquo;Attributed to&rdquo;, &ldquo;After&rdquo;, &ldquo;In the manner of&rdquo; mean something.</li>
        <li>Provide provenance where possible; it increases value and trust.</li>
        <li>Never describe an item as authentic if you have doubts.</li>
      </ul>
    </LegalPage>
  );
}