import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = { title: "Prohibited Items" };
export const instant = false;

export default function ProhibitedPage() {
  return (
    <LegalPage
      eyebrow="Trust & Safety"
      title="Prohibited Items"
      updated="October 2026"
      intro="Not every historical object can be legally or ethically sold. These items may not be listed on ANTIQUA."
    >
      <h2>Illegal & stolen goods</h2>
      <ul>
        <li>Items known or reasonably suspected to be stolen.</li>
        <li>Items obtained through fraud or misappropriation.</li>
        <li>Counterfeit or forged items, including fake signatures, marks, and certificates.</li>
      </ul>

      <h2>Cultural heritage & archaeology</h2>
      <ul>
        <li>Items illegally excavated or exported from their country of origin.</li>
        <li>Antiquities without documented export provenance from before 1970 (the UNESCO threshold).</li>
        <li>Native American, First Nations, and Aboriginal cultural items that fall under repatriation laws (NAGPRA, similar).</li>
        <li>Human remains, funerary objects, or sacred items.</li>
      </ul>

      <h2>Weapons & regulated items</h2>
      <ul>
        <li>Firearms, ammunition, and modern weapons.</li>
        <li>Firearms manufactured after 1898 unless you hold the required licences and comply with local law.</li>
        <li>Automatic weapons, silencers, and destructive devices.</li>
        <li>Knives and swords of historical interest are permitted unless they fall under restricted weapons law.</li>
      </ul>

      <h2>Wildlife & natural materials</h2>
      <ul>
        <li>Ivory — modern or antique (CITES regulations restrict trade).</li>
        <li>Rhinoceros horn, tortoiseshell, and other endangered species products.</li>
        <li>Taxidermy of protected species.</li>
      </ul>

      <h2>Hazardous materials</h2>
      <ul>
        <li>Items containing asbestos, mercury, or other regulated substances.</li>
        <li>Radioactive materials or items from nuclear or military installations.</li>
      </ul>

      <h2>Other restricted items</h2>
      <ul>
        <li>Currency and coins: permitted, but certain jurisdictions restrict trade. Check your local law.</li>
        <li>Postage stamps: permitted except where export controls apply.</li>
        <li>Nazi memorabilia: permitted for genuine historical interest in some jurisdictions, restricted in others (notably Germany, Austria, France).</li>
        <li>Human trophies or items intended to incite hate.</li>
      </ul>

      <h2>Reporting</h2>
      <p>
        If you see a listing that may violate these rules, please report it.
        Your report is confidential. Reach us at{" "}
        <a href="mailto:trust@antiqua.example.com" className="text-gold-dk underline">
          trust@antiqua.example.com
        </a>{" "}
        or use our <a href="/legal/contact" className="text-gold-dk underline">contact form</a>.
      </p>
    </LegalPage>
  );
}