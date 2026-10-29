import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@antiqua.com";
  const password = "admin1234";
  const hash = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role: "admin", passwordHash: hash },
    });
    console.log("Admin user updated:", email);
  } else {
    await prisma.user.create({
      data: {
        name: "ANTIQUA Admin",
        email,
        passwordHash: hash,
        role: "admin",
      },
    });
    console.log("Admin user created:", email);
  }
  console.log("Password:", password);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());