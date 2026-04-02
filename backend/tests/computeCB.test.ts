import { ComputeCB } from "../src/core/application/computeCB";

test("computeCB returns positive value when below target", () => {
  const usecase = new ComputeCB();
  const result = usecase.execute({
    routeId: "R002",
    vesselType: "BulkCarrier",
    fuelType: "LNG",
    ghgIntensity: 88.0,
    fuelConsumption: 4800,
    distance: 11500,
    totalEmissions: 4200,
    year: 2024,
    isBaseline: false
  });
  expect(result).toBeGreaterThan(0);
});

test("computeCB returns negative value when above target", () => {
  const usecase = new ComputeCB();
  const result = usecase.execute({
    routeId: "R003",
    vesselType: "Tanker",
    fuelType: "MGO",
    ghgIntensity: 93.5,
    fuelConsumption: 5100,
    distance: 12500,
    totalEmissions: 4700,
    year: 2024,
    isBaseline: false
  });
  expect(result).toBeLessThan(0);
});

test("computeCB formula: (TARGET - actual) * energy", () => {
  const usecase = new ComputeCB();
  const ghgIntensity = 90;
  const fuelConsumption = 5000;
  const expected = (89.3368 - ghgIntensity) * (fuelConsumption * 41000);
  const result = usecase.execute({
    routeId: "R001",
    vesselType: "Container",
    fuelType: "HFO",
    ghgIntensity,
    fuelConsumption,
    distance: 12000,
    totalEmissions: 4500,
    year: 2024,
    isBaseline: true
  });
  expect(result).toBeCloseTo(expected);
});