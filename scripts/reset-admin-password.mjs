// scripts/reset-admin-password.mjs
// Usage: node scripts/reset-admin-password.mjs
// Prompts for the new password at runtime. Nothing is stored or logged.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const ADMIN_EMAIL = "admin@antiqua.com";

function askHidden(query) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    let input = "";
    process.stdout.write(query);

    const onData = (chunk) => {
      const s = chunk.toString("utf8");
      for (const ch of s) {
        if (ch === "\n" || ch === "\r") {
          stdin.setRawMode?.(false);
          stdin.removeListener("data", onData);
          process.stdout.write("\n");
          resolve(input);
          return;
        }
        if (ch === "\u0003") {
          stdin.setRawMode?.(false);
          process.exit(1);
        }
        if (ch === "\u007f" || ch === "\b") {
          input = input.slice(0, -1);
        } else {
          input += ch;
        }
      }
    };

    if (stdin.isTTY) stdin.setRawMode?.(true);
    stdin.on("data", onData);
  });
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
    if (!user) {
      console.error("No user with email " + ADMIN_EMAIL);
      process.exit(1);
    }

    const pw1 = await askHidden("New admin password: ");
    if (pw1.length < 12) {
      console.error("Password must be at least 12 characters.");
      process.exit(1);
    }
    const pw2 = await askHidden("Confirm password:     ");
    if (pw1 !== pw2) {
      console.error("Passwords do not match.");
      process.exit(1);
    }

    const hash = await bcrypt.hash(pw1, 10);
    await prisma.user.update({
      where: { email: ADMIN_EMAIL },
      data: { passwordHash: hash },
    });

    console.log("OK - password updated for " + ADMIN_EMAIL);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});