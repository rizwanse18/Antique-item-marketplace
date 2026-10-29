import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/seller",
          "/seller/",
          "/dashboard",
          "/dashboard/",
          "/checkout",
          "/checkout/",
          "/cart",
          "/messages",
          "/messages/",
          "/dev/",
          "/sign-in",
          "/sign-up",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}