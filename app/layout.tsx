import type { Metadata } from "next";
import Script from "next/script";
import { FAQ_ITEMS } from "@/lib/content";
import "./globals.css";

const SITE_URL = "https://haimetkin-lgtm.github.io/price-vs-value";

const TITLE = "מדד בועת המחיר בדירה | מחיר מול שווי פונדמנטלי";
const DESCRIPTION =
  "מחשבון המודד את גודל בועת המחיר בדירה: הפער הכספי והאחוזי בין מחיר השוק לבין השווי הפונדמנטלי, על בסיס עוגני יכולת מימון, הכנסה משכירות ועלות ייצור. כולל PIR, HAI, DSTI, טווח עוגנים ורמת ביטחון.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | PriceVsValue מחיר מול שווי",
  },
  description: DESCRIPTION,
  applicationName: "PriceVsValue",
  authors: [{ name: "חיים אטקין, שמאי מקרקעין" }],
  creator: "חיים אטקין",
  publisher: "חיים אטקין, שמאות מקרקעין",
  category: "נדל\"ן",
  keywords: [
    "מחשבון שווי פונדמנטלי דירה",
    "פער מחיר שווי דירה",
    "פרמיית מחיר דירה",
    "מדד בועת נדלן",
    "גודל בועת הנדלן",
    "בועת מחיר בדירה",
    "עוגנים פונדמנטליים נדלן",
    "מחיר מול שווי",
    "בדיקת מחיר דירה",
    "שווי דירה מול מחיר",
    "האם כדאי לקנות דירה עכשיו",
    "כדאיות רכישת דירה",
    "שכירות מול קנייה",
    "שווי פונדמנטלי נדלן",
    "בועת נדל\"ן",
    "יחס מחיר דירה להכנסה",
    "PIR נדל\"ן",
    "מדד HAI",
    "DSTI משכנתא",
    "משכנתא עודפת",
    "תשואה משכירות",
    "עלות ייצור דירה",
    "שמאי מקרקעין",
    "חיים אטקין",
    "ניתוח כלכלי של דירה",
    "מדידת תמחור יתר בדירה",
  ],
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "PriceVsValue · מחיר מול שווי",
    images: [{
      url: `${SITE_URL}/og-social-wide.jpg`,
      width: 1200,
      height: 630,
      alt: "מחיר מול שווי: מדד הפער בין מחיר הדירה לשווי הפונדמנטלי",
    }],
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "מדד לגודל בועת המחיר בדירה: הפער הכספי והאחוזי בין מחיר השוק לשווי הפונדמנטלי.",
    images: [`${SITE_URL}/og-social-wide.jpg`],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#app`,
      name: "PriceVsValue · מחיר מול שווי",
      alternateName: "מחשבון שווי דירה מול מחיר",
      url: SITE_URL,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      inLanguage: "he-IL",
      description: DESCRIPTION,
      featureList: [
        "מדידת גודל בועת המחיר בדירה",
        "הצגת הפער הכספי והאחוזי בין מחיר לשווי פונדמנטלי",
        "מדדי נגישות דיור PIR, HAI ו-DSTI",
        "עוגן הכנסה משכירות",
        "עוגן עלות ייצור",
        "מדדי פרמיית מחיר, פיזור ורמת ביטחון",
        "דוח PDF להורדה",
      ],
      offers: {
        "@type": "Offer",
        price: "18",
        priceCurrency: "ILS",
        description: "דוח ניתוח ממוקד. דוח מורחב מ-49 ₪. תשלום חד פעמי ללא מנוי.",
      },
      author: { "@id": `${SITE_URL}/#person` },
      areaServed: { "@type": "Country", name: "ישראל" },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "חיים אטקין",
      jobTitle: "שמאי מקרקעין, אנליסט נדל\"ן וחוקר שוק",
      description:
        "שמאי מקרקעין, מחבר הספר \"בועת נדל\"ן\", מייסד בית שמאי, בית הספר לפרקטיקה שמאית.",
      email: "haimetkin@gmail.com",
      knowsAbout: ["שמאות מקרקעין", "הערכת שווי דירות", "בועת נדל\"ן", "מדדי נגישות דיור", "מיסוי מקרקעין"],
      url: "https://www.etkin.co.il",
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};

function PvLogo() {
  return (
    <a href="/price-vs-value/" aria-label="חזרה לדף הבית" className="flex items-center gap-2.5">
      {/* PV Icon */}
      <svg viewBox="0 0 40 40" width="34" height="34" xmlns="http://www.w3.org/2000/svg" style={{direction: "ltr"}}>
        <rect width="40" height="40" rx="7" fill="#1b3a6b"/>
        <text x="6" y="28" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="22" fill="white">P</text>
        <text x="22" y="34" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="15" fill="#f59e0b">v</text>
      </svg>
      {/* Wordmark */}
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-bold tracking-tight text-gray-900">
          Price<span className="text-amber-500">vs</span>Value
        </span>
        <span className="text-xs text-gray-400">מחיר מול שווי</span>
      </div>
    </a>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <PvLogo />
            <nav className="flex items-center gap-4 text-xs text-gray-500">
              <a href="mailto:haimetkin@gmail.com" className="hover:text-gray-800 transition-colors">צור קשר</a>
            </nav>
          </div>
          <div className="bg-amber-50 border-t border-amber-100 text-center py-1.5 px-4 text-xs text-amber-700">
            ⚠️ הכלי מיועד לדירות מגורים רגילות ואינו מתאים לנכסים מיוחדים, דירות יוקרה, וילות, אחוזות או נחלות
          </div>
        </header>
        {children}
        <footer className="text-center py-4 text-xs text-gray-400 border-t border-gray-100 mt-2">
          מבוסס על הספר <span className="font-medium text-gray-500">בועת נדל״ן</span>
          <br />
          חיים אטקין, שמאי מקרקעין, אנליסט נדל״ן, מומחה לנדל״ן וחוקר שוק · מייסד ובעלים של <span className="font-medium text-gray-500">בית שמאי</span>, בית הספר לפרקטיקה שמאית
          <br />
          © {new Date().getFullYear()} חיים אטקין · כל הזכויות שמורות
        </footer>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-1E7CBNZ40M" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-1E7CBNZ40M');
        `}</Script>
        <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js" strategy="afterInteractive" />
        <Script id="free_accessibility_plugin_script" src="https://accessibility.f-static.com/site/free-accessibility-plugin/accessibility.min.js?lan=he&place=bottom-right&distance=50" crossOrigin="anonymous" strategy="afterInteractive" />
      </body>
    </html>
  );
}
