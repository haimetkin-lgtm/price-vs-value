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
        hint="המחיר המבוקש או מחיר העסקה"
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
    </div>
  );
}
