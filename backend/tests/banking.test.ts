import { BankSurplus } from "../src/core/application/bankSurplus";
import { ApplyBanked } from "../src/core/application/applyBanked";
import { BankRepository } from "../src/core/ports/bankRepository";

const makeMockRepo = (initialBalance = 0): BankRepository => {
  let balance = initialBalance;
  return {
    getBanked: jest.fn(async () => balance),
    saveBanked: jest.fn(async (_shipId: string, amount: number) => { balance = amount; }),
    getRecords: jest.fn(async () => [])
  };
};

describe("BankSurplus", () => {
  test("banks positive CB and returns banked amount", async () => {
    const repo = makeMockRepo(0);
    const usecase = new BankSurplus(repo);
    const result = await usecase.execute("S1", 100);
    expect(result.banked).toBe(100);
    expect(repo.saveBanked).toHaveBeenCalledWith("S1", 100);
  });

  test("rejects negative CB", async () => {
    const repo = makeMockRepo(0);
    const usecase = new BankSurplus(repo);
    await expect(usecase.execute("S1", -10)).rejects.toThrow("Cannot bank negative CB");
  });

  test("rejects zero CB", async () => {
    const repo = makeMockRepo(0);
    const usecase = new BankSurplus(repo);
    await expect(usecase.execute("S1", 0)).rejects.toThrow();
  });

  test("accumulates on top of existing banked balance", async () => {
    const repo = makeMockRepo(200);
    const usecase = new BankSurplus(repo);
    const result = await usecase.execute("S1", 50);
    expect(result.banked).toBe(50);
    expect(repo.saveBanked).toHaveBeenCalledWith("S1", 250);
  });
});

describe("ApplyBanked", () => {
  test("applies banked amount to deficit", async () => {
    const repo = makeMockRepo(500);
    const usecase = new ApplyBanked(repo);
    const result = await usecase.execute("S1", -300, 200);
    expect(result.cb_before).toBe(-300);
    expect(result.applied).toBe(200);
    expect(result.cb_after).toBe(-100);
  });

  test("rejects applying more than banked", async () => {
    const repo = makeMockRepo(100);
    const usecase = new ApplyBanked(repo);
    await expect(usecase.execute("S1", -300, 200)).rejects.toThrow("Not enough banked");
  });

  test("rejects applying when no deficit", async () => {
    const repo = makeMockRepo(500);
    const usecase = new ApplyBanked(repo);
    await expect(usecase.execute("S1", 100, 50)).rejects.toThrow("No deficit");
  });
});