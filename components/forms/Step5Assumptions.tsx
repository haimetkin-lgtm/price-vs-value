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
    </div>
  );
}
