"use client";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { AllInputs } from "@/lib/models";

interface Props {
  values: Partial<AllInputs>;
  onChange: (field: keyof AllInputs, value: number | string) => void;
}

const RINGS = [
  { label: "מעגל א׳ — מרכז / גוש דן", min: 1.0, max: 1.5 },
  { label: "מעגל ב׳ — שרון / שפלה / ירושלים", min: 1.5, max: 2.5 },
  { label: "מעגל ג׳ — פריפריה", min: 2.5, max: 3.5 },
];

export function Step3Rent({ values, onChange }: Props) {
  const [ring, setRing] = useState<number | null>(null);
  const [spread, setSpread] = useState<number>(1.5);

  const prime = values.primeRate;
  const rfNominal = values.rfNominal ?? 0.04;
  const inflation = values.inflation ?? 0.025;
  const riskPremium = values.riskPremium ?? 0.02;
  const rentGrowth = values.rentGrowth ?? 0.01;
  const rfReal = (1 + rfNominal) / (1 + inflation) - 1;
  const yCapModel = (rfReal + riskPremium - rentGrowth) * 100;

  function handleRingChange(idx: number) {
    setRing(idx);
    setSpread(Number(((RINGS[idx].min + RINGS[idx].max) / 2).toFixed(2)));
  }

  const recommendedCap = prime && ring !== null ? prime + spread : null;

  // צבע yCap לפי הטווח
  const primeSafe = prime ?? 5;
  const minAllRings = primeSafe + RINGS[0].min;   // מינימום מעגל א׳
  const maxAllRings = primeSafe + RINGS[2].max;   // מקסימום מעגל ג׳
  const ringMin = ring !== null ? primeSafe + RINGS[ring].min : null;
  const ringMax = ring !== null ? primeSafe + RINGS[ring].max : null;

  const yCapColor =
    yCapModel < minAllRings ? "text-red-600" :
    (ringMin !== null && ringMax !== null && yCapModel >= ringMin && yCapModel <= ringMax) ? "text-green-600" :
    "text-amber-600";

  const yCapWarning =
    yCapModel < minAllRings
      ? "שיעור נמוך מהמקובל לפי מיקום הנכס — שקול להעלות פרמיית סיכון בבלוק Build-up שמעל"
      : ring !== null && ringMin !== null && yCapModel < ringMin
      ? "שיעור נמוך יחסית למעגל שבחרת — שקול להעלות פרמיית סיכון"
      : null;

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

      <p className="text-xs text-gray-400 text-right leading-relaxed">
        השתמש בכלי העזר למטה כדי לבחון את שיעור ההיוון המתאים לנכס שלך לפי מיקומו —
        ואז התאם — אם תרצה לעשות זאת — את <strong className="text-gray-600">פרמיית הסיכון</strong> בבלוק Build-up שמעל עד שהשיעור המחושב מתיישב עם המומלץ.
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col gap-4">
        <p className="text-xs font-semibold text-gray-700">עוגן שיעור היוון — לפי ריבית פריים ומעגל ביקוש</p>

        {/* שדה פריים */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-gray-600 font-medium">ריבית פריים נוכחית</p>
            <a href="https://www.boi.org.il" target="_blank" rel="noopener noreferrer"
              className="text-xs text-blue-500 underline">בדוק שינויים באתר בנק ישראל</a>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="number" step="0.25" min={0} max={20}
              value={prime ?? ""}
              placeholder="5.0"
              onChange={e => onChange("primeRate", Number(e.target.value))}
              className="w-20 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
        </div>

        {/* בחירת מעגל */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <p className="text-xs text-gray-600 font-medium">מעגל ביקוש</p>
            <div className="relative group">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs cursor-help font-bold leading-none">?</span>
              <div className="absolute right-0 bottom-6 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 hidden group-hover:block z-10 shadow-xl leading-relaxed">
                <p className="font-semibold mb-1">מעגלי ביקוש בשוק הנדל״ן:</p>
                <p className="mb-0.5"><span className="text-blue-300">מעגל א׳</span> — תל אביב</p>
                <p className="mb-0.5"><span className="text-blue-300">מעגל ב׳</span> — ערי הלוויין של תל אביב</p>
                <p><span className="text-blue-300">מעגל ג׳</span> — פריפריה ופריפריה רחוקה</p>
              </div>
            </div>
          </div>
          {RINGS.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleRingChange(i)}
              className={`text-right px-3 py-2 rounded-lg border text-xs transition-colors
                ${ring === i ? "border-blue-400 bg-blue-50 text-blue-800" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"}`}
            >
              <span className="font-medium">{r.label}</span>
              <span className="mr-2 text-gray-400">(פריים +{r.min}% עד +{r.max}%)</span>
            </button>
          ))}
        </div>

        {/* בחירת תוספת */}
        {ring !== null && (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-600 font-medium">תוספת מעל הפריים</p>
              <span className="text-xs font-bold text-blue-700">+{spread.toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min={RINGS[ring].min} max={RINGS[ring].max} step={0.25}
              value={spread}
              onChange={e => setSpread(Number(e.target.value))}
              className="accent-blue-600 w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>+{RINGS[ring].min}%</span>
              <span>+{RINGS[ring].max}%</span>
            </div>
          </div>
        )}

        {/* שיעור היוון מחושב — תמיד גלוי */}
        <div className={`flex justify-between items-center text-xs px-3 py-2 rounded-lg
          ${yCapModel < minAllRings ? "bg-red-50" : "bg-gray-100"}`}>
          <span className="text-gray-500">שיעור היוון מחושב מהפרמטרים שלך</span>
          <span className={`font-bold ${yCapColor}`}>{yCapModel.toFixed(2)}%</span>
        </div>
        {yCapWarning && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 leading-relaxed">
            ⚠️ {yCapWarning}
          </div>
        )}

        {/* תוצאת עוגן — מופיע רק אחרי בחירת מעגל */}
        {ring !== null && (
          <div className="flex justify-between items-center bg-blue-50 border border-blue-200 px-4 py-3 rounded-xl">
            <div className="text-xs text-blue-600">
              פריים {prime ?? "?"}% + תוספת {spread.toFixed(2)}%
            </div>
            <div className="text-right">
              <div className="text-xs text-blue-600 font-medium">שיעור היוון מומלץ</div>
              <div className="text-xl font-bold text-blue-800">
                {prime ? (prime + spread).toFixed(2) : "—"}%
              </div>
            </div>
          </div>
        )}
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
