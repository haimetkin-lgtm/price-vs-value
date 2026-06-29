export interface VcostInputs {
  hardCosts: number;            // עלויות בנייה פיזיות ₪/מ"ר
  indirectConstructionCosts: number; // עלויות עקיפות הנדסיות ₪/מ"ר
  softCosts: number;            // רישוי, תקורה, ניהול ₪/מ"ר
  financeCosts: number;         // מימון וריבית ליווי ₪/מ"ר
  taxes: number;                // מסים, היטלים, מע"מ ₪/מ"ר
  marketing: number;            // שיווק ועמלות ₪/מ"ר
  contingency: number;          // בצ"מ ₪/מ"ר
  profitMargin: number;         // רווח יזמי נדרש (0.15)
  completedValuePerSqm: number; // שווי מוצר מוגמר ₪/מ"ר (מהמודלים האחרים)
  sqm: number;                  // שטח הנכס מ"ר
  landMarketValuePerSqm: number; // מחיר קרקע בשוק ₪/מ"ר (לחישוב Land Gap)
}

export interface VcostResult {
  rcn: number;                    // עלות החלפה חדשה ₪/מ"ר
  tdcExclLand: number;            // עלות פיתוח כוללת ללא קרקע ₪/מ"ר
  requiredProfit: number;         // רווח יזמי נדרש ₪/מ"ר
  vLandFundamental: number;       // ערך קרקע פונדמנטלי שיורי ₪/מ"ר
  vLandFundamentalTotal: number;  // ערך קרקע פונדמנטלי כולל לנכס ₪
  landGapPct: number;             // פער ספקולטיבי בקרקע %
  vcost: number;                  // אינדיקציית שווי הנכס ₪
}

export function calcVcost(inputs: VcostInputs): VcostResult {
  const {
    hardCosts, indirectConstructionCosts, softCosts, financeCosts,
    taxes, marketing, contingency, profitMargin,
    completedValuePerSqm, sqm, landMarketValuePerSqm
  } = inputs;

  const rcn = hardCosts + indirectConstructionCosts;
  const tdcExclLand = hardCosts + indirectConstructionCosts + softCosts + financeCosts + taxes + marketing + contingency;
  const requiredProfit = tdcExclLand * profitMargin;

  const vLandFundamental = completedValuePerSqm - tdcExclLand - requiredProfit;
  const vLandFundamentalTotal = vLandFundamental * sqm;

  const landGapPct = vLandFundamental > 0
    ? ((landMarketValuePerSqm - vLandFundamental) / vLandFundamental) * 100
    : 0;

  // אינדיקציית שווי: עלות ייצור כוללת + ערך קרקע שוק + רווח
  const vcost = (tdcExclLand + landMarketValuePerSqm + requiredProfit) * sqm;

  return { rcn, tdcExclLand, requiredProfit, vLandFundamental, vLandFundamentalTotal, landGapPct, vcost };
}
