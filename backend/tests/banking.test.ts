import { bankSurplus } from "../src/core/application/bankSurplus";

test("bank positive CB", () => {
  expect(bankSurplus(100)).toBe(100);
});

test("reject negative CB", () => {
  expect(() => bankSurplus(-10)).toThrow();
});