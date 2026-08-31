"use client";
import { useState } from "react";
import { FAQ_ITEMS } from "@/lib/content";

const GLOSSARY = [
  { term: "שווי פונדמנטלי", full: "Fundamental Value", desc: "שווי הנגזר מעוגני יכולת מימון, הכנסה משכירות ועלות ייצור. ההפרש בינו לבין מחיר השוק הוא מדד לגודל בועת המחיר בדירה." },
  { term: "Paff", full: "Price Affordability", desc: "המחיר המרבי שניתן לממן באופן סביר. מחושב על בסיס ההכנסה החודשית נטו, ההון העצמי, ההתחייבויות הקיימות ותנאי המשכנתא שהוזנו." },
  { term: "Vrent", full: "Value by Rent", desc: "שווי הנכס לפי השכירות שהוא מניב. מהוון לפי ריבית חסרת סיכון, פרמיית סיכון וצמיחת שכ\"ד. ככל שהמחיר גבוה יותר מ-Vrent, כך תשואת השכירות נמוכה יותר." },
  { term: "Vcost", full: "Value by Cost", desc: "אינדיקציה לעלות הקמת דירה דומה מאפס. בנייה, קרקע, פיתוח ורווח יזמי. מחיר הגבוה משמעותית מ-Vcost מחייב הסבר כלכלי: מיקום, זכויות, מחסור או איכות." },
  { term: "Vecon (DCF)", full: "Value by Discounted Cash Flow", desc: "תרחיש היוון תזרים מזומנים לעשר שנות אחזקה הכולל הכנסות שכירות וערך שיורי. הוא משמש לבדיקת רגישות ארוכת טווח; כאשר ההנחות זהות למודל Vrent, אין לראות בו עוגן עצמאי נוסף." },
  { term: "PIR", full: "Price-to-Income Ratio", desc: "כמה שנות הכנסה שנתית נדרשות לרכישת דירה. ככל שהיחס גבוה יותר ביחס לעבר ולאזורים דומים, רמת הנגישות נמוכה יותר." },
  { term: "HAI", full: "Housing Affordability Index", desc: "האם הכנסת משק הבית הממוצע מספיקה לעמוד בתשלומי המשכנתא. מעל 100 נגיש, מתחת 100 לא נגיש." },
  { term: "DSTI", full: "Debt Service-to-Income", desc: "אחוז ההכנסה החודשית המופנה להחזר חובות (משכנתא + הלוואות). רף שמרני מומלץ במערכת: עד 35%. בנק ישראל אוסר בדרך כלל שיעור החזר העולה על 50%, ומחמיר את דרישות ההון מעל 40%." },
  { term: "UCH", full: "User Cost of Housing", desc: "העלות השנתית האמיתית של בעלות על הדירה: ריבית, פחת, תחזוקה ומסים, בניכוי עליית ערך צפויה. ניתן להשוות ישירות לשכ\"ד שוק." },
  { term: "SRI", full: "Systemic Risk Index", desc: "מדד סיכון מערכתי של שוק הנדל\"ן. משלב פער תמחור, עומס חוב משקי בית ואשראי ביחס לתמ\"ג. מוצג כ-Z-score ביחס לסדרה ההיסטורית: ערך גבוה מצביע על חריגה מהממוצע." },
];

