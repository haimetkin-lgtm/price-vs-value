import type { MetadataRoute } from "next";

// נדרש ב-output: export
export const dynamic = "force-static";

const SITE_URL = "https://haimetkin-lgtm.github.io/price-vs-value";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/report/?demo=true`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/report/?demo=appraiser`, lastModified, changeFrequency: "monthly", priority: 0.7 },
  ];
}
