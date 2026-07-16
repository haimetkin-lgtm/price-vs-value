export * from "./paff";
export * from "./vrent";
export * from "./uch";
export * from "./vcost";
export * from "./triangulation";
export * from "./accessibility";

// ממשק מאוחד לכל קלטי הטופס
export interface AllInputs {
  // נכס
  marketPrice: number;
  area: number;           // מ"ר
  city: string;
  purpose: "own" | "invest";
  rooms: number;
  purchaseDate: string;   // YYYY-MM

  // Paff
  yNet: number;
  theta: number;
  existingDebts: number;
  fixedHousingCosts: number;
  rNominal: number;
  nMonths: number;
  equity: number;
  ltvMax: number;

  // Vrent
  rentMonthly: number;
  vacancyRate: number;
  expensesOpex: number;
  rfNominal: number;
  inflation: number;
  riskPremium: number;
  rentGrowth: number;

  // UCH
  rdReal: number;
  reReal: number;
  equityRatio: number;
  taxRate: number;
  maintenanceRate: number;
  depreciationRate: number;
  rhoPremium: number;
  eDeltaP: number;

  // Vcost
  hardCosts: number;
  indirectCosts: number;
  softCosts: number;
  financeCosts: number;
  constructionTaxes: number;
  marketing: number;
  contingency: number;
  profitMargin: number;
  landMarketValuePerSqm: number;

  // נגישות
  medianAnnualIncome: number;

  // שקלול מודלים (0–100, מנורמל אוטומטית)
  wPaff: number;
  wRent: number;
  wCost: number;
}
