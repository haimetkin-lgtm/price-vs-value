"use client";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import type { AllInputs } from "@/lib/models";

interface Props {
  values: Partial<AllInputs>;
  onChange: (field: keyof AllInputs, value: number | string) => void;
}

export function Step1Property({ values, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-1">פרטי הנכס</h2>
        <p className="text-sm text-gray-500">הזן את פרטי הנכס שברצונך לנתח</p>
      </div>

      <Input
        label="מחיר הנכס"
        hint="המחיר המבוקש או מחיר העסקה במועד ביצועה"
        unit="₪"
        type="number"
        value={values.marketPrice ?? ""}
        onChange={e => onChange("marketPrice", Number(e.target.value))}
        placeholder="2400000"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="שטח הנכס"
          unit="מ״ר"
          type="number"
          value={values.area ?? ""}
          onChange={e => onChange("area", Number(e.target.value))}
          placeholder="90"
        />
        <Input
          label="מספר חדרים"
          type="number"
          value={values.rooms ?? ""}
          onChange={e => onChange("rooms", Number(e.target.value))}
          placeholder="4"
          min="1"
          max="10"
          step="0.5"
        />
      </div>

      <Input
        label="עיר / אזור"
        type="text"
        value={values.city ?? ""}
        onChange={e => onChange("city", e.target.value)}
        placeholder="תל אביב"
      />

      <Select
        label="מטרת הרכישה"
        value={values.purpose ?? "own"}
        onChange={e => onChange("purpose", e.target.value)}
        options={[
          { value: "own", label: "מגורים עצמיים" },
          { value: "invest", label: "השקעה / להשכרה" },
        ]}
      />

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-medium text-gray-700">מועד הרכישה</label>
          <div className="relative group">
            <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center cursor-help leading-none">?</span>
            <div className="absolute bottom-full right-0 mb-1.5 w-56 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
              אם הדירה נרכשה בעבר — הזן נתונים כפי שהיו באותה תקופה (ריבית, שכ"ד, הכנסה). נתוני היום יתנו תוצאה מעוותת.
              <div className="absolute top-full right-3 border-4 border-transparent border-t-gray-800"/>
            </div>
          </div>
        </div>
        <input
          type="month"
          value={values.purchaseDate ?? ""}
          max={new Date().toISOString().slice(0, 7)}
          onChange={e => onChange("purchaseDate", e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {values.purchaseDate && values.purchaseDate < new Date().toISOString().slice(0, 7) && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800 mt-1">
            ⚠️ רכישה בעבר — ודא שכל הנתונים בשלבים הבאים (ריבית, שכ"ד, הכנסה) מוזנים כפי שהיו במועד הרכישה.
          </div>
        )}
      </div>
    </div>
  );
}
