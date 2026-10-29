import { getSessionUserId } from "./session";
import { findUserById, type Role } from "./user-store";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  initials: string;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const id = await getSessionUserId();
  if (!id) return null;
  const u = await findUserById(id);
  if (!u) return null;
  const initials = u.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return { id: u.id, name: u.name, email: u.email, role: u.role, initials };
}