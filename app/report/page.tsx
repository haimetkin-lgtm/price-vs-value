"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { supabase, type ReportRow } from "@/lib/supabase";
import { ModelBar } from "@/components/report/ModelBar";
import { HistoricalChart } from "@/components/report/HistoricalChart";
import { calculateAnalysis, type AllInputs } from "@/lib/models";

function fmt(n: number) {
  if (n >= 1_000_000) return "₪" + (n / 1_000_000).toFixed(2) + "M";
  return "₪" + new Intl.NumberFormat("he-IL").format(Math.round(n));
}

function fmtPct(n: number, decimals = 1) {
  return (n >= 0 ? "+" : "") + n.toFixed(decimals) + "%";
}

type FundamentalStatus = "overpriced" | "within-range" | "underpriced" | "inconclusive";
function StatusBadge({ status }: { status: FundamentalStatus }) {
  const map = {
    overpriced: { label: "פרמיה מעל העוגנים", cls: "bg-red-50 text-red-700 border-red-200" },
    "within-range": { label: "בתחום העוגנים", cls: "bg-amber-50 text-amber-700 border-amber-200" },
    underpriced:{ label: "מתחת לעוגנים", cls: "bg-green-50 text-green-700 border-green-200" },
    inconclusive:{ label: "פער לא מכריע", cls: "bg-gray-50 text-gray-700 border-gray-200" },
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

const DEMO_INPUTS: AllInputs = {
  marketPrice: 2_400_000, area: 100, city: "תל אביב", purpose: "own", rooms: 4,
  purchaseDate: "2026-08", yNet: 24_000, theta: 0.33, existingDebts: 1_000,
  fixedHousingCosts: 500, rNominal: 0.048, nMonths: 300, equity: 720_000, ltvMax: 0.75,
  rentMonthly: 7_500, vacancyRate: 0.05, expensesOpex: 4_500, rfNominal: 0.04,
  inflation: 0.025, riskPremium: 0.04, rentGrowth: 0.01, rdReal: 0.025,
  reReal: 0.035, equityRatio: 0.30, taxRate: 0.002, maintenanceRate: 0.005,
  depreciationRate: 0.01, rhoPremium: 0.01, eDeltaP: 0, hardCosts: 9_000,
  indirectCosts: 1_500, softCosts: 2_000, financeCosts: 2_500,
  constructionTaxes: 3_000, marketing: 1_000, contingency: 800,
  profitMargin: 0.15, landMarketValuePerSqm: 8_000, medianAnnualIncome: 200_000,
  wPaff: 50, wRent: 50, wCost: 0, primeRate: 5,
};

function buildDemoReport(tier: "standard" | "appraiser"): ReportRow {
  const inputs: AllInputs = tier === "appraiser"
    ? { ...DEMO_INPUTS, wPaff: 35, wRent: 65, wCost: 0 }
    : DEMO_INPUTS;
  const analysis = calculateAnalysis(inputs);
  const result = analysis.triangulation;
  return {
    id: tier === "appraiser" ? "demo-appraiser" : "demo",
    user_id: null, created_at: "2026-08-31T12:00:00.000Z", tier,
    city: inputs.city, rooms: inputs.rooms, market_price: inputs.marketPrice,
    paff: Math.round(result.modelValues.paff), v_rent: Math.round(result.modelValues.vRent),
    v_cost: Math.round(result.modelValues.vcost),
    v_econ: tier === "appraiser" ? Math.round(analysis.vecon.vEcon) : null,
    price_premium_pct: result.pricePremiumPct, pir: analysis.accessibility.pir,
    hai: analysis.accessibility.hai, dsti: analysis.accessibility.dsti,
    uch_annual: Math.round(analysis.uch.uchAnnual), rent_annual: Math.round(analysis.uch.rentAnnual),
    inputs_json: { ...inputs, analysisSnapshot: { method: "paff-vrent-v2",
      vL: result.vL, vU: result.vU, vStar: result.vStar,
      pricePremiumPct: result.pricePremiumPct, status: result.status,
      dispersionPct: result.dispersionPct, confidence: result.confidence,
      modelValues: result.modelValues, deviations: result.deviations,
    }},
    share_token: tier === "appraiser" ? "demo-appraiser" : "demo",
    paid: true, stripe_session_id: null,
  };
}

const DEMO_ROW = buildDemoReport("standard");
const DEMO_ROW_APPRAISER = buildDemoReport("appraiser");

function ReportFromSupabase({ accessToken }: { accessToken: string }) {
  const router = useRouter();
  const [report, setReport] = useState<ReportRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.rpc("get_paid_report_by_token", {
        p_token: accessToken,
      });
      const row = Array.isArray(data) ? data[0] : null;

      if (error || !row) router.push("/");
      else setReport(row as ReportRow);
      setLoading(false);
    }
    load();
  }, [accessToken, router]);

  if (loading) return <div className="text-center py-20 text-gray-400">טוען דוח...</div>;
  if (!report) return null;
  return <ReportView report={report} isDemo={false} />;
}

function WeightsCard({ inputs }: { inputs: Record<string, unknown> }) {
  const wPaff = (inputs.wPaff as number) ?? 50;
  const wRent = (inputs.wRent as number) ?? 50;
  const wSum = (wPaff + wRent) || 1;
  const rows = [
    { label: "Paff (יכולת מימון)", w: wPaff },
    { label: "Vrent (הכנסה משכירות)", w: wRent },
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
      <p className="text-xs text-gray-400 mt-3">השקלול קובע את משקל שני העוגנים העצמאיים בחישוב השווי המרכזי. Vcost מוצג כאבחון נפרד.</p>
    </Card>
  );
}

