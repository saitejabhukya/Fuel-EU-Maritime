import { describe, it, expect } from "vitest";
import {
  computeComplianceBalance,
  isCompliant,
  computePercentDiff,
  computePoolSum,
  isPoolValid,
} from "../core/application/compliance";
import { TARGET_GHG_INTENSITY, ENERGY_CONVERSION_FACTOR } from "../shared/constants";

describe("computeComplianceBalance", () => {
  it("returns positive CB when GHG is below target (surplus)", () => {
    const cb = computeComplianceBalance(88.0, 4800);
    expect(cb).toBeGreaterThan(0);
  });

  it("returns negative CB when GHG is above target (deficit)", () => {
    const cb = computeComplianceBalance(93.5, 5100);
    expect(cb).toBeLessThan(0);
  });

  it("returns zero when GHG exactly equals target", () => {
    const cb = computeComplianceBalance(TARGET_GHG_INTENSITY, 5000);
    expect(cb).toBeCloseTo(0);
  });

  it("applies the correct formula: (TARGET - actual) * (fuel * 41000)", () => {
    const ghg = 90;
    const fuel = 5000;
    const expected = (TARGET_GHG_INTENSITY - ghg) * (fuel * ENERGY_CONVERSION_FACTOR);
    expect(computeComplianceBalance(ghg, fuel)).toBeCloseTo(expected);
  });
});

describe("isCompliant", () => {
  it("returns true when GHG is below target", () => {
    expect(isCompliant(88.0)).toBe(true);
  });

  it("returns false when GHG is above target", () => {
    expect(isCompliant(93.5)).toBe(false);
  });

  it("returns true when GHG exactly equals target", () => {
    expect(isCompliant(TARGET_GHG_INTENSITY)).toBe(true);
  });
});

describe("computePercentDiff", () => {
  it("returns 0 when actual equals baseline", () => {
    expect(computePercentDiff(91, 91)).toBeCloseTo(0);
  });

  it("returns negative when actual is below baseline", () => {
    const diff = computePercentDiff(88, 91);
    expect(diff).toBeLessThan(0);
  });

  it("returns positive when actual is above baseline", () => {
    const diff = computePercentDiff(93.5, 91);
    expect(diff).toBeGreaterThan(0);
  });
});

describe("computePoolSum", () => {
  it("sums all member CB values", () => {
    expect(computePoolSum([{ cb: 1000 }, { cb: -500 }, { cb: 200 }])).toBeCloseTo(700);
  });

  it("returns 0 for empty array", () => {
    expect(computePoolSum([])).toBe(0);
  });
});

describe("isPoolValid", () => {
  it("returns true when sum is positive", () => {
    expect(isPoolValid([{ cb: 1000 }, { cb: -500 }])).toBe(true);
  });

  it("returns true when sum is exactly zero", () => {
    expect(isPoolValid([{ cb: 500 }, { cb: -500 }])).toBe(true);
  });

  it("returns false when sum is negative", () => {
    expect(isPoolValid([{ cb: 100 }, { cb: -500 }])).toBe(false);
  });
});
