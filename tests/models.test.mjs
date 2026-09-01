import test from "node:test";
import assert from "node:assert/strict";
import { calcPaff } from "../lib/models/paff.ts";
import { calcTriangulation } from "../lib/models/triangulation.ts";
import { calcAccessibility } from "../lib/models/accessibility.ts";

test("Paff handles a zero-interest mortgage without division by zero", () => {
  const result = calcPaff({ yNet: 20_000, theta: 0.3, d: 0, o: 0,
    rNominal: 0, n: 300, equity: 500_000, ltvMax: 0.75 });
  assert.equal(result.lMax, 1_800_000);
  assert.ok(Number.isFinite(result.paff));
});

test("Paff floors unavailable monthly payment at zero", () => {
  const result = calcPaff({ yNet: 10_000, theta: 0.3, d: 4_000, o: 500,
    rNominal: 0.05, n: 300, equity: 300_000, ltvMax: 0.75 });
  assert.equal(result.pmtMax, 0);
  assert.equal(result.lMax, 0);
});

test("Paff rejects invalid regulatory ranges", () => {
  assert.throws(() => calcPaff({ yNet: 10_000, theta: 1.2, d: 0, o: 0,
    rNominal: 0.05, n: 300, equity: 300_000, ltvMax: 1 }), RangeError);
});

test("triangulation applies weights only to independent fundamental anchors", () => {
  const result = calcTriangulation({ paff: 1_000_000, vRent: 2_000_000,
    vcost: 3_000_000, marketPrice: 2_500_000,
    weights: { wPaff: 25, wRent: 75, wCost: 100 } });
  assert.equal(result.vStar, 1_750_000);
  assert.equal(result.vU, 2_000_000);
});

test("triangulation ignores a distorted Vcost when measuring dispersion", () => {
  const result = calcTriangulation({ paff: 1_000_000, vRent: 2_000_000,
    vcost: 4_000_000, marketPrice: 2_000_000 });
  assert.equal(result.vU, 2_000_000);
  assert.equal(result.vStar, 1_500_000);
});

test("triangulation rejects an empty anchor set", () => {
  assert.throws(() => calcTriangulation({ paff: 0, vRent: Number.NaN,
    vcost: -1, marketPrice: 2_000_000 }), RangeError);
});

test("accessibility remains finite at zero interest and uses supplied debt service", () => {
  const result = calcAccessibility({ marketPrice: 2_000_000,
    medianAnnualIncome: 240_000, monthlyNetIncome: 20_000,
    monthlyDebtService: 5_000, loanAmount: 1_000_000, rNominal: 0,
    nMonths: 200, noiAnnual: 80_000, annualDebtService: 60_000,
    equityInvested: 1_000_000 });
  assert.equal(result.dsti, 25);
  assert.ok(Number.isFinite(result.hai));
});
