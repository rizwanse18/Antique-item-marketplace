import "server-only";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function saveUploadedImage(file: File): Promise<string> {
  if (!file || file.size === 0) throw new Error("Empty file.");
  if (file.size > MAX_SIZE) throw new Error(`"${file.name}" exceeds 10 MB.`);
  if (!ALLOWED.includes(file.type))
    throw new Error(`"${file.name}" must be a JPEG, PNG or WebP image.`);

  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const ext =
    file.type === "image/png" ? "png" :
    file.type === "image/webp" ? "webp" : "jpg";
  const filename = crypto.randomBytes(16).toString("hex") + "." + ext;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer);
  return "/uploads/" + filename;
}

export async function deleteUploadedImage(url: string): Promise<void> {
  if (!url.startsWith("/uploads/")) return;
  try { await fs.unlink(path.join(UPLOADS_DIR, url.replace("/uploads/", ""))); } catch {}
}