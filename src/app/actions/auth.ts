"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createUser, findUserByEmail } from "@/lib/user-store";
import { setSession, clearSession } from "@/lib/session";
import { sendEmailToUser } from "@/lib/email";

export interface AuthState { error?: string; success?: string; }

export async function signUpAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (name.length < 2) return { error: "Please enter your full name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "Invalid email address." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await findUserByEmail(email);
  if (existing) {
    // If they exist but are NOT verified, we update their password and resend OTP
    if (!existing.emailVerified) {
      const passwordHash = await bcrypt.hash(password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      await prisma.user.update({
        where: { id: existing.id },
        data: { name, passwordHash, otpCode: otp, otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000) }
      });

      console.log(`\n🔑 NEW OTP CODE FOR ${email}: ${otp}\n`);
      try { await sendEmailToUser(existing.id, "Verify your ANTIQUA account", `Your code: ${otp}`, "welcome"); } catch(e) {}
      
      redirect(`/verify-email?email=${encodeURIComponent(email)}`);
    }
    return { error: "An account with that email already exists. Please login." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser(name, email, passwordHash, "buyer");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await prisma.user.update({
    where: { id: user.id },
    data: { otpCode: otp, otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000) }
  });

  console.log(`\n🔑 OTP CODE FOR ${email}: ${otp}\n`);
  try { await sendEmailToUser(user.id, "Verify your ANTIQUA account", `Your code: ${otp}`, "welcome"); } catch(e) {}

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
  if (!user.passwordHash) return { error: "Please sign in with Google." };

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { error: "Invalid email or password." };
  
  if (!user.emailVerified) return { error: "Please verify your email first. Check Vercel logs for the OTP." };

  await setSession(user.id);
  redirect("/dashboard");
}

export async function forgotPasswordAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const user = await findUserByEmail(email);
  if (!user) return { error: "No account found with this email." };

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await prisma.user.update({
    where: { id: user.id },
    data: { otpCode: otp, otpExpiresAt: new Date(Date.now() + 15 * 60 * 1000) }
  });

  console.log(`\n🔑 PASSWORD RESET CODE FOR ${email}: ${otp}\n`);
  try { await sendEmailToUser(user.id, "Reset your password", `Your reset code: ${otp}`, "welcome"); } catch(e) {}

  redirect(`/reset-password?email=${encodeURIComponent(email)}`);
}

export async function resetPasswordAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const code = String(formData.get("code") || "");
  const password = String(formData.get("password") || "");

  const user = await findUserByEmail(email);
  if (!user) return { error: "User not found." };
  if (user.otpCode !== code) return { error: "Invalid reset code." };
  if (user.otpExpiresAt && user.otpExpiresAt < new Date()) return { error: "Code expired." };

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, otpCode: null, otpExpiresAt: null, emailVerified: true }
  });

  redirect("/sign-in?reset=success");
}

export async function signOutAction() {
  await clearSession();
  redirect("/");
}