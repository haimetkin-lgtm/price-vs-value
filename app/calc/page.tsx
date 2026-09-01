"use client";
import { useState } from "react";
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
  wPaff: 50,
  wRent: 50,
  wCost: 0,
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

  const calculation = canCalc ? tryCalculateAnalysis(inputs) : { data: null, error: null };
  const analysis = calculation.data;
  const results = analysis?.triangulation ?? null;
  const uchResult = analysis?.uch ?? null;
  const accessResult = analysis?.accessibility ?? null;

  const statusColor = !results ? "text-gray-400"
    : results.status === "overpriced" ? "text-red-600"
    : results.status === "underpriced" ? "text-green-600"
    : results.status === "inconclusive" ? "text-gray-600"
    : "text-amber-600";

  const statusLabel = !results ? "-"
    : results.status === "overpriced" ? "יקר מהשווי"
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
    pricePremiumPct: results.pricePremiumPct,
    pir: accessResult.pir,
    hai: accessResult.hai,
    dsti: accessResult.dsti,
    uchAnnual: Math.round(uchResult.uchAnnual),
    rentAnnual: Math.round(uchResult.rentAnnual),
    inputsJson: {
      ...inputs,
      analysisSnapshot: { method: "paff-vrent-v2",
        vL: results.vL, vU: results.vU, vStar: results.vStar,
        pricePremiumPct: results.pricePremiumPct, status: results.status,
        dispersionPct: results.dispersionPct, confidence: results.confidence,
        modelValues: results.modelValues, deviations: results.deviations,
      },
    } as Record<string, unknown>,
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
            Real Estate Valuation Tool
          </p>
          <h1 className="text-3xl font-bold text-gray-900 leading-snug">
            האם שילמת את המחיר הנכון?
          </h1>
          <p className="text-base text-gray-500 mt-2">
            שווי פונדמנטלי מבוסס Paff ו-Vrent, לצד בדיקת עלות Vcost נפרדת
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
                  <div className="text-xs text-gray-400 mb-1">פרמיית מחיר</div>
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
          <div className="px-6 pt-5 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5 mb-4">
              <svg viewBox="0 0 40 40" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="7" fill="#1b3a6b"/>
                <text x="7" y="29" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="23" fill="white" direction="ltr">P</text>
                <text x="23" y="33" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="15" fill="#f59e0b" direction="ltr">v</text>
              </svg>
              <div className="leading-tight">
                <div className="text-sm font-bold text-gray-900">Price<span className="text-amber-500">vs</span>Value</div>
                <div className="text-xs text-gray-400">מחשבון שווי נדל״ן</div>
              </div>
            </div>
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
              <button
                onClick={() => setStep(s => Math.min(4, s + 1))}
                className="px-5 py-2 text-sm rounded-lg bg-blue-600 text-white
                  hover:bg-blue-700 transition-colors font-medium"
              >
                הבא →
              </button>
            ) : (
              <button
                disabled={!canCalc}
                onClick={() => setShowPaywall(true)}
                className="px-6 py-2 text-sm rounded-lg bg-green-600 text-white
                  hover:bg-green-700 transition-colors font-medium disabled:opacity-40"
              >
                הפק דוח, ₪18
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
