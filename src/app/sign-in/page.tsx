"use client";
import Link from "next/link";
import { useActionState } from "react";
import { signInAction } from "@/app/actions/auth";
import { GoogleButton } from "@/components/auth/GoogleButton";

export default function SignInPage() {
  const [state, formAction, isPending] = useActionState(signInAction, { error: "" });

  return (
    <div className="flex min-h-[calc(100vh-74px)] items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-line bg-paper p-8 shadow-xl">
        <div className="text-center">
          <h1 className="font-display text-3xl font-semibold text-ink">Welcome back</h1>
          <p className="mt-2 text-sm text-muted">Log in to your ANTIQUA account</p>
        </div>

        <div className="mt-8">
          <GoogleButton />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-line"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-paper px-3 text-muted">Or use email</span>
            </div>
          </div>

          <form action={formAction} className="space-y-4">
            {state?.error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {state.error}
              </div>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Email address</label>
              <input name="email" type="email" required className="w-full rounded-md border border-line px-3 py-2.5 text-sm focus:border-gold focus:outline-none" placeholder="you@example.com" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Password</label>
              <input name="password" type="password" required className="w-full rounded-md border border-line px-3 py-2.5 text-sm focus:border-gold focus:outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={isPending} className="w-full rounded-md bg-gold py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-dk disabled:opacity-50">
              {isPending ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Don't have an account? <Link href="/sign-up" className="font-semibold text-gold-dk hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}