import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setSession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/sign-in?error=google`);

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });

  const { access_token } = await tokenRes.json();
  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const googleUser = await userRes.json();

  let user = await prisma.user.findUnique({ where: { email: googleUser.email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: googleUser.email,
        name: googleUser.name,
        passwordHash: "", 
        role: "buyer",
        emailVerified: true,
      }
    });
  }

  await setSession(user.id);
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`);
}