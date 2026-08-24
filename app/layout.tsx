import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const SITE_URL = "https://haimetkin-lgtm.github.io/price-vs-value";

const TITLE = "מחשבון שווי דירה מול מחיר | האם שילמת את המחיר הנכון?";
const DESCRIPTION =
  "בדיקת שווי דירה מול מחיר השוק לפי שלושה מודלים כלכליים: יכולת מימון (PIR, HAI, DSTI), הכנסה משכירות ועלות ייצור. מחשבון אונליין לבדיקת כדאיות רכישת דירה, שכירות מול קנייה ואיתור תמחור חריג, מבית השמאי חיים אטקין, מחבר הספר \"בועת נדל\"ן\". דוח PDF מ-18 ₪, ללא מנוי.";

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
    "מחשבון שווי דירה",
    "בדיקת מחיר דירה",
    "שווי דירה מול מחיר",
    "הערכת שווי דירה אונליין",
    "האם כדאי לקנות דירה עכשיו",
    "כדאיות רכישת דירה",
    "שכירות מול קנייה",
    "מחיר דירה ריאלי",
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
    "שמאות דיגיטלית",
    "ניתוח כלכלי של דירה",
    "האם המחיר של הדירה מוצדק",
    "בדיקה לפני חתימה על חוזה דירה",
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
    images: [{ url: `${SITE_URL}/og-share.jpg`, width: 1200, height: 1200, alt: "מחשבון שווי דירה מול מחיר" }],
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: "בדיקת שווי דירה מול מחיר השוק לפי שלושה מודלים כלכליים. מחשבון אונליין לכדאיות רכישת דירה.",
    images: [`${SITE_URL}/og-share.jpg`],
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
        "בדיקת שווי דירה מול מחיר השוק",
        "מדדי נגישות דיור PIR, HAI ו-DSTI",
        "מבחן כדאיות שכירות מול רכישה",
        "ניתוח לפי עלות ייצור",
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
      mainEntity: [
        {
          "@type": "Question",
          name: "איך בודקים אם מחיר של דירה מוצדק?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "מחיר מוצדק נבחן מול שווי כלכלי, ולא מול מחירי עסקאות בלבד. הכלי בודק את הדירה לפי שלושה עוגנים: יכולת מימון של משק בית (מדדי PIR, HAI ו-DSTI), הכנסה משכירות (תשואה ומכפיל), ועלות ייצור (קרקע, בנייה, מיסים ורווח יזמי). פער גדול בין המחיר לשווי הכלכלי מצביע על תמחור חריג.",
          },
        },
        {
          "@type": "Question",
          name: "מה ההבדל בין מחיר דירה לשווי דירה?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "מחיר הוא נתון: הסכום שסוכם בעסקה. שווי הוא מסקנה כלכלית: המחיר הראוי לאחר בחינת הגורמים הכלכליים שעומדים בבסיס העסקה. שני מספרים שונים לחלוטין, ואי אפשר להסתמך על עסקאות בלבד כדי להסיק מהו השווי האמיתי של הנכס.",
          },
        },
        {
          "@type": "Question",
          name: "מה זה מדד PIR ומה הוא אומר על מחיר הדירה?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "PIR (Price to Income Ratio) הוא היחס בין מחיר הדירה להכנסה השנתית של משק הבית. הוא מודד כמה שנות הכנסה נדרשות לרכישת הדירה, ומשמש להערכת נגישות הדיור. ככל שהיחס גבוה יותר, כך המחיר רחוק יותר מיכולת המימון הריאלית של הרוכשים.",
          },
        },
        {
          "@type": "Question",
          name: "האם כדאי לקנות דירה עכשיו או להמשיך לשכור?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "התשובה תלויה ביחס בין עלות המשכנתא החודשית לדמי השכירות באותו נכס, בתשואה משכירות, בהון העצמי ובאופק ההחזקה. הכלי כולל מבחן כדאיות שכירות מול רכישה שמשווה בין המסלולים בנתונים שלכם.",
          },
        },
        {
          "@type": "Question",
          name: "מהי משכנתא עודפת ואיך מזהים אותה?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "משכנתא עודפת היא הלוואה שניתנה על בסיס מחיר נכס גבוה מהמחיר הכלכלי הריאלי שלו. כאשר ניתוח מצביע על פער משמעותי בין המחיר ששולם למחיר הכלכלי, ניתן להזמין דוח שמאות מפורט המתאים להליכים משפטיים.",
          },
        },
        {
          "@type": "Question",
          name: "כמה עולה בדיקת שווי דירה בכלי?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "החישוב הראשוני והתצוגה החיה ניתנים ללא עלות. דוח ניתוח ממוקד עולה 18 ₪ ודוח ניתוח מורחב 49 ₪. תשלום חד פעמי, ללא מנוי.",
          },
        },
      ],
    },
  ],
};

function PvLogo() {
  return (
    <div className="flex items-center gap-2.5">
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
        <span className="text-xs text-gray-400">מחיר מול שווי <span className="text-amber-500 font-medium">גרסת ביתא</span></span>
      </div>
    </div>
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
            ⚠️ הכלי מיועד לדירות מגורים ואינו מתאים לנכסים מיוחדים, דירות יוקרה, וילות, אחוזות, נחלות או דירות פאר
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
