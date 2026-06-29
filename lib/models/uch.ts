export interface UchInputs {
  price: number;          // מחיר הנכס ₪
  rd: number;             // ריבית ריאלית על משכנתה (0.025)
  re: number;             // עלות הון עצמי אלטרנטיבית ריאלית (0.035)
  w: number;              // שיעור הון עצמי (0.30)
  tauO: number;           // מסים ועלויות עסקה שנתיות (0.002)
  m: number;              // תחזוקה ושוטף (0.005)
  d: number;              // פחת פיזי שנתי (0.01)
  rho: number;            // פרמיית סיכון ייחודית (0.01)
  eDeltaP: number;        // ציפיות עליית ערך ריאלית: 0 / g_income / שלילי
  rentAnnual: number;     // שכ"ד שוק שנתי ₪ (לצורך השוואה)
}

export interface UchResult {
  weightedCapitalCost: number;
  uchCoeff: number;
  uchAnnual: number;
  rentAnnual: number;
  monthlyDifference: number;  // חיובי = רכישה יקרה יותר
  buyingIsExpensive: boolean;
}

export function calcUch(inputs: UchInputs): UchResult {
  const { price, rd, re, w, tauO, m, d, rho, eDeltaP, rentAnnual } = inputs;

  const weightedCapitalCost = rd * (1 - w) + re * w;
  const uchCoeff = weightedCapitalCost + tauO + m + d + rho - eDeltaP;
  const uchAnnual = price * uchCoeff;

  const monthlyDifference = (uchAnnual - rentAnnual) / 12;
  const buyingIsExpensive = uchAnnual > rentAnnual;

  return { weightedCapitalCost, uchCoeff, uchAnnual, rentAnnual, monthlyDifference, buyingIsExpensive };
}
