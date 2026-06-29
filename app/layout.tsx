import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "מחיר מול שווי | Price vs Value",
  description: "האם שילמת את המחיר הנכון? ניתוח פונדמנטלי של שווי נדל״ן למגורים בישראל",
  icons: { icon: "/favicon.svg" },
};

function PvLogo() {
  return (
    <a href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
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
      <body className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <PvLogo />
            <nav className="flex items-center gap-4 text-xs text-gray-500">
              <a href="/history" className="hover:text-gray-800 transition-colors">הדוחות שלי</a>
              <a href="/auth" className="hover:text-gray-800 transition-colors">כניסה</a>
            </nav>
          </div>
          <div className="bg-amber-50 border-t border-amber-100 text-center py-1.5 px-4 text-xs text-amber-700">
            ⚠️ הכלי מיועד לדירות מגורים ואינו מתאים לנכסים מיוחדים, דירות יוקרה, וילות, אחוזות, נחלות או דירות פאר
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
