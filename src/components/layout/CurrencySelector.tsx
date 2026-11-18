"use client";
import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

const CURRENCIES = ["USD", "PKR", "GBP", "EUR", "AED"];

export function CurrencySelector() {
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    const saved = localStorage.getItem("selectedCurrency");
    if (saved) {
      setCurrency(saved);
      return;
    }

    // Auto-detect based on browser timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      let detected = "USD";
      
      if (tz.includes("Karachi") || tz.includes("Asia/Karachi")) detected = "PKR";
      else if (tz.includes("London") || tz.includes("Europe/London")) detected = "GBP";
      else if (tz.includes("Europe/")) detected = "EUR";
      else if (tz.includes("Dubai") || tz.includes("Asia/Dubai")) detected = "AED";
      
      setCurrency(detected);
      localStorage.setItem("selectedCurrency", detected);
      // Refresh prices
      window.dispatchEvent(new Event("currencyChanged"));
    } catch(e) {}
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    setCurrency(newCurrency);
    localStorage.setItem("selectedCurrency", newCurrency);
    window.location.reload(); 
  };

  return (
    <div className="flex items-center gap-1 text-white/80 hover:text-white">
      <Globe className="h-4 w-4" />
      <select
        value={currency}
        onChange={handleChange}
        className="bg-transparent text-[12px] font-semibold outline-none cursor-pointer appearance-none"
      >
        {CURRENCIES.map((c) => (
          <option key={c} value={c} className="text-ink">
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}