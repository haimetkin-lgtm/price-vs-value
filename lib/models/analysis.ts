import type { AllInputs } from "./index";
import { calcPaff } from "./paff";
import { calcVrent } from "./vrent";
import { calcVcost } from "./vcost";
import { calcVecon } from "./vecon";
import { calcTriangulation } from "./triangulation";
import { calcUch } from "./uch";
import { calcAccessibility } from "./accessibility";

export function calculateAnalysis(inputs: Partial<AllInputs>) {
  const marketPrice = inputs.marketPrice!;
  const equity = inputs.equity!;
  const paff = calcPaff({ yNet: inputs.yNet!, theta: inputs.theta!, d: inputs.existingDebts ?? 0,
    o: inputs.fixedHousingCosts ?? 0, rNominal: inputs.rNominal ?? 0.048,
    n: inputs.nMonths!, equity, ltvMax: inputs.ltvMax! });
  const vrent = calcVrent({ rentMonthly: inputs.rentMonthly!, vacancyRate: inputs.vacancyRate!,
    expensesOpex: inputs.expensesOpex ?? 0, rfNominal: inputs.rfNominal!,
    inflation: inputs.inflation!, riskPremium: inputs.riskPremium!, g: inputs.rentGrowth! });
  const area = inputs.area ?? 100;
  const vcost = calcVcost({ hardCosts: inputs.hardCosts!, indirectConstructionCosts: inputs.indirectCosts ?? 0,
    softCosts: inputs.softCosts ?? 0, financeCosts: inputs.financeCosts ?? 0,
    taxes: inputs.constructionTaxes ?? 0, marketing: inputs.marketing ?? 0,
    contingency: inputs.contingency ?? 0, profitMargin: inputs.profitMargin!,
    completedValuePerSqm: marketPrice / area, sqm: area,
    landMarketValuePerSqm: inputs.landMarketValuePerSqm ?? 0 });
  const vecon = calcVecon({ rentMonthly: inputs.rentMonthly!, vacancyRate: inputs.vacancyRate!,
    expensesOpex: inputs.expensesOpex ?? 0, rfNominal: inputs.rfNominal!,
    inflation: inputs.inflation!, riskPremium: inputs.riskPremium!, g: inputs.rentGrowth! });
  const triangulation = calcTriangulation({ paff: paff.paff, vRent: vrent.vRent,
    vcost: vcost.vcost, marketPrice,
    weights: { wPaff: inputs.wPaff ?? 33, wRent: inputs.wRent ?? 33, wCost: inputs.wCost ?? 34 } });
  const uch = calcUch({ price: marketPrice, rd: inputs.rdReal!, re: inputs.reReal!,
    w: inputs.equityRatio!, tauO: inputs.taxRate!, m: inputs.maintenanceRate!,
    d: inputs.depreciationRate!, rho: inputs.rhoPremium!, eDeltaP: inputs.eDeltaP!,
    rentAnnual: inputs.rentMonthly! * 12 });
  const rNominal = inputs.rNominal ?? 0.048;
  const rm = rNominal / 12;
  const loanAmount = Math.min(Math.max(0, marketPrice - equity), marketPrice * inputs.ltvMax!);
  const annuityFactor = rm === 0 ? inputs.nMonths! : (1 - Math.pow(1 + rm, -inputs.nMonths!)) / rm;
  const monthlyMortgage = loanAmount / annuityFactor;
  const accessibility = calcAccessibility({ marketPrice,
    medianAnnualIncome: inputs.medianAnnualIncome ?? 200_000, monthlyNetIncome: inputs.yNet!,
    monthlyDebtService: monthlyMortgage + (inputs.existingDebts ?? 0), loanAmount,
    rNominal, nMonths: inputs.nMonths!, noiAnnual: vrent.noiAnnual,
    annualDebtService: monthlyMortgage * 12, equityInvested: equity });
  return { paff, vrent, vcost, vecon, triangulation, uch, accessibility, loanAmount, monthlyMortgage };
}

export function tryCalculateAnalysis(inputs: Partial<AllInputs>) {
  try {
    return { data: calculateAnalysis(inputs), error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "Invalid calculation inputs" };
  }
}
