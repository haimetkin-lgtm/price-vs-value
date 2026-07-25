import type { MetadataRoute } from "next";

// נדרש ב-output: export
export const dynamic = "force-static";

const SITE_URL = "https://haimetkin-lgtm.github.io/price-vs-value";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/auth/", "/history/", "/share/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
