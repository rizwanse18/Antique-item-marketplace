import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Terms of Service" };
export const instant = false;

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      updated="October 2026"
      intro="These Terms govern your access to and use of ANTIQUA. By creating an account or using our services you agree to be bound by them."
    >
      <h2>1. About ANTIQUA</h2>
      <p>
        ANTIQUA is an international online marketplace connecting buyers and
        sellers of authenticated antiques, fine art, rare collectibles, and
        historical objects. We provide the platform, the auction infrastructure,
        and the dispute-resolution process. We are not the seller of any item
        listed on the platform.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years of age and legally capable of entering into
        binding contracts to use ANTIQUA. By using the platform, you represent
        that all information you provide is accurate and current.
      </p>

      <h2>3. Account Responsibilities</h2>
      <ul>
        <li>Keep your login credentials confidential.</li>
        <li>You are responsible for all activity under your account.</li>
        <li>Notify us immediately of any unauthorised use.</li>
        <li>One account per individual or legal entity unless agreed otherwise.</li>
      </ul>

      <h2>4. Buying</h2>
      <p>
        Placing a bid is a binding offer to purchase the lot at that price if you
        are the winning bidder. Winning bidders must complete payment within 48
        hours of auction close. Fixed-price purchases are binding once payment
        is confirmed. See our <a href="/legal/auction-rules" className="text-gold-dk underline">Auction Rules</a>.
      </p>

      <h2>5. Selling</h2>
      <p>
        Sellers must complete identity verification, accurately describe every
        lot, disclose known faults and restorations, and provide clear provenance
        where possible. Sellers guarantee they have legal title to the items they
        consign. See our <a href="/legal/seller-guidelines" className="text-gold-dk underline">Seller Guidelines</a>.
      </p>

      <h2>6. Fees</h2>
      <p>
        Sellers pay a commission of 8% of the final sale price. Buyers may pay a
        buyer&rsquo;s premium where disclosed on the lot page. All fees are shown before
        you commit to a transaction.
      </p>

      <h2>7. Prohibited Items</h2>
      <p>
        Certain items may not be listed. These include stolen goods, counterfeit
        items, illegally exported cultural heritage, weapons regulated by law,
        and any object whose sale would violate applicable export, import or
        customs regulations. See our <a href="/legal/prohibited" className="text-gold-dk underline">Prohibited Items</a> page.
      </p>

      <h2>8. Disputes</h2>
      <p>
        Buyers and sellers agree to attempt resolution in good faith. If that
        fails, ANTIQUA&rsquo;s mediation team will review the evidence and issue a
        determination. Determinations are binding for transactions processed
        through our checkout. See <a href="/legal/buyer-protection" className="text-gold-dk underline">Buyer Protection</a>.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, ANTIQUA&rsquo;s total liability arising
        out of any claim is limited to the amount you paid for the transaction
        giving rise to the claim. We are not liable for indirect, incidental or
        consequential losses.
      </p>

      <h2>10. Suspension & Termination</h2>
      <p>
        We may suspend or terminate accounts that violate these Terms, engage in
        fraudulent conduct, repeatedly misrepresent items, or pose risk to other
        users.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update these Terms from time to time. Material changes will be
        announced in advance. Continued use of the platform after the changes
        take effect constitutes acceptance.
      </p>

      <h2>12. Governing Law</h2>
      <p>
        These Terms are governed by the laws of England and Wales. Disputes not
        resolved through our mediation process will be subject to the exclusive
        jurisdiction of the courts of England and Wales.
      </p>
    </LegalPage>
  );
}