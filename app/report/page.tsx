"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { supabase, type ReportRow } from "@/lib/supabase";
import { ModelBar } from "@/components/report/ModelBar";
import { HistoricalChart } from "@/components/report/HistoricalChart";

function fmt(n: number) {
  if (n >= 1_000_000) return "₪" + (n / 1_000_000).toFixed(2) + "M";
  return "₪" + new Intl.NumberFormat("he-IL").format(Math.round(n));
}

function fmtPct(n: number, decimals = 1) {
  return (n >= 0 ? "+" : "") + n.toFixed(decimals) + "%";
}

function StatusBadge({ status }: { status: "overpriced" | "fair" | "underpriced" }) {
  const map = {
    overpriced: { label: "יקר מהשווי", cls: "bg-red-50 text-red-700 border-red-200" },
    fair:       { label: "תמחור הוגן", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    underpriced:{ label: "זול מהשווי", cls: "bg-green-50 text-green-700 border-green-200" },
  };
  const { label, cls } = map[status];
  return <span className={`text-xs font-medium px-3 py-1 rounded-full border ${cls}`}>{label}</span>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white border border-gray-200 rounded-xl p-5 ${className}`}>{children}</div>;
}

function MetricTile({ label, value, sub, color = "" }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3 text-center">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className={`text-lg font-semibold ${color}`}>{value}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

// Demo data shown when running without Supabase
const DEMO_ROW: ReportRow = {
  id: "demo",
  user_id: null,
  created_at: new Date().toISOString(),
  tier: "standard",
  city: "תל אביב",
  rooms: 4,
  market_price: 2_400_000,
  paff: 1_850_000,
  v_rent: 2_050_000,
  v_cost: 1_950_000,
  price_premium_pct: 22.4,
  pir: 13.3,
  hai: 62,
  dsti: 46.9,
  uch_annual: 132_000,
  rent_annual: 90_000,
  inputs_json: {},
  share_token: "demo",
  paid: true,
  stripe_session_id: null,
};

const DEMO_ROW_APPRAISER: ReportRow = {
  ...DEMO_ROW,
  id: "demo-appraiser",
  tier: "appraiser",
  share_token: "demo-appraiser",
  v_econ: 1_920_000,
  price_premium_pct: 19.8,
  inputs_json: { wPaff: 20, wRent: 50, wCost: 30 },
};

function ReportFromSupabase({ id }: { id: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [report, setReport] = useState<ReportRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // אם חזרנו מקארדקום — עדכן paid=true לפני שמביאים את הדוח
      const fromCardcom = params.get("paid") === "true" || params.get("SuccessIndicator") !== null;
      if (fromCardcom) {
        await supabase.from("reports").update({ paid: true }).eq("id", id);
        // שלח מייל ללקוח עם קישור לדוח
        try {
          await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-report-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({ report_id: id }),
          });
        } catch (_) {}
      }

      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", id)
        .eq("paid", true)
        .single();

      if (error || !data) router.push("/");
      else setReport(data as ReportRow);
      setLoading(false);
    }
    load();
  }, [id, router, params]);

  if (loading) return <div className="text-center py-20 text-gray-400">טוען דוח...</div>;
  if (!report) return null;
  return <ReportView report={report} isDemo={false} />;
}

function WeightsCard({ inputs }: { inputs: Record<string, unknown> }) {
  const wPaff = (inputs.wPaff as number) ?? 33;
  const wRent = (inputs.wRent as number) ?? 33;
  const wCost = (inputs.wCost as number) ?? 34;
  const wSum = (wPaff + wRent + wCost) || 1;
  const rows = [
    { label: "Paff (יכולת מימון)", w: wPaff },
    { label: "Vrent (הכנסה משכירות)", w: wRent },
    { label: "Vcost (עלות ייצור)", w: wCost },
  ];
  return (
    <Card>
      <h2 className="text-sm font-semibold text-gray-900 mb-3">שקלול מודלים שהוחל</h2>
      <div className="flex flex-col gap-2">
        {rows.map(({ label, w }) => {
          const pct = Math.round(w / wSum * 100);
          return (
            <div key={label} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-44 text-right flex-shrink-0">{label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs font-semibold text-blue-700 w-9 text-left">{pct}%</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 mt-3">השקלול קובע את משקל כל מודל בחישוב V* (נקודת המרכז לחישוב פרמיית המחיר)</p>
    </Card>
  );
}

function ReportView({ report, isDemo }: { report: ReportRow; isDemo: boolean }) {
  const values = [report.paff, report.v_rent, report.v_cost, ...(report.v_econ ? [report.v_econ] : [])].filter(v => v > 0);
  const vL = Math.min(...values);
  const vU = Math.max(...values);
  const vStar = values.reduce((a, b) => a + b, 0) / values.length;
  const premium = report.price_premium_pct ?? ((report.market_price - vStar) / vStar) * 100;
  const status: "overpriced" | "fair" | "underpriced" =
    premium > 5 ? "overpriced" : premium < -5 ? "underpriced" : "fair";
  const premiumColor =
    status === "overpriced" ? "text-red-600" : status === "underpriced" ? "text-green-600" : "text-amber-600";
  const uchDiff = (report.uch_annual - report.rent_annual) / 12;
  const buyIsExpensive = report.uch_annual > report.rent_annual;
  const createdDate = new Date(report.created_at).toLocaleDateString("he-IL", { year: "numeric", month: "long", day: "numeric" });
  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/share?token=${report.share_token}`
    : `/share?token=${report.share_token}`;

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-5">

        {isDemo && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 text-center">
            ⚠️ זהו דוח הדגמה בלבד — לדוח אמיתי, <a href="/price-vs-value/" className="underline font-medium">מלא נכס חדש</a>.
          </div>
        )}

        {!isDemo && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap print:hidden">
            <div className="flex items-center gap-2 text-sm text-green-800">
              <span>✓</span>
              <span>הדוח שלך מוכן — <strong>מומלץ לשמור עותק PDF</strong> כדי שיהיה לך תמיד נגיש.</span>
            </div>
            <button
              onClick={() => window.print()}
              className="text-xs px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex-shrink-0"
            >
              ⬇ שמור PDF עכשיו
            </button>
          </div>
        )}

        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">דוח ניתוח פונדמנטלי</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {report.city} · {report.rooms} חדרים · {createdDate}
              <span className="mr-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {report.tier === "appraiser" ? "ניתוח מורחב" : "ניתוח בסיסי"}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="text-xs px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              ⬇ שמור PDF
            </button>
            {!isDemo && (
              <button
                onClick={() => navigator.clipboard.writeText(shareUrl)}
                className="text-xs px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                🔗 שתף
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricTile label="מחיר שוק" value={fmt(report.market_price)} />
          <MetricTile label="טווח שווי פונד׳" value={`${fmt(vL)}–${fmt(vU)}`} color="text-blue-700" />
          <MetricTile label="פרמיית מחיר" value={fmtPct(premium)}
            sub={status === "overpriced" ? "יקר מהשווי" : status === "underpriced" ? "זול מהשווי" : "תמחור הוגן"}
            color={premiumColor} />
          <MetricTile label="סיכון מערכתי" value="גבוה" sub="SRI ≈ +1.8σ" color="text-amber-600" />
        </div>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">ארבעת מודלי השווי הפונדמנטלי</h2>
            <StatusBadge status={status} />
          </div>
          <ModelBar label="Paff" value={report.paff} marketPrice={report.market_price} vL={vL} vU={vU} />
          <ModelBar label="Vrent" value={report.v_rent} marketPrice={report.market_price} vL={vL} vU={vU} />
          <ModelBar label="Vcost" value={report.v_cost} marketPrice={report.market_price} vL={vL} vU={vU} />
          {report.tier === "standard" ? (
            <div className="mt-3 bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-500 flex items-start gap-2">
              <span>🔒</span>
              <span>המודל האקונומטרי (V<sub>econ</sub>) וניתוח שקלול מותאם זמינים בניתוח המורחב בלבד</span>
            </div>
          ) : report.v_econ ? (
            <ModelBar label="V_econ" value={report.v_econ} marketPrice={report.market_price} vL={vL} vU={vU} />
          ) : null}
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">נגישות ועומס מימוני</h2>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <MetricTile label="PIR" value={report.pir.toFixed(1) + "x"} sub="ממוצע OECD: 7x"
                color={report.pir > 9 ? "text-red-600" : "text-amber-600"} />
              <MetricTile label="HAI" value={report.hai.toFixed(0)}
                sub={report.hai < 100 ? "אינו נגיש" : "נגיש"}
                color={report.hai < 100 ? "text-red-600" : "text-green-600"} />
              <MetricTile label="DSTI" value={report.dsti.toFixed(1) + "%"} sub="מגבלה: 35%"
                color={report.dsti > 35 ? "text-red-600" : "text-amber-600"} />
            </div>
            <div className="border-t border-gray-100 pt-3">
              <div className="text-xs font-medium text-gray-700 mb-2">מבחן כדאיות — UCH</div>
              <div className="flex justify-between text-xs py-1.5 border-b border-gray-50">
                <span className="text-gray-500">עלות שימוש שנתית (UCH)</span>
                <span className={`font-medium ${buyIsExpensive ? "text-red-600" : "text-green-600"}`}>{fmt(report.uch_annual)}</span>
              </div>
              <div className="flex justify-between text-xs py-1.5 border-b border-gray-50">
                <span className="text-gray-500">שכ״ד שוק שנתי</span>
                <span className="font-medium">{fmt(report.rent_annual)}</span>
              </div>
              <div className={`flex justify-between text-xs py-2 px-2 rounded-lg mt-1
                ${buyIsExpensive ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                <span>{buyIsExpensive ? "עדיפות שכירות" : "עדיפות רכישה"}</span>
                <span className="font-semibold">{fmt(Math.abs(uchDiff))}/חודש</span>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">מדד סיכון מערכתי (SRI)</h2>
            <div className="flex flex-col gap-2">
              {[
                { label: "פער תמחור", z: "+2.1σ", color: "text-red-600" },
                { label: "עומס חוב (DSR)", z: "+1.4σ", color: "text-amber-600" },
                { label: "פער אשראי / תמ״ג", z: "+1.2σ", color: "text-amber-600" },
                { label: "משכנתאות סיכון", z: "+0.7σ", color: "text-gray-600" },
                { label: "כריות הון בנקאיות", z: "−0.3σ", color: "text-green-600" },
              ].map(row => (
                <div key={row.label} className="flex justify-between text-xs py-1 border-b border-gray-50 last:border-0">
                  <span className="text-gray-500">{row.label}</span>
                  <span className={`font-medium ${row.color}`}>{row.z}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 bg-amber-50 rounded-lg px-3 py-2 text-xs text-amber-700 font-medium text-center">
              SRI משולב: גבוה — Z ≈ +1.84
            </div>
          </Card>
        </div>

        {report.tier === "appraiser" && (
          <WeightsCard inputs={report.inputs_json} />
        )}

        <Card>
          <h2 className="text-sm font-semibold text-gray-900 mb-4">ניתוח היסטורי 2000–2024</h2>
          <HistoricalChart />
        </Card>

        <Card>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">סיכום ומסקנה</h2>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 leading-relaxed">
            הנכס נסחר ב-<strong className="text-gray-900">{fmt(report.market_price)}</strong>,
            שהוא <strong className={premiumColor}>{fmtPct(premium)}</strong> {premium > 0 ? "מעל" : "מתחת ל"}{" "}טווח
            השווי הפונדמנטלי [{fmt(vL)}–{fmt(vU)}].
            מבחן ה-UCH מראה{" "}
            {buyIsExpensive
              ? <>שעלות האחזקה עולה על שכ״ד בשוק ב-<strong className="text-red-700">{fmt(Math.abs(uchDiff))}/חודש</strong></>
              : <>שהרכישה עדיפה תזרימית ב-<strong className="text-green-700">{fmt(Math.abs(uchDiff))}/חודש</strong></>
            }.
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center leading-relaxed">
            דוח זה אינו המלצת השקעה ואינו תחליף לשמאות פרטנית.<br />
            הכלי מיועד לדירות מגורים ואינו מתאים לנכסים מיוחדים, דירות יוקרה, וילות, אחוזות, נחלות או דירות פאר.<br />
            מחיר מול שווי © 2025
          </p>
        </Card>

      </div>
    </main>
  );
}

function ReportContent() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const isDemo = params.get("demo") === "true" || id.startsWith("demo-");

  if (isDemo || !id) {
    const demoReport = params.get("demo") === "appraiser" ? DEMO_ROW_APPRAISER : DEMO_ROW;
    return <ReportView report={demoReport} isDemo={true} />;
  }

  return <ReportFromSupabase id={id} />;
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">טוען דוח...</div>}>
      <ReportContent />
    </Suspense>
  );
}
