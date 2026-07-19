import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "מחיר הוא נתון. שווי הוא מסקנה כלכלית.",
  description: "האם שילמת את המחיר הנכון? בדוק את הפער בין מחיר השוק לשווי הפונדמנטלי — לפי שלושה מודלים כלכליים: יכולת מימון, הכנסה משכירות ועלות ייצור. מבוסס על הספר \"בועת נדל\"ן\".",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "מחיר הוא נתון. שווי הוא מסקנה כלכלית.",
    description: "האם שילמת את המחיר הנכון? בדוק את הפער בין מחיר השוק לשווי הפונדמנטלי — לפי שלושה מודלים כלכליים: יכולת מימון, הכנסה משכירות ועלות ייצור. מבוסס על הספר \"בועת נדל\"ן\".",
    images: [{ url: "https://haimetkin-lgtm.github.io/price-vs-value/og-image.jpg", width: 1080, height: 1080 }],
    locale: "he_IL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "מחיר הוא נתון. שווי הוא מסקנה כלכלית.",
    description: "האם שילמת את המחיר הנכון? בדוק את הפער בין מחיר השוק לשווי הפונדמנטלי.",
    images: ["https://haimetkin-lgtm.github.io/price-vs-value/og-image.jpg"],
  },
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
        <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js" strategy="afterInteractive" />
        <Script id="free_accessibility_plugin_script" src="https://accessibility.f-static.com/site/free-accessibility-plugin/accessibility.min.js?lan=he&place=bottom-right&distance=50" crossOrigin="anonymous" strategy="afterInteractive" />
      </body>
    </html>
  );
}
