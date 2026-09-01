// טווח השווי הפונדמנטלי נקבע מעוגני יכולת המימון והשכירות.
// Vcost נשמר כאבחון עלות נפרד מפני שמחיר הקרקע בשוק עלול להכיל את הבועה הנמדדת.
// UCH אינו נכלל כאן - הוא מבחן כדאיות ולא אומדן שווי

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
  vStar: number;               // נקודת מרכז (ממוצע פשוט - לצורך הצגה בלבד)
  pricePremiumPct: number;     // פרמיית מחיר % מ-vStar
  status: "overpriced" | "within-range" | "underpriced" | "inconclusive";
  dispersionPct: number;
  confidence: "high" | "medium" | "low";
  modelValues: { paff: number; vRent: number; vcost: number };
  deviations: { paff: number; vRent: number; vcost: number }; // % מחיר שוק מכל מודל
}

export function calcTriangulation(inputs: TriangulationInputs): TriangulationResult {
  const { paff, vRent, vcost, marketPrice, weights } = inputs;

  if (!Number.isFinite(marketPrice) || marketPrice <= 0) throw new RangeError("Market price must be positive");
  const entries = [
    { key: "paff", value: paff, weight: weights?.wPaff ?? 1 },
    { key: "vRent", value: vRent, weight: weights?.wRent ?? 1 },
  ].filter(item => Number.isFinite(item.value) && item.value > 0 && Number.isFinite(item.weight) && item.weight > 0);
  if (entries.length === 0) throw new RangeError("At least one valid fundamental anchor is required");
  const values = entries.map(item => item.value);
  const vL = Math.min(...values);
  const vU = Math.max(...values);

  let vStar: number;
  if (weights) {
    const wSum = entries.reduce((sum, item) => sum + item.weight, 0);
    if (wSum <= 0) throw new RangeError("At least one model weight must be positive");
    vStar = entries.reduce((sum, item) => sum + item.value * item.weight, 0) / wSum;
  } else {
    vStar = values.reduce((a, b) => a + b, 0) / values.length;
  }

  const pricePremiumPct = ((marketPrice - vStar) / vStar) * 100;

  const dispersionPct = ((vU - vL) / vStar) * 100;
  const confidence = dispersionPct <= 20 ? "high" : dispersionPct <= 40 ? "medium" : "low";
  let status: TriangulationResult["status"];
  if (confidence === "low" && marketPrice >= vL * 0.95 && marketPrice <= vU * 1.05) status = "inconclusive";
  else if (marketPrice > vU * 1.05) status = "overpriced";
  else if (marketPrice < vL * 0.95) status = "underpriced";
  else status = "within-range";

  const deviation = (model: number) => Number.isFinite(model) && model > 0
    ? ((marketPrice - model) / model) * 100 : Number.NaN;

  return {
    vL,
    vU,
    vStar,
    pricePremiumPct,
    status,
    dispersionPct,
    confidence,
    modelValues: { paff, vRent, vcost },
    deviations: {
      paff: deviation(paff),
      vRent: deviation(vRent),
      vcost: deviation(vcost),
    },
  };
}
