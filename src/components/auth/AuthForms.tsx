"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { signInAction, signUpAction, type AuthState } from "@/app/actions/auth";

const initial: AuthState = {};

function Field({
  name, label, type = "text", autoComplete, placeholder,
}: {
  name: string; label: string; type?: string; autoComplete?: string; placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.13em] text-muted">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        className="w-full rounded-sm border border-line-2 bg-paper px-3.5 py-3 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
      />
    </div>
  );
}

function ErrorBox({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="rounded-sm border border-danger/30 bg-danger/10 px-3.5 py-3 text-[13px] text-danger">
      {message}
    </div>
  );
}

export function SignInForm() {
  const [state, action, pending] = useActionState(signInAction, initial);
  return (
    <form action={action} className="space-y-4">
      <ErrorBox message={state.error} />
      <Field name="email" label="Email address" type="email" autoComplete="email" placeholder="you@example.com" />
      <Field name="password" label="Password" type="password" autoComplete="current-password" placeholder="********" />
      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={pending}>
        {pending ? "Signing in..." : "Sign In"}
      </Button>
      <p className="pt-1 text-center text-[13px] text-muted">
        New to ANTIQUA?{" "}
        <Link href="/sign-up" className="font-semibold text-gold-dk hover:underline">Create an account</Link>
      </p>
    </form>
  );
}

export function SignUpForm() {
  const [state, action, pending] = useActionState(signUpAction, initial);
  return (
    <form action={action} className="space-y-4">
      <ErrorBox message={state.error} />
      <Field name="name" label="Full name" autoComplete="name" placeholder="Alexandra Reed" />
      <Field name="email" label="Email address" type="email" autoComplete="email" placeholder="you@example.com" />
      <Field name="password" label="Password" type="password" autoComplete="new-password" placeholder="At least 8 characters" />
      <Button type="submit" variant="gold" size="lg" className="w-full" disabled={pending}>
        {pending ? "Creating account..." : "Create Account"}
      </Button>
      <p className="pt-1 text-center text-[13px] text-muted">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-gold-dk hover:underline">Sign in</Link>
      </p>
    </form>
  );
}