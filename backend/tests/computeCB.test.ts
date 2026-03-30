import { computeCB } from "../src/core/application/computeCB";

// This test checks if the computeCB function returns a defined result when given valid input parameters.

test("computeCB works", () => {
  const result = computeCB({
    ghgIntensity: 90,
    fuelConsumption: 5000
  });
// The test expects that the result of computeCB is defined, indicating that the function executed successfully and returned a value.
  expect(result).toBeDefined();
});