function GlossaryAccordion() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <h2 className="text-base font-bold text-gray-900 mb-4">מה המושגים האלה אומרים?</h2>
      <div className="flex flex-col divide-y divide-gray-100">
        {GLOSSARY.map(({ term, full, desc }) => (
          <div key={term}>
            <button
              onClick={() => setOpen(open === term ? null : term)}
              className="w-full flex items-center justify-between py-3 text-right gap-3 hover:bg-gray-50 transition-colors px-1 rounded"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-blue-700 w-12 text-right flex-shrink-0">{term}</span>
                <span className="text-xs text-gray-500">{full}</span>
              </div>
              <span className="text-gray-400 text-xs flex-shrink-0">{open === term ? "▲" : "▼"}</span>
            </button>
            {open === term && (
              <p className="text-xs text-gray-600 leading-relaxed pb-3 px-1 pr-16">{desc}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
import { StepIndicator } from "@/components/ui/StepIndicator";
import { Paywall } from "@/components/Paywall";
import { Step1Property } from "@/components/forms/Step1Property";
import { Step2Paff } from "@/components/forms/Step2Paff";
import { Step3Rent } from "@/components/forms/Step3Rent";
import { Step4Cost } from "@/components/forms/Step4Cost";
import { Step5Assumptions } from "@/components/forms/Step5Assumptions";
import {
  tryCalculateAnalysis,
  type AllInputs,
} from "@/lib/models";

const STEPS = [
  { label: "נכס" },
  { label: "מימון" },
  { label: "שכירות" },
  { label: "עלויות" },
  { label: "הנחות" },
];

const DEFAULTS: Partial<AllInputs> = {
  theta: 0.33,
  nMonths: 300,
  ltvMax: 0.75,
  vacancyRate: 0.05,
  rfNominal: 0.04,
  inflation: 0.025,
  riskPremium: 0.04,
  rentGrowth: 0.01,
  rdReal: 0.025,
  reReal: 0.035,
  equityRatio: 0.30,
  taxRate: 0.002,
  maintenanceRate: 0.005,
  depreciationRate: 0.01,
  rhoPremium: 0.01,
  eDeltaP: 0,
  profitMargin: 0.15,
  purpose: "own",
  // Step 4 cost defaults (match placeholder values)
  hardCosts: 9000,
  indirectCosts: 1500,
  softCosts: 2000,
  financeCosts: 2500,
  constructionTaxes: 3000,
  marketing: 1000,
  contingency: 800,
  landMarketValuePerSqm: 8000,
  wPaff: 33,
  wRent: 33,
  wCost: 34,
  primeRate: 5,
};

function fmt(n: number) {
  return new Intl.NumberFormat("he-IL", { maximumFractionDigits: 0 }).format(n);
}

function fmtPct(n: number) {
  return (n >= 0 ? "+" : "") + n.toFixed(1) + "%";
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState<Partial<AllInputs>>(DEFAULTS);
  const [showPaywall, setShowPaywall] = useState(false);

  function handleChange(field: keyof AllInputs, value: number | string) {
    setInputs(prev => ({ ...prev, [field]: value }));
  }

  const canCalc = !!(
    inputs.marketPrice && inputs.yNet && inputs.equity &&
    inputs.rentMonthly && inputs.hardCosts
  );

  const stepRequired: Record<number, { field: keyof AllInputs; label: string }[]> = {
    0: [{ field: "marketPrice", label: "מחיר הנכס" }, { field: "purchaseDate", label: "מועד העסקה" }],
    1: [{ field: "yNet", label: "הכנסה חודשית נטו" }, { field: "equity", label: "הון עצמי" }],
    2: [{ field: "rentMonthly", label: "שכר דירה חודשי" }],
    3: [],
    4: [],
  };

  const missingFields = stepRequired[step]?.filter(r => !inputs[r.field]) ?? [];
  const canProceed = missingFields.length === 0;

  const calculation = canCalc ? tryCalculateAnalysis(inputs) : { data: null, error: null };
  const analysis = calculation.data;
  const results = analysis?.triangulation ?? null;
  const uchResult = analysis?.uch ?? null;
  const accessResult = analysis?.accessibility ?? null;
  const veconResult = analysis?.vecon ?? null;

  const statusColor = !results ? "text-gray-400"
    : results.status === "overpriced" ? "text-red-600"
    : results.status === "underpriced" ? "text-green-600"
    : results.status === "inconclusive" ? "text-gray-600"
    : "text-amber-600";

  const statusLabel = !results ? "-"
    : results.status === "overpriced" ? "פרמיה מעל העוגנים"
    : results.status === "underpriced" ? "מתחת לעוגנים"
    : results.status === "inconclusive" ? "פער לא מכריע"
    : "בתחום העוגנים";

  const paywallParams = canCalc && results && uchResult && accessResult ? {
    tier: "standard" as const,
    city: inputs.city ?? "",
    rooms: inputs.rooms ?? 0,
    marketPrice: inputs.marketPrice!,
    paff: Math.round(results.modelValues.paff),
    vRent: Math.round(results.modelValues.vRent),
    vcost: Math.round(results.modelValues.vcost),
    vEcon: veconResult ? Math.round(veconResult.vEcon) : undefined,
    pricePremiumPct: results.pricePremiumPct,
    pir: accessResult.pir,
    hai: accessResult.hai,
    dsti: accessResult.dsti,
    uchAnnual: Math.round(uchResult.uchAnnual),
    rentAnnual: Math.round(uchResult.rentAnnual),
    inputsJson: { ...inputs, analysisSnapshot: {
      vL: results.vL, vU: results.vU, vStar: results.vStar,
      pricePremiumPct: results.pricePremiumPct, status: results.status,
      dispersionPct: results.dispersionPct, confidence: results.confidence,
      modelValues: results.modelValues, deviations: results.deviations,
    }} as Record<string, unknown>,
  } : null;

  return (
    <main className="min-h-screen flex flex-col items-center py-8 px-4">
      {showPaywall && paywallParams && (
        <Paywall reportParams={paywallParams} onCancel={() => setShowPaywall(false)} />
      )}
      <div className="w-full max-w-2xl">

        {/* Hero */}
        <div className="text-center mb-8 pt-2">
          <p className="text-xs font-medium tracking-widest text-amber-500 uppercase mb-3">
            Price vs Value · Bubble Indicator
          </p>
          <h1 className="text-3xl font-bold text-gray-900 leading-snug">
            מה גודל הבועה במחיר הדירה?
          </h1>
          <p className="text-base text-gray-500 mt-2">
            מודדים את הפער בין מחיר השוק לשווי הפונדמנטלי
          </p>
          <div className="flex justify-center gap-6 mt-5 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="text-green-500">✓</span> מדדי נגישות PIR · HAI · DSTI
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-green-500">✓</span> מבחן כדאיות שכירות מול רכישה
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-green-500">✓</span> דוח PDF להורדה
            </span>
          </div>
          <div className="mt-4 text-xs text-gray-400">
            מ-<span className="text-gray-600 font-medium">₪18</span> · תשלום חד-פעמי · ללא מנוי
          </div>
          <div className="mt-4 flex justify-center gap-3 flex-wrap">
            <a
              href="/price-vs-value/report?demo=true"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm"
            >
              ראה דוח בסיסי לדוגמה →
            </a>
            <a
              href="/price-vs-value/report?demo=appraiser"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-sm text-blue-700 hover:bg-blue-100 transition-colors shadow-sm"
            >
              ראה דוח מורחב לדוגמה →
            </a>
          </div>
          <div className="mt-3">
            <a href="#glossary" className="text-xs text-blue-500 hover:text-blue-700 transition-colors">
              מה המושגים האלה אומרים? ↓
            </a>
          </div>
        </div>

        {/* תוצאה חיה */}
        <div className={`bg-white border rounded-xl p-5 mb-6 shadow-sm transition-colors
          ${canCalc ? "border-blue-200" : "border-gray-200"}`}>
          {!canCalc ? (
            <p className="text-center text-sm text-gray-400 py-2">
              מלא את השדות הנדרשים כדי לראות חישוב חי
            </p>
          ) : calculation.error ? (
            <p className="text-center text-sm text-red-600 py-2">לא ניתן לחשב: בדוק שהערכים חיוביים ובטווח תקין.</p>
          ) : results && (
            <>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-gray-400 mb-1">מחיר שוק</div>
                  <div className="text-lg font-semibold">₪{fmt(inputs.marketPrice!)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">טווח שווי פונד׳</div>
                  <div className="text-base font-semibold text-blue-700">
                    ₪{fmt(results.vL)}–{fmt(results.vU)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">פער מחיר מול שווי · מדד הבועה</div>
                  <div className={`text-lg font-semibold ${statusColor}`}>
                    {fmtPct(results.pricePremiumPct)}
                  </div>
                  <div className={`text-xs font-medium ${statusColor}`}>{statusLabel}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    פיזור {results.dispersionPct.toFixed(0)}% · אמינות {results.confidence === "high" ? "גבוהה" : results.confidence === "medium" ? "בינונית" : "נמוכה"}
                  </div>
                </div>
              </div>

              {uchResult && (
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-3 text-center text-sm">
                  <div>
                    <span className="text-xs text-gray-400 block mb-0.5">UCH שנתי</span>
                    <span className={uchResult.buyingIsExpensive ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                      ₪{fmt(uchResult.uchAnnual)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block mb-0.5">שכ״ד שוק שנתי</span>
                    <span className="font-medium">₪{fmt(uchResult.rentAnnual)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block mb-0.5">הפרש חודשי</span>
                    <span className={`font-medium ${uchResult.buyingIsExpensive ? "text-red-600" : "text-green-600"}`}>
                      {uchResult.monthlyDifference >= 0 ? "+" : ""}₪{fmt(uchResult.monthlyDifference)}/חודש
                    </span>
                  </div>
                </div>
              )}

              {accessResult && (
                <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="text-gray-500">
                    PIR <span className="block text-base font-semibold text-gray-800">{accessResult.pir.toFixed(1)}x</span>
                  </div>
                  <div className="text-gray-500">
                    HAI <span className={`block text-base font-semibold ${accessResult.hai < 100 ? "text-red-600" : "text-green-600"}`}>
                      {accessResult.hai.toFixed(0)}
                    </span>
                  </div>
                  <div className="text-gray-500">
                    DSTI <span className={`block text-base font-semibold ${accessResult.dsti > 35 ? "text-red-600" : "text-amber-600"}`}>
                      {accessResult.dsti.toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* טופס */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <StepIndicator steps={STEPS} currentStep={step} onStepClick={setStep} />
          </div>

          <div className="p-6">
            {step === 0 && <Step1Property values={inputs} onChange={handleChange} />}
            {step === 1 && <Step2Paff values={inputs} onChange={handleChange} />}
            {step === 2 && <Step3Rent values={inputs} onChange={handleChange} />}
            {step === 3 && <Step4Cost values={inputs} onChange={handleChange} />}
            {step === 4 && <Step5Assumptions values={inputs} onChange={handleChange} />}
          </div>

          <div className="px-6 pb-6 flex gap-3 justify-between border-t border-gray-100 pt-4">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="px-5 py-2 text-sm rounded-lg border border-gray-200 text-gray-600
                disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              ← הקודם
            </button>

            {step < 4 ? (
              <div className="flex flex-col items-end gap-1">
                {!canProceed && (
                  <p className="text-xs text-red-500">
                    נדרש: {missingFields.map(f => f.label).join(", ")}
                  </p>
                )}
                <button
                  onClick={() => canProceed && setStep(s => Math.min(4, s + 1))}
                  disabled={!canProceed}
                  className="px-5 py-2 text-sm rounded-lg bg-blue-600 text-white
                    hover:bg-blue-700 transition-colors font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  הבא →
                </button>
              </div>
            ) : (
              <button
                disabled={!canCalc}
                onClick={() => {
                  if (typeof window !== "undefined" && typeof window.gtag === "function") {
                    window.gtag("event", "calculator_complete");
                  }
                  setShowPaywall(true);
                }}
                className="px-6 py-2 text-sm rounded-lg bg-green-600 text-white
                  hover:bg-green-700 transition-colors font-medium disabled:opacity-40"
              >
                הפק דוח, ₪18
              </button>
            )}
          </div>
        </div>
      </div>

      {/* מילון מושגים */}
      <div id="glossary" className="w-full max-w-2xl mt-12 mb-8">
        <GlossaryAccordion />
      </div>

      {/* שירות שמאות לצרכים משפטיים */}
      <div className="w-full max-w-2xl mb-12">
        <div className="bg-blue-950 rounded-xl p-6 text-right">
          <h3 className="text-base font-bold text-white mb-3">
            נדרש דוח שמאות לצרכים משפטיים?
          </h3>
          <p className="text-sm text-blue-200 leading-relaxed mb-4">
            אם הניתוח מצביע על תמחור חריג ואתה שוקל הגשת תביעה בגין משכנתא עודפת,
            ניתן להזמין דוח שמאות מקצועי ומפורט, המתאים להגשה לבית משפט ולהליכים משפטיים מול הבנק.
            יש להצטייד בעורך דין לצורך הגשת התביעה, ומומלץ להתייעץ עם עורך דין עוד בטרם ביצוע הפנייה.
          </p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-2">
              <a
                href="mailto:haimetkin@gmail.com?subject=בקשה לדוח שמאות לצרכים משפטיים"
                className="inline-block px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-white
                  font-semibold text-sm rounded-lg transition-colors"
              >
                פנה להזמנת דוח שמאות ←
              </a>
              <p className="text-xs text-blue-300">
                פנייה ראשונית ללא התחייבות · מענה תוך יום עסקים
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 opacity-70">
              <svg viewBox="0 0 40 40" width="34" height="34" xmlns="http://www.w3.org/2000/svg" style={{direction: "ltr"}}>
                <rect width="40" height="40" rx="7" fill="#1b3a6b"/>
                <text x="6" y="28" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="22" fill="white">P</text>
                <text x="22" y="34" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="15" fill="#f59e0b">v</text>
              </svg>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-white tracking-tight">Price<span className="text-amber-400">vs</span>Value</span>
                <span className="text-xs text-blue-300">מחיר מול שווי</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* שאלות נפוצות */}
      <section className="w-full max-w-2xl mb-12">
        <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">שאלות נפוצות</h2>
        <div className="space-y-2">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.q}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-gray-800 flex items-center justify-between gap-3 hover:bg-gray-50">
                <span>{item.q}</span>
                <span className="text-blue-500 text-lg leading-none shrink-0 group-open:rotate-45 transition-transform">
                  +
                </span>
              </summary>
              <p className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* טקסט מקצועי */}
      <section className="w-full max-w-2xl mb-12 text-xs text-gray-400 leading-relaxed">
        <h2 className="text-sm font-semibold text-gray-500 mb-2">
          על הכלי: מדד לגודל בועת המחיר בדירה
        </h2>
        <p className="mb-2">
          PriceVsValue מודד את גודל בועת המחיר בדירה: ההפרש הכספי והאחוזי בין מחיר השוק לבין
          השווי הפונדמנטלי. השווי מושווה לשלושה עוגנים כלכליים משלימים: יכולת
          המימון של משק הבית (PIR, HAI ו-DSTI), ההכנסה הצפויה משכירות ועלות הייצור של הדירה.
          השקלול מציג את פער המחיר והשווי, טווח העוגנים ורמת ההסכמה ביניהם.
        </p>
        <p>
          פער חיובי מבטא את רכיב הבועה במחיר, כלומר החלק העולה על השווי הפונדמנטלי; פער שלילי מצביע
          על מחיר הנמוך ממנו. הצטברות פערים דומים בנכסים רבים מאפשרת לאמוד את גודל הבועה בשוק.
          הכלי מבוסס על הגישה המחקרית של הספר
          <span className="text-gray-500"> בועת נדל״ן</span> מאת חיים אטקין, והוא אינו תחליף
          לשומת מקרקעין, לייעוץ השקעות או לבדיקה משפטית והנדסית.
        </p>
      </section>
    </main>
  );
}
