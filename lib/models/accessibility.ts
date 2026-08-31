// מדדי נגישות: PIR, HAI, DSTI, Cash Carry

export interface AccessibilityInputs {
  marketPrice: number;
  medianAnnualIncome: number;   // הכנסה פנויה שנתית חציונית ₪
  monthlyNetIncome: number;     // הכנסת משק הבית הספציפי ₪/חודש
  monthlyDebtService: number;   // שירות חוב חודשי (משכנתה + חובות) ₪
  loanAmount: number;           // ההלוואה הנדרשת בפועל לאחר ההון העצמי
  rNominal: number;             // ריבית נומינלית שנתית
  nMonths: number;              // תקופה בחודשים
  noiAnnual: number;            // NOI שנתי (לחישוב Cash Carry)
  annualDebtService: number;    // שירות חוב שנתי כולל ₪
  equityInvested: number;       // הון עצמי שהושקע ₪
}

export interface AccessibilityResult {
  pir: number;
  hai: number;
  dsti: number;
  cashOnCash: number;           // תשואה תזרימית על ההון
  cashCarryMonthly: number;     // מרווח נשיאה חודשי (שלילי = גירעון)
  incomeRequiredForMedian: number;
}

export function calcAccessibility(inputs: AccessibilityInputs): AccessibilityResult {
  const {
    marketPrice, medianAnnualIncome, monthlyNetIncome,
    monthlyDebtService, loanAmount, rNominal, nMonths,
    noiAnnual, annualDebtService, equityInvested
  } = inputs;

  if (![marketPrice, medianAnnualIncome, monthlyNetIncome, monthlyDebtService, loanAmount,
    rNominal, nMonths, noiAnnual, annualDebtService, equityInvested].every(Number.isFinite)
    || marketPrice <= 0 || medianAnnualIncome <= 0 || monthlyNetIncome <= 0
    || monthlyDebtService < 0 || loanAmount < 0 || rNominal < 0 || nMonths <= 0) {
    throw new RangeError("Accessibility inputs are outside their valid ranges");
  }
  const pir = marketPrice / medianAnnualIncome;

  // HAI: הכנסה נדרשת למשכנתה חציונית (30% PTI)
  const rm = rNominal / 12;
  const annuityFactor = rm === 0 ? nMonths : (1 - Math.pow(1 + rm, -nMonths)) / rm;
  const monthlyMortgage = loanAmount / annuityFactor;
  const incomeRequiredForMedian = monthlyMortgage / 0.30;
  const hai = (monthlyNetIncome / incomeRequiredForMedian) * 100;

  const dsti = (monthlyDebtService / monthlyNetIncome) * 100;

  const cashOnCash = equityInvested > 0
    ? ((noiAnnual - annualDebtService) / equityInvested) * 100
    : 0;

  const cashCarryMonthly = (noiAnnual - annualDebtService) / 12;

  return { pir, hai, dsti, cashOnCash, cashCarryMonthly, incomeRequiredForMedian };
}
