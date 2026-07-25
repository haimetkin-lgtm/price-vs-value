export interface VeconInputs {
  rentMonthly: number;   // שכ"ד חודשי שוק ₪
  vacancyRate: number;   // שיעור אי-תפוסה (0.05)
  expensesOpex: number;  // הוצאות תפעול שנתיות ₪
  rfNominal: number;     // ריבית חסרת סיכון נומינלית
  inflation: number;     // ציפיות אינפלציה
  riskPremium: number;   // פרמיית סיכון
  g: number;             // קצב צמיחה ריאלי (rentGrowth)
}

export interface VeconResult {
  vEcon: number;         // שווי DCF כולל ₪
  noiYear1: number;      // NOI שנה 1
  terminalValue: number; // שווי שיורי (PV)
  yCap: number;          // שיעור היוון
}

const HOLD_YEARS = 10;

export function calcVecon(inputs: VeconInputs): VeconResult {
  const { rentMonthly, vacancyRate, expensesOpex, rfNominal, inflation, riskPremium, g } = inputs;

  const grossAnnual = rentMonthly * 12;
  const noiYear1 = grossAnnual * (1 - vacancyRate) - expensesOpex;

  // Fisher: ריאלית מנומינלית
  const rf = (1 + rfNominal) / (1 + inflation) - 1;
  const yCap = rf + riskPremium - g;
  const discountRate = rfNominal + riskPremium; // שיעור היוון נומינלי

  if (yCap <= 0 || discountRate <= 0) {
    return { vEcon: 0, noiYear1, terminalValue: 0, yCap };
  }

  // היוון NOI שנים 1-10 (צמיחה נומינלית = g + inflation)
  const gNominal = (1 + g) * (1 + inflation) - 1;
  let pvCashFlows = 0;
  for (let t = 1; t <= HOLD_YEARS; t++) {
    const noi = noiYear1 * Math.pow(1 + gNominal, t - 1);
    pvCashFlows += noi / Math.pow(1 + discountRate, t);
  }

  // שווי שיורי: NOI שנה 11 ÷ yCap, מהוון לשנה 0
  const noiYear11 = noiYear1 * Math.pow(1 + gNominal, HOLD_YEARS);
  const terminalValueFuture = noiYear11 / yCap;
  const terminalValue = terminalValueFuture / Math.pow(1 + discountRate, HOLD_YEARS);

  const vEcon = pvCashFlows + terminalValue;

  return { vEcon, noiYear1, terminalValue, yCap };
}
