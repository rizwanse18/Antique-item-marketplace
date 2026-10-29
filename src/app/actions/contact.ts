"use server";

import { getCurrentUser } from "@/lib/current-user";
import { sendEmail } from "@/lib/email";

export interface ContactState {
  error?: string;
  success?: boolean;
}

export async function submitContactAction(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const topic = String(formData.get("topic") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (name.length < 2) return { error: "Please enter your name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return { error: "Please enter a valid email address." };
  if (!topic) return { error: "Please select a topic." };
  if (message.length < 10)
    return { error: "Please write at least 10 characters describing your question." };
  if (message.length > 5000)
    return { error: "Message must be under 5000 characters." };

  const me = await getCurrentUser();

  // Log to DB so admin can see it
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.emailLog.create({
      data: {
        userId: me?.id ?? null,
        toEmail: "antiqueitemmarketplace@gmail.com",
        toName: "ANTIQUA Support",
        subject: `[Contact] ${topic} — from ${name}`,
        body: `From: ${name} <${email}>\nTopic: ${topic}\n\n${message}`,
        template: "welcome",
        provider: "log",
        status: "queued",
      },
    });
  } catch (e) {
    console.error("[contact] log failed:", e);
  }

  // Log to terminal + email audit
  try {
    await sendEmail({
      userId: me?.id ?? null,
      toEmail: "antiqueitemmarketplace@gmail.com",
      toName: "ANTIQUA Support",
      subject: `[Contact] ${topic} — from ${name}`,
      body: `From: ${name} <${email}>\nTopic: ${topic}\n\n${message}`,
      template: "welcome",
    });
  } catch (e) {
    console.error("[contact] email failed:", e);
  }

  return { success: true };
}