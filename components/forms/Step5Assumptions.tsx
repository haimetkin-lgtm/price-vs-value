"use client";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { AllInputs } from "@/lib/models";

interface Props {
  values: Partial<AllInputs>;
  onChange: (field: keyof AllInputs, value: number | string) => void;
}

export function Step5Assumptions({ values, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-1">הנחות מודל — UCH ומאקרו</h2>
        <p className="text-sm text-gray-500">הגדרת תרחיש הבסיס — ניתן להשאיר ברירות המחדל</p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 flex flex-col gap-4">
        <p className="text-xs font-medium text-gray-600">עלות הון — מודל UCH</p>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="ריבית ריאלית על משכנתה (r_d)"
            hint="עלות חוב מותאמת אינפלציה"
            unit="%"
            type="number"
            value={values.rdReal ? (values.rdReal * 100).toFixed(1) : ""}
            onChange={e => onChange("rdReal", Number(e.target.value) / 100)}
            placeholder="2.5"
            step="0.1"
          />
          <Input
            label="עלות הון עצמי אלטרנטיבית (r_e)"
            hint="תשואה ריאלית חלופית"
            unit="%"
            type="number"
            value={values.reReal ? (values.reReal * 100).toFixed(1) : ""}
            onChange={e => onChange("reReal", Number(e.target.value) / 100)}
            placeholder="3.5"
            step="0.1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="שיעור הון עצמי (w)"
            unit="%"
            type="number"
            value={values.equityRatio ? (values.equityRatio * 100).toFixed(0) : ""}
            onChange={e => onChange("equityRatio", Number(e.target.value) / 100)}
            placeholder="30"
          />
          <Input
            label="מסים ועלויות עסקה (τ_o)"
            hint="שנתי כחלק מהנכס"
            unit="%"
            type="number"
            value={values.taxRate ? (values.taxRate * 100).toFixed(2) : ""}
            onChange={e => onChange("taxRate", Number(e.target.value) / 100)}
            placeholder="0.2"
            step="0.05"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="תחזוקה (m)"
            unit="%"
            type="number"
            value={values.maintenanceRate ? (values.maintenanceRate * 100).toFixed(1) : ""}
            onChange={e => onChange("maintenanceRate", Number(e.target.value) / 100)}
            placeholder="0.5"
            step="0.1"
          />
          <Input
            label="פחת פיזי (d)"
            unit="%"
            type="number"
            value={values.depreciationRate ? (values.depreciationRate * 100).toFixed(1) : ""}
            onChange={e => onChange("depreciationRate", Number(e.target.value) / 100)}
            placeholder="1.0"
            step="0.1"
          />
          <Input
            label="פרמיית סיכון (ρ)"
            unit="%"
            type="number"
            value={values.rhoPremium ? (values.rhoPremium * 100).toFixed(1) : ""}
            onChange={e => onChange("rhoPremium", Number(e.target.value) / 100)}
            placeholder="1.0"
            step="0.1"
          />
        </div>
      </div>

      <Select
        label="תרחיש ציפיות עליית ערך E(ΔP)"
        hint="מניעת מעגליות — נבחר תרחיש ולא ציפיות שוק נוכחיות"
        value={String(values.eDeltaP ?? "0")}
        onChange={e => onChange("eDeltaP", Number(e.target.value))}
        options={[
          { value: "0", label: "שמרני — אפס עלייה ריאלית (0%)" },
          { value: "0.015", label: "בסיס — צמיחה מעוגנת הכנסה (1.5%)" },
          { value: "-0.02", label: "תיקון מחירים — ירידת ערך ריאלית (−2%)" },
        ]}
      />

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col gap-3">
        <div>
          <p className="text-xs font-semibold text-blue-800">שקלול מודלי השווי</p>
          <p className="text-xs text-blue-600 mt-0.5">קובע את המשקל של כל מודל בחישוב V* (נקודת המרכז)</p>
        </div>
        {([
          { key: "wPaff" as keyof AllInputs, label: "Paff", sub: "יכולת מימון" },
          { key: "wRent" as keyof AllInputs, label: "Vrent", sub: "הכנסה משכירות" },
          { key: "wCost" as keyof AllInputs, label: "Vcost", sub: "עלות ייצור" },
        ] as const).map(({ key, label, sub }) => {
          const wP = (values.wPaff ?? 33);
          const wR = (values.wRent ?? 33);
          const wC = (values.wCost ?? 34);
          const wSum = (wP + wR + wC) || 1;
          const raw = (values[key] as number | undefined) ?? (key === "wCost" ? 34 : 33);
          const pct = Math.round(raw / wSum * 100);
          return (
            <div key={String(key)} className="flex items-center gap-3">
              <div className="w-24 text-right flex-shrink-0">
                <span className="text-xs font-medium text-gray-700">{label}</span>
                <span className="block text-xs text-gray-400">{sub}</span>
              </div>
              <input
                type="range" min={0} max={100} step={5}
                value={raw}
                onChange={e => onChange(key, Number(e.target.value))}
                className="flex-1 accent-blue-600 h-1.5"
              />
              <span className="text-xs font-semibold text-blue-700 w-9 text-left">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
