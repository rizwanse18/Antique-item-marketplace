import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "GOOGLE_CLIENT_ID is missing in Vercel Environment Variables." }, { status: 500 });
  }

  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/google/callback`,
    client_id: clientId,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"].join(" "),
  };

  return NextResponse.redirect(`${rootUrl}?${new URLSearchParams(options).toString()}`);
}