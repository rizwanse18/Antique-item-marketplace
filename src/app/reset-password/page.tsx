"use client";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { resetPasswordAction } from "@/app/actions/auth";
import { Suspense } from "react";

function ResetForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [state, formAction, isPending] = useActionState(resetPasswordAction, { error: "" });

  return (
    <div className="w-full max-w-md rounded-xl border border-line bg-paper p-8 shadow-xl">
      <h1 className="font-display text-3xl font-semibold text-ink text-center">Set New Password</h1>
      <p className="mt-2 text-sm text-muted text-center">Code sent to {email}</p>
      <form action={formAction} className="mt-6 space-y-4">
        {state?.error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{state.error}</div>}
        <input type="hidden" name="email" value={email} />
        <input name="code" type="text" required placeholder="6-digit code" maxLength={6} className="w-full rounded-md border border-line px-3 py-2.5 text-sm text-center tracking-widest focus:border-gold focus:outline-none" />
        <input name="password" type="password" required placeholder="New Password (min 8 chars)" className="w-full rounded-md border border-line px-3 py-2.5 text-sm focus:border-gold focus:outline-none" />
        <button type="submit" disabled={isPending} className="w-full rounded-md bg-gold py-3 text-sm font-semibold text-ink hover:bg-gold-dk disabled:opacity-50">
          {isPending ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <Suspense fallback={<div>Loading...</div>}><ResetForm /></Suspense>
    </div>
  );
}