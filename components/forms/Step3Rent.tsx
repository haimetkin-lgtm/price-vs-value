"use client";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { AllInputs } from "@/lib/models";

interface Props {
  values: Partial<AllInputs>;
  onChange: (field: keyof AllInputs, value: number | string) => void;
}

export function Step3Rent({ values, onChange }: Props) {
  const prime = values.primeRate ?? 6;
  const rfNominal = values.rfNominal ?? 0.04;
  const inflation = values.inflation ?? 0.025;
  const riskPremium = values.riskPremium ?? 0.02;
  const rentGrowth = values.rentGrowth ?? 0.01;
  const rfReal = (1 + rfNominal) / (1 + inflation) - 1;
  const yCap = (rfReal + riskPremium - rentGrowth) * 100;

  const rings = [
    { label: "מעגל א׳ — מרכז / גוש דן", from: prime + 1.5, to: prime + 1.5 },
    { label: "מעגל ב׳ — שרון / שפלה / ירושלים", from: prime + 2, to: prime + 2.5 },
    { label: "מעגל ג׳ — פריפריה", from: prime + 3, to: prime + 3.5 },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-1">שכירות והיוון — V<sub>rent</sub></h2>
        <p className="text-sm text-gray-500">נתוני שוק השכירות באזור הנכס</p>
      </div>

      <Input
        label="שכר דירה חודשי שוק"
        hint="כמה ניתן להשכיר נכס זה בשוק הנוכחי"
        unit="₪"
        type="number"
        value={values.rentMonthly ?? ""}
        onChange={e => onChange("rentMonthly", Number(e.target.value))}
        placeholder="7500"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="שיעור אי-תפוסה"
          hint="אחוז הזמן שהנכס עומד ריק"
          unit="%"
          type="number"
          value={values.vacancyRate ? (values.vacancyRate * 100).toFixed(1) : ""}
          onChange={e => onChange("vacancyRate", Number(e.target.value) / 100)}
          placeholder="5"
          step="0.5"
        />
        <Input
          label="הוצאות תפעול שנתיות"
          hint="תחזוקה, ביטוח, ניהול, ועד בית"
          unit="₪"
          type="number"
          value={values.expensesOpex ?? ""}
          onChange={e => onChange("expensesOpex", Number(e.target.value))}
          placeholder="12000"
        />
      </div>

      <div className="bg-blue-50 rounded-lg p-4 flex flex-col gap-4">
        <p className="text-xs font-medium text-blue-700">פרמטרי שיעור היוון (Build-up)</p>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="ריבית חסרת סיכון (נומינלית)"
            hint="תשואת אג״ח ממשלתי ל-10 שנים"
            unit="%"
            type="number"
            value={values.rfNominal ? (values.rfNominal * 100).toFixed(2) : ""}
            onChange={e => onChange("rfNominal", Number(e.target.value) / 100)}
            placeholder="4.0"
            step="0.1"
          />
          <Input
            label="ציפיות אינפלציה"
            unit="%"
            type="number"
            value={values.inflation ? (values.inflation * 100).toFixed(1) : ""}
            onChange={e => onChange("inflation", Number(e.target.value) / 100)}
            placeholder="2.5"
            step="0.1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="פרמיית סיכון (RP)"
            hint="סיכון ספציפי לשוק המגורים"
            unit="%"
            type="number"
            value={values.riskPremium ? (values.riskPremium * 100).toFixed(1) : ""}
            onChange={e => onChange("riskPremium", Number(e.target.value) / 100)}
            placeholder="2.0"
            step="0.1"
          />
          <Input
            label="צמיחת שכ״ד ריאלית (g)"
            hint="קצב גידול ריאלי ארוך-טווח"
            unit="%"
            type="number"
            value={values.rentGrowth ? (values.rentGrowth * 100).toFixed(1) : ""}
            onChange={e => onChange("rentGrowth", Number(e.target.value) / 100)}
            placeholder="1.0"
            step="0.1"
          />
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-700 mb-0.5">ריבית פריים נוכחית</p>
            <p className="text-xs text-gray-400">
              בדוק באתר{" "}
              <a href="https://www.boi.org.il" target="_blank" rel="noopener noreferrer" className="underline text-blue-500">
                בנק ישראל
              </a>
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              step="0.25"
              min={0}
              max={20}
              value={prime}
              onChange={e => onChange("primeRate", Number(e.target.value))}
              className="w-20 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <p className="text-xs font-medium text-gray-600 mb-2">שיעור היוון מומלץ לפי מעגל ביקוש</p>
          <div className="flex flex-col gap-1.5">
            {rings.map(({ label, from, to }) => (
              <div key={label} className="flex justify-between items-center text-xs">
                <span className="text-gray-500">{label}</span>
                <span className="font-semibold text-blue-700">
                  {from === to ? `${from.toFixed(1)}%` : `${from.toFixed(1)}%–${to.toFixed(1)}%`}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={`flex justify-between items-center text-xs px-3 py-2 rounded-lg mt-1
          ${yCap < rings[0].from - 0.5 || yCap > rings[2].to + 0.5
            ? "bg-amber-50 text-amber-700"
            : "bg-green-50 text-green-700"}`}>
          <span>שיעור ההיוון המחושב מהפרמטרים שלך</span>
          <span className="font-bold">{yCap.toFixed(2)}%</span>
        </div>
      </div>

      <Input
        label="הכנסה שנתית פנויה חציונית באזור"
        hint="לחישוב מדד PIR — נתון מהלמ״ס"
        unit="₪"
        type="number"
        value={values.medianAnnualIncome ?? ""}
        onChange={e => onChange("medianAnnualIncome", Number(e.target.value))}
        placeholder="180000"
      />
    </div>
  );
}
