// מניפת אומדנים: קביעת [VL, VU] מתוך שלושת המודלים
// UCH אינו נכלל כאן — הוא מבחן כדאיות ולא אומדן שווי

export interface TriangulationInputs {
  paff: number;
  vRent: number;
  vcost: number;
  marketPrice: number;
  weights?: { wPaff: number; wRent: number; wCost: number };
}

export interface TriangulationResult {
  vL: number;                  // גבול תחתון של טווח שווי
  vU: number;                  // גבול עליון של טווח שווי
  vStar: number;               // נקודת מרכז (ממוצע פשוט — לצורך הצגה בלבד)
  pricePremiumPct: number;     // פרמיית מחיר % מ-vStar
  status: "overpriced" | "fair" | "underpriced";
  modelValues: { paff: number; vRent: number; vcost: number };
  deviations: { paff: number; vRent: number; vcost: number }; // % מחיר שוק מכל מודל
}

export function calcTriangulation(inputs: TriangulationInputs): TriangulationResult {
  const { paff, vRent, vcost, marketPrice, weights } = inputs;

  const values = [paff, vRent, vcost].filter(v => v > 0);
  const vL = Math.min(...values);
  const vU = Math.max(...values);

  let vStar: number;
  if (weights) {
    const wSum = (weights.wPaff + weights.wRent + weights.wCost) || 1;
    vStar = (paff * weights.wPaff + vRent * weights.wRent + vcost * weights.wCost) / wSum;
  } else {
    vStar = values.reduce((a, b) => a + b, 0) / values.length;
  }

  const pricePremiumPct = ((marketPrice - vStar) / vStar) * 100;

  let status: TriangulationResult["status"];
  if (marketPrice > vU * 1.05) status = "overpriced";
  else if (marketPrice < vL * 0.95) status = "underpriced";
  else status = "fair";

  const deviation = (model: number) => ((marketPrice - model) / model) * 100;

  return {
    vL,
    vU,
    vStar,
    pricePremiumPct,
    status,
    modelValues: { paff, vRent, vcost },
    deviations: {
      paff: deviation(paff),
      vRent: deviation(vRent),
      vcost: deviation(vcost),
    },
  };
}
