"use client";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import type { AllInputs } from "@/lib/models";

const PRICELIST: Record<string, Record<string, number>> = {
  "גולן, גליל עליון":                        { "בניין נמוך": 5400, "בניין גבוה": 5300, "בניין רב קומות": 5800, "תת קרקעי": 3300 },
  "חיפה":                                     { "בניין נמוך": 5800, "בניין גבוה": 5800, "בניין רב קומות": 6000, "תת קרקעי": 3400 },
  "השרון":                                    { "בניין נמוך": 6200, "בניין גבוה": 6300, "בניין רב קומות": 6600, "תת קרקעי": 3400 },
  "שומרון":                                   { "בניין נמוך": 5000, "בניין גבוה": 5200, "בניין רב קומות": 5600, "תת קרקעי": 3600 },
  "ירושלים":                                  { "בניין נמוך": 7000, "בניין גבוה": 6900, "בניין רב קומות": 7700, "תת קרקעי": 4000 },
  "סובב ירושלים":                             { "בניין נמוך": 5900, "בניין גבוה": 6300, "בניין רב קומות": 6600, "תת קרקעי": 3900 },
  "גוש דן":                                   { "בניין נמוך": 6300, "בניין גבוה": 6400, "בניין רב קומות": 6700, "תת קרקעי": 3600 },
  "רמת גן וגבעתיים":                         { "בניין נמוך": 6700, "בניין גבוה": 7500, "בניין רב קומות": 7900, "תת קרקעי": 4100 },
  "עבר הירקון, תל אביב":                     { "בניין נמוך": 8300, "בניין גבוה": 9100, "בניין רב קומות": 10600, "תת קרקעי": 4300 },
  "מרכז תל אביב":                             { "בניין נמוך": 12000, "בניין גבוה": 11100, "בניין רב קומות": 12700, "תת קרקעי": 4400 },
  "דרום ומזרח תל אביב":                      { "בניין נמוך": 8000, "בניין גבוה": 7700, "בניין רב קומות": 9000, "תת קרקעי": 4100 },
  "הרצליה ורמת השרון":                       { "בניין נמוך": 7000, "בניין גבוה": 7200, "בניין רב קומות": 7900, "תת קרקעי": 3900 },
  "שפלת החוף":                                { "בניין נמוך": 6100, "בניין גבוה": 6200, "בניין רב קומות": 6600, "תת קרקעי": 3600 },
  "באר שבע והסביבה":                         { "בניין נמוך": 5400, "בניין גבוה": 5400, "בניין רב קומות": 5900, "תת קרקעי": 3400 },
  "מדבר יהודה, הערבה והנגב":                 { "בניין נמוך": 5200, "בניין גבוה": 5500, "בניין רב קומות": 5700, "תת קרקעי": 3400 },
  "אילת":                                     { "בניין נמוך": 6800, "בניין גבוה": 6800, "בניין רב קומות": 7100, "תת קרקעי": 3800 },
};

const AREAS = Object.keys(PRICELIST);
const TYPES = ["בניין נמוך", "בניין גבוה", "בניין רב קומות"];

interface Props {
  values: Partial<AllInputs>;
  onChange: (field: keyof AllInputs, value: number | string) => void;
}

export function Step4Cost({ values, onChange }: Props) {
  const [area, setArea] = useState("");
  const [buildingType, setBuildingType] = useState("");
  const [hasBasement, setHasBasement] = useState(false);

  function applyPrice(newArea: string, newType: string, basement: boolean) {
    if (newArea && newType) {
      const base = PRICELIST[newArea][newType];
      onChange("hardCosts", Math.round(base * (basement ? 1.2 : 1)));
    }
  }

  function handleAreaChange(newArea: string) {
    setArea(newArea);
    applyPrice(newArea, buildingType, hasBasement);
  }

  function handleTypeChange(newType: string) {
    setBuildingType(newType);
    applyPrice(area, newType, hasBasement);
  }

  function handleBasementChange(checked: boolean) {
    setHasBasement(checked);
    applyPrice(area, buildingType, checked);
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-1">עלות בנייה — V<sub>cost</sub></h2>
        <p className="text-sm text-gray-500">עלויות ייצור הנכס לחישוב ערך קרקע שיורי ופער ספקולטיבי</p>
      </div>

      <div className="bg-amber-50 rounded-lg p-3 text-xs text-amber-700">
        כל הנתונים הם לפי מ״ר בנוי. ניתן להשתמש בממוצעי שוק של משרד הבינוי אם אין נתון מדויק.
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col gap-3">
        <p className="text-xs font-medium text-blue-800">מילוי אוטומטי לפי <a href="https://landvalue.org.il/loadedFiles/1783338676-KVFVS.pdf" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-600">מחירון לשכת שמאי המקרקעין, יוני 2026</a></p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">אזור גיאוגרפי</label>
            <select
              value={area}
              onChange={e => handleAreaChange(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">בחר אזור...</option>
              {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600">סוג מבנה</label>
            <select
              value={buildingType}
              onChange={e => handleTypeChange(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">בחר סוג...</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasBasement}
            onChange={e => handleBasementChange(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-blue-600"
          />
          <div>
            <p className="text-sm font-medium text-gray-800">לבניין יש חניון או מחסנים תת קרקעיים</p>
            <p className="text-xs text-gray-500 mt-0.5">מוסיף 20% לעלות הבנייה. לבניינים עם שטח תת קרקעי, עלות הבנייה גבוהה ב-15% עד 25% לעומת בנייה עילית בלבד, תלוי בגודל החניון וביחס החניות לדירות.</p>
          </div>
        </label>
        {area && buildingType && (
          <p className="text-xs text-blue-700">
            עלות בנייה ישירה: <strong>₪{Math.round(PRICELIST[area][buildingType] * (hasBasement ? 1.2 : 1)).toLocaleString("he-IL")}</strong> למ״ר (סטייה אפשרית ±10%)
          </p>
        )}
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
