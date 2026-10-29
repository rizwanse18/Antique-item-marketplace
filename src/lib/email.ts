import "server-only";
import { prisma } from "./prisma";

export type EmailTemplate =
  | "welcome"
  | "outbid"
  | "auction_won"
  | "auction_sold"
  | "auction_unsold"
  | "order_placed"
  | "order_received"
  | "bid_placed";

export interface SendEmailInput {
  userId?: string | null;
  toEmail: string;
  toName: string;
  subject: string;
  body: string;
  template: EmailTemplate;
}

/**
 * Send an email.
 *
 * Provider is selected by `EMAIL_PROVIDER` env var:
 *   - "log" (default)  → only logs to terminal + DB (dev-friendly)
 *   - "smtp"           → would use SMTP_* env vars (stub, no lib installed)
 *   - "resend"         → would use RESEND_API_KEY (stub)
 *
 * Every attempt is recorded in the EmailLog table regardless of provider
 * so you can audit exactly what was sent.
 */
export async function sendEmail(input: SendEmailInput): Promise<void> {
  const provider = process.env.EMAIL_PROVIDER || "log";

  let logId: string | null = null;
  try {
    const log = await prisma.emailLog.create({
      data: {
        userId: input.userId ?? null,
        toEmail: input.toEmail,
        toName: input.toName,
        subject: input.subject,
        body: input.body,
        template: input.template,
        provider,
        status: "queued",
      },
    });
    logId = log.id;
  } catch (e) {
    console.error("[email] failed to create log:", e);
    return;
  }

  if (provider === "log") {
    try {
      await prisma.emailLog.update({
        where: { id: logId },
        data: { status: "sent", sentAt: new Date() },
      });
    } catch {
      /* ignore */
    }
    console.log("");
    console.log("📧 [email/log] ─────────────────────────────");
    console.log(`   To:      ${input.toName} <${input.toEmail}>`);
    console.log(`   Subject: ${input.subject}`);
    console.log(`   Body:    ${input.body.slice(0, 120)}${input.body.length > 120 ? "…" : ""}`);
    console.log("─────────────────────────────────────────────");
    return;
  }

  try {
    if (provider === "smtp") {
      // To enable: npm install nodemailer && npm install -D @types/nodemailer
      // Then implement here using SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS env vars.
      // await transporter.sendMail({ from, to, subject, text });
      throw new Error("SMTP provider not yet configured — install nodemailer and implement sendViaSmtp().");
    }
    if (provider === "resend") {
      // To enable: npm install resend
      // Then implement here using RESEND_API_KEY env var.
      throw new Error("Resend provider not yet configured — install resend and implement sendViaResend().");
    }
    throw new Error(`Unknown EMAIL_PROVIDER: ${provider}`);
  } catch (e) {
    try {
      await prisma.emailLog.update({
        where: { id: logId },
        data: {
          status: "failed",
          error: e instanceof Error ? e.message : "Unknown error",
        },
      });
    } catch {
      /* ignore */
    }
    console.error("[email] send failed:", e);
  }
}

// Convenience helper — fetch user and call sendEmail
export async function sendEmailToUser(
  userId: string,
  subject: string,
  body: string,
  template: EmailTemplate
): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });
    if (!user) return;
    await sendEmail({
      userId,
      toEmail: user.email,
      toName: user.name,
      subject,
      body,
      template,
    });
  } catch (e) {
    console.error("[email] sendEmailToUser failed:", e);
  }
}