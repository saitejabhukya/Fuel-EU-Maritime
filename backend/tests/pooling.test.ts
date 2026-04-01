import { createPool } from "../src/core/application/createPool";

test("pool balances deficits", () => {
  const result = createPool([
    { shipId: "S1", cb: 1000 },
    { shipId: "S2", cb: -500 }
  ]);

  expect(result[1].cb_after).toBe(0);
});