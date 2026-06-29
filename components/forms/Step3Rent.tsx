"use client";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { AllInputs } from "@/lib/models";

interface Props {
  values: Partial<AllInputs>;
  onChange: (field: keyof AllInputs, value: number | string) => void;
}

export function Step3Rent({ values, onChange }: Props) {
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
