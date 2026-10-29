import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "antiqua_session";
const SECRET = process.env.AUTH_SECRET || "dev-secret-change-me-in-prod";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function sign(value: string) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export async function setSession(userId: string) {
  const value = userId + "." + sign(userId);
  const store = await cookies();
  store.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const v = store.get(COOKIE_NAME)?.value;
  if (!v) return null;
  const dot = v.lastIndexOf(".");
  if (dot < 0) return null;
  const payload = v.slice(0, dot);
  const sig = v.slice(dot + 1);
  if (sign(payload) !== sig) return null;
  return payload;
}