function ReportView({ report, isDemo }: { report: ReportRow; isDemo: boolean }) {
  const storedSnapshot = report.inputs_json.analysisSnapshot as {
    method?: string;
    vL?: number; vU?: number; vStar?: number; pricePremiumPct?: number;
    status?: FundamentalStatus; dispersionPct?: number; confidence?: "high" | "medium" | "low";
  } | undefined;
  const snapshot = storedSnapshot?.method === "paff-vrent-v2" ? storedSnapshot : undefined;
  const values = [report.paff, report.v_rent].filter(v => v > 0);
  const fallbackVStar = values.reduce((a, b) => a + b, 0) / values.length;
  const vL = Number.isFinite(snapshot?.vL) ? snapshot!.vL! : Math.min(...values);
  const vU = Number.isFinite(snapshot?.vU) ? snapshot!.vU! : Math.max(...values);
  const vStar = Number.isFinite(snapshot?.vStar) ? snapshot!.vStar! : fallbackVStar;
  const premium = Number.isFinite(snapshot?.pricePremiumPct)
    ? snapshot!.pricePremiumPct! : ((report.market_price - vStar) / vStar) * 100;
  const status: FundamentalStatus = snapshot?.status
    ?? (premium > 5 ? "overpriced" : premium < -5 ? "underpriced" : "within-range");
  const premiumColor =
    status === "overpriced" ? "text-red-600" : status === "underpriced" ? "text-green-600" : "text-amber-600";
  const uchDiff = (report.uch_annual - report.rent_annual) / 12;
  const buyIsExpensive = report.uch_annual > report.rent_annual;
  const createdDate = new Date(report.created_at).toLocaleDateString("he-IL", { year: "numeric", month: "long", day: "numeric" });
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-5">

        {isDemo && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 text-center">
            ⚠️ זהו דוח הדגמה בלבד - לדוח אמיתי, <a href="/price-vs-value/" className="underline font-medium">מלא נכס חדש</a>.
          </div>
        )}

        {!isDemo && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap print:hidden">
            <div className="flex items-center gap-2 text-sm text-green-800">
              <span>✓</span>
              <span>הדוח שלך מוכן - <strong>מומלץ לשמור עותק PDF</strong> כדי שיהיה לך תמיד נגיש.</span>
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
            <h2 className="text-sm font-semibold text-gray-900">עוגני השווי הפונדמנטלי</h2>
            <StatusBadge status={status} />
          </div>
          {Number.isFinite(snapshot?.dispersionPct) && (
            <p className="text-xs text-gray-500 mb-3">
              פיזור בין העוגנים: {snapshot!.dispersionPct!.toFixed(1)}% · רמת הסכמה: {snapshot?.confidence === "high" ? "גבוהה" : snapshot?.confidence === "medium" ? "בינונית" : "נמוכה"}
            </p>
          )}
          <ModelBar label="Paff" value={report.paff} marketPrice={report.market_price} vL={vL} vU={vU} />
          <ModelBar label="Vrent" value={report.v_rent} marketPrice={report.market_price} vL={vL} vU={vU} />
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-600 mb-1">Vcost - בדיקת עלות וקרקע</p>
            <p className="text-xs text-gray-400 mb-2">כולל מחיר קרקע בשוק ולכן אינו נכלל בשווי המרכזי, בטווח השווי או במדד גודל הבועה.</p>
            <ModelBar label="Vcost" value={report.v_cost} marketPrice={report.market_price} vL={vL} vU={vU} />
          </div>
          {report.tier === "standard" ? (
            <div className="mt-3 bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-500 flex items-start gap-2">
              <span>🔒</span>
              <span>המודל האקונומטרי (V<sub>econ</sub>) וניתוח שקלול מותאם זמינים בניתוח המורחב בלבד</span>
            </div>
          ) : report.v_econ ? (
            <ModelBar label="Vecon" value={report.v_econ} marketPrice={report.market_price} vL={vL} vU={vU} />
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
              <MetricTile label="DSTI" value={report.dsti.toFixed(1) + "%"} sub="רף מומלץ: 35%"
                color={report.dsti > 35 ? "text-red-600" : "text-amber-600"} />
            </div>
            <div className="border-t border-gray-100 pt-3">
              <div className="text-xs font-medium text-gray-700 mb-2">מבחן כדאיות - UCH</div>
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
              SRI משולב: גבוה - Z ≈ +1.84
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

        {!isDemo && (
          <Card className="border-blue-100 bg-blue-50">
            <div className="text-center flex flex-col gap-3">
              <div>
                <h2 className="text-sm font-bold text-blue-900">רוצה לדון בממצאים עם שמאי מקרקעין?</h2>
                <p className="text-xs text-blue-700 mt-1">חיים אטקין, שמאי מקרקעין ואנליסט נדל&quot;ן - ייעוץ אישי על הדוח שלך</p>
              </div>
              <button disabled className="w-full py-3 rounded-xl bg-gray-300 text-gray-600 font-semibold text-sm cursor-not-allowed">
                תשלום לייעוץ ייפתח לאחר השלמת אימות מאובטח
              </button>
              <p className="text-xs text-gray-400">תשלום מאובטח דרך Cardcom · לאחר התשלום תקבל קישור לפנייה ישירה בוואטסאפ</p>
            </div>
          </Card>
        )}

      </div>
    </main>
  );
}

function ReportContent() {
  const params = useSearchParams();
  const accessToken = params.get("access_token") ?? "";
  const isDemo = params.get("demo") !== null;

  if (isDemo || !accessToken) {
    const demoReport = params.get("demo") === "appraiser" ? DEMO_ROW_APPRAISER : DEMO_ROW;
    return <ReportView report={demoReport} isDemo={true} />;
  }

  return <ReportFromSupabase accessToken={accessToken} />;
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">טוען דוח...</div>}>
      <ReportContent />
    </Suspense>
  );
}
