import { CreatePool } from "../src/core/application/createPool";
import { PoolRepository } from "../src/core/ports/poolRepository";

const makeMockRepo = (): PoolRepository => ({
  savePool: jest.fn(async () => {})
});

describe("CreatePool", () => {
  test("greedy allocation balances deficits", async () => {
    const repo = makeMockRepo();
    const usecase = new CreatePool(repo);
    const result = await usecase.execute([
      { shipId: "S1", cb: 1000 },
      { shipId: "S2", cb: -500 }
    ]);
    const s2 = result.find(r => r.shipId === "S2")!;
    expect(s2.cb_after).toBe(0);
  });

  test("preserves cbBefore for each member", async () => {
    const repo = makeMockRepo();
    const usecase = new CreatePool(repo);
    const result = await usecase.execute([
      { shipId: "S1", cb: 1000 },
      { shipId: "S2", cb: -400 }
    ]);
    const s1 = result.find(r => r.shipId === "S1")!;
    const s2 = result.find(r => r.shipId === "S2")!;
    expect(s1.cb_before).toBe(1000);
    expect(s2.cb_before).toBe(-400);
  });

  test("saves pool to repository", async () => {
    const repo = makeMockRepo();
    const usecase = new CreatePool(repo);
    await usecase.execute([
      { shipId: "S1", cb: 500 },
      { shipId: "S2", cb: -200 }
    ]);
    expect(repo.savePool).toHaveBeenCalled();
  });

  test("throws when pool total CB is negative", async () => {
    const repo = makeMockRepo();
    const usecase = new CreatePool(repo);
    await expect(
      usecase.execute([
        { shipId: "S1", cb: 100 },
        { shipId: "S2", cb: -500 }
      ])
    ).rejects.toThrow("Invalid pool");
  });

  test("handles multiple deficits with one surplus", async () => {
    const repo = makeMockRepo();
    const usecase = new CreatePool(repo);
    const result = await usecase.execute([
      { shipId: "S1", cb: 1000 },
      { shipId: "S2", cb: -300 },
      { shipId: "S3", cb: -200 }
    ]);
    const s2 = result.find(r => r.shipId === "S2")!;
    const s3 = result.find(r => r.shipId === "S3")!;
    expect(s2.cb_after).toBe(0);
    expect(s3.cb_after).toBe(0);
  });
});