"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getReportByToken } from "@/lib/reports";
import { type ReportRow } from "@/lib/supabase";
import { ModelBar } from "@/components/report/ModelBar";
import { HistoricalChart } from "@/components/report/HistoricalChart";

function fmt(n: number) {
  if (n >= 1_000_000) return "₪" + (n / 1_000_000).toFixed(2) + "M";
  return "₪" + new Intl.NumberFormat("he-IL").format(Math.round(n));
}
function fmtPct(n: number) {
  return (n >= 0 ? "+" : "") + n.toFixed(1) + "%";
}
function MetricTile({ label, value, color = "" }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className={`text-lg font-semibold ${color}`}>{value}</div>
    </div>
  );
}

function ShareContent() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [report, setReport] = useState<ReportRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) { setNotFound(true); setLoading(false); return; }
    getReportByToken(token).then((r) => {
      if (!r) setNotFound(true);
      else setReport(r);
      setLoading(false);
    });
  }, [token]);

  if (loading) return <div className="text-center py-20 text-gray-400">טוען דוח...</div>;
  if (notFound || !report) return (
    <div className="text-center py-20">
      <p className="text-gray-500">הדוח לא נמצא או אינו זמין לשיתוף.</p>
      <a href="/" className="mt-4 inline-block text-sm text-blue-600 hover:underline">חזרה לדף הבית</a>
    </div>
  );

  const values = [report.paff, report.v_rent, report.v_cost].filter(v => v > 0);
  const vL = Math.min(...values);
  const vU = Math.max(...values);
  const premium = report.price_premium_pct;
  const status = premium > 5 ? "overpriced" : premium < -5 ? "underpriced" : "fair";
  const premiumColor = status === "overpriced" ? "text-red-600" : status === "underpriced" ? "text-green-600" : "text-amber-600";
  const uchDiff = (report.uch_annual - report.rent_annual) / 12;
  const buyIsExpensive = report.uch_annual > report.rent_annual;
  const createdDate = new Date(report.created_at).toLocaleDateString("he-IL", { year: "numeric", month: "long", day: "numeric" });

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-5">

        <div className="text-center border-b border-gray-100 pb-4">
          <div className="text-xs text-gray-400 mb-1">דוח משותף — לצפייה בלבד</div>
          <h1 className="text-xl font-bold text-gray-900">ניתוח פונדמנטלי: {report.city}</h1>
          <p className="text-sm text-gray-400 mt-1">{report.rooms} חדרים · {createdDate}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <MetricTile label="מחיר שוק" value={fmt(report.market_price)} />
          <MetricTile label="טווח שווי" value={`${fmt(vL)}–${fmt(vU)}`} color="text-blue-700" />
          <MetricTile label="פרמייה" value={fmtPct(premium)} color={premiumColor} />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">מודלי שווי פונדמנטלי</h2>
          <ModelBar label="Paff" value={report.paff} marketPrice={report.market_price} vL={vL} vU={vU} />
          <ModelBar label="Vrent" value={report.v_rent} marketPrice={report.market_price} vL={vL} vU={vU} />
          <ModelBar label="Vcost" value={report.v_cost} marketPrice={report.market_price} vL={vL} vU={vU} />
          <div className="mt-3 bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-500 flex items-start gap-2">
            <span>🔒</span>
            <span>המודל האקונומטרי (V<sub>econ</sub>) מוסתר בדוחות משותפים</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">נגישות ומבחן כדאיות</h2>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <MetricTile label="PIR" value={report.pir.toFixed(1) + "x"} color={report.pir > 9 ? "text-red-600" : "text-amber-600"} />
            <MetricTile label="HAI" value={report.hai.toFixed(0)} color={report.hai < 100 ? "text-red-600" : "text-green-600"} />
            <MetricTile label="DSTI" value={report.dsti.toFixed(1) + "%"} color={report.dsti > 35 ? "text-red-600" : "text-amber-600"} />
          </div>
          <div className={`flex justify-between px-3 py-2 rounded-lg text-sm
            ${buyIsExpensive ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
            <span>מבחן UCH: {buyIsExpensive ? "עדיפות שכירות" : "עדיפות רכישה"}</span>
            <span className="font-semibold">{fmt(Math.abs(uchDiff))}/חודש</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">ניתוח היסטורי 2000–2024</h2>
          <HistoricalChart />
        </div>

        <div className="bg-blue-50 rounded-xl p-5 text-center">
          <p className="text-sm text-blue-800 font-medium mb-3">רוצה לנתח נכס משלך?</p>
          <a href="/" className="inline-block px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors">
            התחל ניתוח חדש ←
          </a>
          <p className="mt-2 text-xs text-blue-600">דוח מ-₪18 · תשלום חד-פעמי</p>
        </div>

        <p className="text-center text-xs text-gray-400 leading-relaxed">
          דוח זה אינו המלצת השקעה ואינו תחליף לשמאות פרטנית.<br />
          הכלי מיועד לדירות מגורים ואינו מתאים לנכסים מיוחדים, דירות יוקרה, וילות, אחוזות, נחלות או דירות פאר.<br />
          מחיר מול שווי © 2025
        </p>
      </div>
    </main>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">טוען...</div>}>
      <ShareContent />
    </Suspense>
  );
}
