"use client";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { AllInputs } from "@/lib/models";

interface Props {
  values: Partial<AllInputs>;
  onChange: (field: keyof AllInputs, value: number | string) => void;
}

export function Step2Paff({ values, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-1">מימון ויכולת רכישה — P<sub>aff</sub></h2>
        <p className="text-sm text-gray-500">נתוני משק הבית והמשכנתה הצפויה</p>
      </div>

      <Input
        label="הכנסה חודשית נטו משותפת"
        hint="סך הכנסת כל בני הבית לאחר מס"
        unit="₪"
        type="number"
        value={values.yNet ?? ""}
        onChange={e => onChange("yNet", Number(e.target.value))}
        placeholder="22000"
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            שיעור החזר מהכנסה (θ)
          </label>
          <span className="text-base font-bold text-blue-600">
            {Math.round((values.theta ?? 0.33) * 100)}%
          </span>
        </div>
        <input
          type="range"
          min={25}
          max={50}
          step={1}
          value={Math.round((values.theta ?? 0.33) * 100)}
          onChange={e => onChange("theta", Number(e.target.value) / 100)}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>25% — שמרני</span>
          <span>33% — בסיס</span>
          <span>50% — מקסימום</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          בנק ישראל קובע תקרה של 40–50% תלוי בגובה ההכנסה. ברירת המחדל 33% היא הממוצע המקובל.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="חובות חודשיים קיימים"
          hint="הלוואות, רכב וכד' — לא כולל דיור"
          unit="₪"
          type="number"
          value={values.existingDebts ?? ""}
          onChange={e => onChange("existingDebts", Number(e.target.value))}
          placeholder="1000"
        />
        <Input
          label="הוצאות קבועות נלוות"
          hint="ביטוח חיים, ביטוח נכס"
          unit="₪"
          type="number"
          value={values.fixedHousingCosts ?? ""}
          onChange={e => onChange("fixedHousingCosts", Number(e.target.value))}
          placeholder="500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="ריבית משכנתה שנתית"
          hint="ריבית נומינלית ממוצעת"
          unit="%"
          type="number"
          value={values.rNominal ? (values.rNominal * 100).toFixed(2) : ""}
          onChange={e => onChange("rNominal", Number(e.target.value) / 100)}
          placeholder="4.8"
          step="0.1"
        />
        <Select
          label="תקופת משכנתה"
          value={String(values.nMonths ?? "300")}
          onChange={e => onChange("nMonths", Number(e.target.value))}
          options={[
            { value: "240", label: "20 שנה" },
            { value: "300", label: "25 שנה (בסיס)" },
            { value: "360", label: "30 שנה" },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="הון עצמי זמין"
          unit="₪"
          type="number"
          value={values.equity ?? ""}
          onChange={e => onChange("equity", Number(e.target.value))}
          placeholder="500000"
        />
        <Select
          label="מגבלת LTV רגולטורית"
          hint="בישראל: דירה ראשונה 75%"
          value={String(values.ltvMax ?? "0.75")}
          onChange={e => onChange("ltvMax", Number(e.target.value))}
          options={[
            { value: "0.75", label: "75% — דירה ראשונה" },
            { value: "0.70", label: "70% — דירה שנייה" },
            { value: "0.50", label: "50% — משקיע" },
          ]}
        />
      </div>
    </div>
  );
}
