"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createUser, findUserByEmail } from "@/lib/user-store";
import { setSession, clearSession } from "@/lib/session";
import { sendEmailToUser } from "@/lib/email";

export interface AuthState { error?: string; }

export async function signUpAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (name.length < 2) return { error: "Please enter your full name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "Invalid email address." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await findUserByEmail(email);
  if (existing) return { error: "An account with that email already exists." };

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser(name, email, passwordHash, "buyer");

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await prisma.user.update({
    where: { id: user.id },
    data: { otpCode: otp, otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000) }
  });

  // Send OTP Email
  try {
    await sendEmailToUser(
      user.id,
      "Your ANTIQUA Verification Code",
      `Welcome ${name},\n\nYour verification code is: ${otp}\n\nThis code expires in 15 minutes.`,
      "welcome"
    );
  } catch (e) { console.error("[auth] email failed:", e); }

  redirect(`/verify-email?email=${encodeURIComponent(email)}`);
}

export async function verifyEmailAction(email: string, code: string): Promise<AuthState> {
  const user = await findUserByEmail(email);
  if (!user) return { error: "User not found." };
  if (user.otpCode !== code) return { error: "Invalid verification code." };
  if (user.otpExpiresAt && user.otpExpiresAt < new Date()) return { error: "Code expired. Please sign up again." };

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, otpCode: null, otpExpiresAt: null }
  });

  await setSession(user.id);
  redirect("/dashboard");
}

export async function signInAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) return { error: "Please fill in all fields." };

  const user = await findUserByEmail(email);
  if (!user) return { error: "Invalid email or password." };
  if (!user.passwordHash) return { error: "Please sign in with Google." }; // User created via Google

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { error: "Invalid email or password." };
  
  

  await setSession(user.id);
  redirect("/dashboard");
}

export async function signOutAction() {
  await clearSession();
  redirect("/");
}