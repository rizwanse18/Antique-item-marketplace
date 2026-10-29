import { prisma } from "./prisma";

export type Role = "buyer" | "seller" | "admin";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: number;
}

function toStored(row: {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt: Date;
}): StoredUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.passwordHash,
    role: row.role as Role,
    createdAt: row.createdAt.getTime(),
  };
}

export async function readUsers(): Promise<StoredUser[]> {
  const rows = await prisma.user.findMany();
  return rows.map(toStored);
}

export async function findUserByEmail(email: string) {
  const row = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  return row ? toStored(row) : null;
}

export async function findUserById(id: string) {
  const row = await prisma.user.findUnique({ where: { id } });
  return row ? toStored(row) : null;
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string,
  role: Role = "buyer"
): Promise<StoredUser> {
  const row = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
    },
  });
  return toStored(row);
}