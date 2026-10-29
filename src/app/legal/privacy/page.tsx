import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Privacy Policy" };
export const instant = false;

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      updated="October 2026"
      intro="This policy explains what personal data we collect, how we use it, and the rights you have over your information."
    >
      <h2>1. Data we collect</h2>
      <ul>
        <li><strong>Account data:</strong> name, email address, password (hashed), profile photo if uploaded.</li>
        <li><strong>Transaction data:</strong> shipping address, order history, bids placed, messages sent.</li>
        <li><strong>Seller data:</strong> business name, description, verification documents if provided.</li>
        <li><strong>Technical data:</strong> IP address, browser, device type, pages visited.</li>
        <li><strong>Cookies:</strong> session cookies for sign-in state, plus preferences.</li>
      </ul>

      <h2>2. How we use it</h2>
      <ul>
        <li>To provide the marketplace, process orders, and manage bids.</li>
        <li>To send transactional emails (order confirmations, outbid alerts).</li>
        <li>To detect fraud and prevent misuse of the platform.</li>
        <li>To comply with legal obligations (tax, customs, anti-money-laundering).</li>
      </ul>

      <h2>3. Who sees your data</h2>
      <p>
        <strong>Other users:</strong> your name, profile, seller description, and
        listing content are public. Your email address and shipping address are
        never shown publicly.
      </p>
      <p>
        <strong>Sellers:</strong> when you purchase an item, the seller sees your
        name, shipping address, and any message you sent. They do not see your
        email or payment details.
      </p>
      <p>
        <strong>Service providers:</strong> we share limited data with payment
        processors, email delivery services, and cloud hosting, each bound by
        contractual confidentiality.
      </p>
      <p>
        <strong>Law enforcement:</strong> when legally compelled, we disclose data
        to the extent required.
      </p>

      <h2>4. Your rights</h2>
      <ul>
        <li>Access your personal data and receive a copy.</li>
        <li>Correct inaccurate data.</li>
        <li>Request deletion of your account and personal data.</li>
        <li>Object to certain processing.</li>
        <li>Withdraw consent at any time.</li>
      </ul>

      <h2>5. Retention</h2>
      <p>
        We retain account data while your account is active and for a limited
        period afterwards as required for legal and tax purposes (typically six
        years). Transaction records are retained as legally required.
      </p>

      <h2>6. Security</h2>
      <p>
        Passwords are hashed with bcrypt. Sessions are signed cookies with
        HTTP-only and SameSite protections. All traffic is served over TLS.
      </p>

      <h2>7. Children</h2>
      <p>
        ANTIQUA is not intended for users under 18. We do not knowingly collect
        data from children.
      </p>

      <h2>8. Contact</h2>
      <p>
        For privacy questions or to exercise your rights, email{" "}
        <a href="mailto:privacy@antiqua.example.com" className="text-gold-dk underline">
          privacy@antiqua.example.com
        </a>
        .
      </p>
    </LegalPage>
  );
}