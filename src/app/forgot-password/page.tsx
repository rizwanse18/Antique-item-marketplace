"use client";
import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/app/actions/auth";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(forgotPasswordAction, { error: "" });

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md rounded-xl border border-line bg-paper p-8 shadow-xl">
        <h1 className="font-display text-3xl font-semibold text-ink text-center">Reset Password</h1>
        <p className="mt-2 text-sm text-muted text-center">Enter your email to receive a reset code.</p>
        <form action={formAction} className="mt-6 space-y-4">
          {state?.error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{state.error}</div>}
          <input name="email" type="email" required placeholder="you@example.com" className="w-full rounded-md border border-line px-3 py-2.5 text-sm focus:border-gold focus:outline-none" />
          <button type="submit" disabled={isPending} className="w-full rounded-md bg-gold py-3 text-sm font-semibold text-ink hover:bg-gold-dk disabled:opacity-50">
            {isPending ? "Sending..." : "Send Reset Code"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm"><Link href="/sign-in" className="text-gold-dk font-semibold hover:underline">Back to Login</Link></p>
      </div>
    </div>
  );
}