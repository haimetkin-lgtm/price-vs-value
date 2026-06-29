"use client";
import { Input } from "@/components/ui/Input";
import type { AllInputs } from "@/lib/models";

interface Props {
  values: Partial<AllInputs>;
  onChange: (field: keyof AllInputs, value: number | string) => void;
}

export function Step4Cost({ values, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-1">עלות בנייה — V<sub>cost</sub></h2>
        <p className="text-sm text-gray-500">עלויות ייצור הנכס לחישוב ערך קרקע שיורי ופער ספקולטיבי</p>
      </div>

      <div className="bg-amber-50 rounded-lg p-3 text-xs text-amber-700">
        כל הנתונים הם לפי מ״ר בנוי. ניתן להשתמש בממוצעי שוק של משרד הבינוי אם אין נתון מדויק.
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="עלויות בנייה פיזיות ישירות"
          unit="₪/מ״ר"
          type="number"
          value={values.hardCosts ?? ""}
          onChange={e => onChange("hardCosts", Number(e.target.value))}
          placeholder="9000"
        />
        <Input
          label="עלויות הנדסיות ועקיפות"
          hint="תכנון, פיקוח, הנדסה"
          unit="₪/מ״ר"
          type="number"
          value={values.indirectCosts ?? ""}
          onChange={e => onChange("indirectCosts", Number(e.target.value))}
          placeholder="1500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="רישוי, תקורה וניהול"
          unit="₪/מ״ר"
          type="number"
          value={values.softCosts ?? ""}
          onChange={e => onChange("softCosts", Number(e.target.value))}
          placeholder="2000"
        />
        <Input
          label="מימון וריבית ליווי"
          unit="₪/מ״ר"
          type="number"
          value={values.financeCosts ?? ""}
          onChange={e => onChange("financeCosts", Number(e.target.value))}
          placeholder="2500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="מסים, היטלים, מע״מ"
          unit="₪/מ״ר"
          type="number"
          value={values.constructionTaxes ?? ""}
          onChange={e => onChange("constructionTaxes", Number(e.target.value))}
          placeholder="3000"
        />
        <Input
          label="שיווק ועמלות מכירה"
          unit="₪/מ״ר"
          type="number"
          value={values.marketing ?? ""}
          onChange={e => onChange("marketing", Number(e.target.value))}
          placeholder="1000"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="בצ״מ — סיכונים בלתי צפויים"
          unit="₪/מ״ר"
          type="number"
          value={values.contingency ?? ""}
          onChange={e => onChange("contingency", Number(e.target.value))}
          placeholder="800"
        />
        <Input
          label="רווח יזמי נדרש"
          hint="מתוך עלות הפיתוח ללא קרקע"
          unit="%"
          type="number"
          value={values.profitMargin ? (values.profitMargin * 100).toFixed(0) : ""}
          onChange={e => onChange("profitMargin", Number(e.target.value) / 100)}
          placeholder="15"
        />
      </div>

      <Input
        label="מחיר קרקע בשוק (מכרזי רמ״י / עסקאות)"
        hint="לחישוב פער ספקולטיבי — Land Gap"
        unit="₪/מ״ר בנוי"
        type="number"
        value={values.landMarketValuePerSqm ?? ""}
        onChange={e => onChange("landMarketValuePerSqm", Number(e.target.value))}
        placeholder="8000"
      />
    </div>
  );
}
