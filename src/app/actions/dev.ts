"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export async function clearEmailLogAction() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");
  if (process.env.NODE_ENV === "production") redirect("/");

  await prisma.emailLog.deleteMany({});
  redirect("/dev/emails?empty=1");
}