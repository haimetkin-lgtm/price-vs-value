export interface PaffInputs {
  yNet: number;        // הכנסה חודשית נטו ₪
  theta: number;       // שיעור החזר (0.30 / 0.33 / 0.35)
  d: number;           // חובות חודשיים קיימים ₪
  o: number;           // הוצאות קבועות (ביטוחים) ₪
  rNominal: number;    // ריבית שנתית נומינלית (0.048)
  n: number;           // תקופה בחודשים (300)
  equity: number;      // הון עצמי זמין ₪
  ltvMax: number;      // מגבלת LTV (0.75)
}

export interface PaffResult {
  pmtMax: number;
  lMax: number;
  paff: number;
  bindingConstraint: "cashflow" | "equity";
}

export function calcPaff(inputs: PaffInputs): PaffResult {
  const { yNet, theta, d, o, rNominal, n, equity, ltvMax } = inputs;
  if (![yNet, theta, d, o, rNominal, n, equity, ltvMax].every(Number.isFinite)) {
    throw new RangeError("Paff inputs must be finite numbers");
  }
  if (yNet < 0 || d < 0 || o < 0 || rNominal < 0 || n <= 0 || equity < 0
    || theta < 0 || theta > 1 || ltvMax < 0 || ltvMax >= 1) {
    throw new RangeError("Paff inputs are outside their valid ranges");
  }
  const rm = rNominal / 12;

  const pmtMax = Math.max(0, yNet * theta - d - o);
  const annuityFactor = rm === 0 ? n : (1 - Math.pow(1 + rm, -n)) / rm;
  const lMax = pmtMax * annuityFactor;

  const cashflowLimit = lMax + equity;
  const equityLimit = equity / (1 - ltvMax);

  const paff = Math.min(cashflowLimit, equityLimit);
  const bindingConstraint = cashflowLimit < equityLimit ? "cashflow" : "equity";

  return { pmtMax, lMax, paff, bindingConstraint };
}
