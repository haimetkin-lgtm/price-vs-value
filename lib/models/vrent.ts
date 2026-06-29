export interface VrentInputs {
  rentMonthly: number;   // שכ"ד חודשי שוק ₪
  vacancyRate: number;   // שיעור אי-תפוסה (0.05)
  expensesOpex: number;  // הוצאות תפעול שנתיות ₪
  rfNominal: number;     // ריבית חסרת סיכון נומינלית (0.04)
  inflation: number;     // ציפיות אינפלציה (0.025)
  riskPremium: number;   // פרמיית סיכון (0.02)
  g: number;             // קצב צמיחה ריאלי ארוך-טווח (0.01)
}

export interface VrentResult {
  noiAnnual: number;
  rf: number;
  yCap: number;
  vRent: number;
}

export function calcVrent(inputs: VrentInputs): VrentResult {
  const { rentMonthly, vacancyRate, expensesOpex, rfNominal, inflation, riskPremium, g } = inputs;

  const grossAnnual = rentMonthly * 12;
  const noiAnnual = grossAnnual * (1 - vacancyRate) - expensesOpex;

  // Fisher: ריאלית מנומינלית
  const rf = (1 + rfNominal) / (1 + inflation) - 1;

  const yCap = rf + riskPremium - g;
  const vRent = yCap > 0 ? noiAnnual / yCap : 0;

  return { noiAnnual, rf, yCap, vRent };
}
