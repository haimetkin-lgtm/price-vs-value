"use client";
import { useState } from "react";
import { redirectToStripePayment, TIER_CONFIG, type ReportTier } from "@/lib/stripe";
import { saveReport, type SaveReportParams } from "@/lib/reports";

interface PaywallProps {
  reportParams: SaveReportParams;
  onCancel: () => void;
}

export function Paywall({ reportParams, onCancel }: PaywallProps) {
  const [selected, setSelected] = useState<ReportTier>("standard");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  async function handleCheckout() {
    if (!email) { setError("נא להזין אימייל לקבלת הדוח."); return; }
    setLoading(true);
    setError("");
    try {
      const reportId = await saveReport({ ...reportParams, name, email, phone });
      redirectToStripePayment(selected, reportId);
    } catch (e) {
      setError("אירעה שגיאה. נסה שוב.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 flex flex-col gap-5">
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-900">בחר סוג דוח</h2>
          <p className="text-sm text-gray-500 mt-1">תשלום חד-פעמי — אין מנוי</p>
        </div>

        <div className="flex flex-col gap-3">
          {(["standard", "appraiser"] as ReportTier[]).map((tier) => {
            const { amount, label } = TIER_CONFIG[tier];
            const isSelected = selected === tier;
            const features = tier === "standard"
              ? [
                  "3 מודלי שווי: Paff · Vrent · Vcost",
                  "מדדי נגישות: PIR · HAI · DSTI",
                  "מבחן כדאיות UCH (שכירות מול רכישה)",
                  "גרף היסטורי 2000–2024",
                  "PDF להורדה",
                ]
              : [
                  "כל מה שבניתוח הבסיסי +",
                  "מודל אקונומטרי רביעי: V_econ",
                  "ניתוח רגישות — השפעת שינויי ריבית",
                  "ניתוח רב-מודלי מלא עם משקולות",
                  "PDF מורחב עם פירוט מלא",
                ];

            return (
              <button
                key={tier}
                onClick={() => setSelected(tier)}
                className={`text-right p-4 rounded-xl border-2 transition-colors
                  ${isSelected ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-900">{label}</span>
                  <span className={`text-xl font-bold ${isSelected ? "text-blue-600" : "text-gray-700"}`}>
                    ₪{amount}
                  </span>
                </div>
                <ul className="flex flex-col gap-1">
                  {features.map(f => (
                    <li key={f} className="text-xs text-gray-500 flex items-center gap-1.5">
                      <span className={isSelected ? "text-blue-500" : "text-gray-300"}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                {tier === "appraiser" && (
                  <span className="mt-2 inline-block text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    מומלץ למשקיעים ואנשי מקצוע
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-700 text-right">פרטים למשלוח הדוח</p>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">שם מלא</label>
            <input
              type="text"
              autoComplete="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="ישראל ישראלי"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">אימייל <span className="text-red-500">*</span></label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="ltr"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">טלפון <span className="text-gray-300">(אופציונלי)</span></label>
            <input
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="050-0000000"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              dir="ltr"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <div className="flex flex-col gap-2">
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold
              hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "מעביר לתשלום..." : `לתשלום ₪${TIER_CONFIG[selected].amount} →`}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2 text-sm text-gray-400 hover:text-gray-600"
          >
            ביטול
          </button>
        </div>

        <p className="text-center text-xs text-gray-400">
          🔒 תשלום מאובטח דרך Cardcom · לא נשמר מספר כרטיס
        </p>
      </div>
    </div>
  );
}
