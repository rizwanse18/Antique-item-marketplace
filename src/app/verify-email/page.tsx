"use client";
import { useState, useTransition, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmailAction } from "@/app/actions/auth";

function VerifyForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await verifyEmailAction(email, code);
      if (res?.error) setError(res.error);
      else router.push("/dashboard");
    });
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-line bg-paper p-8 shadow-xl">
      <h1 className="font-display text-3xl font-semibold text-ink">Verify your email</h1>
      <p className="mt-2 text-sm text-muted">We sent a 6-digit code to <strong>{email}</strong></p>
      {error && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="000000"
          className="w-full rounded-md border border-line p-3 text-center text-2xl tracking-[0.5em] focus:border-gold focus:outline-none"
          maxLength={6}
        />
        <button type="submit" disabled={isPending || code.length < 6} className="w-full rounded-md bg-gold py-3 font-semibold text-ink transition-colors hover:bg-gold-dk disabled:opacity-50">
          {isPending ? "Verifying..." : "Verify Email"}
        </button>
      </form>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyForm />
      </Suspense>
    </div>
  );
}