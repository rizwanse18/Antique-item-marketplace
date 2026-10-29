"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createUser, findUserByEmail } from "@/lib/user-store";
import { setSession, clearSession } from "@/lib/session";

export interface AuthState {
  error?: string;
}

export async function signUpAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (name.length < 2) return { error: "Please enter your full name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { error: "Please enter a valid email address." };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };

  const existing = await findUserByEmail(email);
  if (existing) return { error: "An account with that email already exists." };

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser(name, email, passwordHash, "buyer");

  await setSession(user.id);

  const { sendEmailToUser } = await import("@/lib/email");
  await sendEmailToUser(
    user.id,
    "Welcome to ANTIQUA",
    `Hi ${name},\n\nThank you for joining ANTIQUA — the international marketplace for authenticated antiques, fine art and rare collectibles.\n\nYou can now:\n  • Browse authenticated lots from vetted consignors\n  • Bid live on auctions or buy fixed-price items\n  • Track lots in your watchlist and receive alerts\n  • Consign your own antiques to a global audience\n\nSign in any time: https://antiqua.example.com/sign-in\n\n— The ANTIQUA team`,
    "welcome"
  ).catch(() => {});

  redirect("/dashboard");

}

export async function signInAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) return { error: "Please fill in all fields." };

  const user = await findUserByEmail(email);
  if (!user) return { error: "Invalid email or password." };

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { error: "Invalid email or password." };

  await setSession(user.id);

  const { sendEmailToUser } = await import("@/lib/email");
  await sendEmailToUser(
    user.id,
    "Welcome to ANTIQUA",
    `Hi ${name},\n\nThank you for joining ANTIQUA — the international marketplace for authenticated antiques, fine art and rare collectibles.\n\nYou can now:\n  • Browse authenticated lots from vetted consignors\n  • Bid live on auctions or buy fixed-price items\n  • Track lots in your watchlist and receive alerts\n  • Consign your own antiques to a global audience\n\nSign in any time: https://antiqua.example.com/sign-in\n\n— The ANTIQUA team`,
    "welcome"
  ).catch(() => {});

  redirect("/dashboard");

}

export async function signOutAction() {
  await clearSession();
  redirect("/");
}