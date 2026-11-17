import { redirect } from "next/navigation";
export async function GET() {
  const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  const options = {
    redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/google/callback`,
    console.log('GOOGLE_CLIENT_ID starts with:', process.env.GOOGLE_CLIENT_ID?.substring(0, 10));
    client_id: process.env.GOOGLE_CLIENT_ID!,
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"].join(" "),
  };
  redirect(`${rootUrl}?${new URLSearchParams(options).toString()}`);
}