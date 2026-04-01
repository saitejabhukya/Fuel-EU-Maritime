# AI Agent Workflow Log

## Agents Used

| Agent | Purpose |
|-------|---------|
| **GitHub Copilot** (Chat + inline) | Scaffolding boilerplate, generating Prisma models, Express route handlers |
| **Claude Code** | Architecture guidance, hexagonal pattern implementation, complex logic (banking, pooling algorithms) |
| **Cursor Agent** | Rapid file generation, refactoring repository implementations |

---

## Prompts & Outputs

### Example 1 — Generating the Prisma Schema

**Prompt given to Copilot:**
```
Generate a Prisma schema for a FuelEU Maritime compliance platform with tables for:
routes, ship_compliance, bank_entries, pools, pool_members.
Use camelCase field names. Include relations where appropriate.
```

**Generated output (snippet):**
```prisma
model Route {
  id              Int     @id @default(autoincrement())
  routeId         String
  vesselType      String
  fuelType        String
  year            Int
  ghgIntensity    Float
  fuelConsumption Float
  distance        Float
  totalEmissions  Float
  isBaseline      Boolean @default(false)
}

model BankEntry {
  id     Int    @id @default(autoincrement())
  shipId String
  year   Int
  amount Float
}
```

**Correction applied:** The initial schema did not include a `pool_members` table. Manually added `PoolMember` model referencing `Pool` by `poolId`.

---

### Example 2 — Banking Use-Case Logic

**Prompt given to Claude Code:**
```
Implement a BankSurplus use-case class in TypeScript following hexagonal architecture.
It should: (1) reject negative CB, (2) get current banked total from the BankRepository,
(3) save the new total (current + cb), (4) return { banked: cb }.
The BankRepository is injected via constructor.
```

**Generated output:**
```typescript
export class BankSurplus {
  constructor(private repo: BankRepository) {}

  async execute(shipId: string, cb: number) {
    if (cb <= 0) throw new Error("Cannot bank negative CB");
    const current = await this.repo.getBanked(shipId);
    await this.repo.saveBanked(shipId, current + cb);
    return { banked: cb };
  }
}
```

**Issue found in review:** The `BankRepositoryImpl.saveBanked` was calling `prisma.bankEntry.create()` with the new total, but `getBanked` was summing ALL rows, causing double-counting on repeated calls. This was a hallucination — the agent assumed `saveBanked` would be an upsert/replace but did not implement it that way. **Fixed** by rewriting `saveBanked` to `deleteMany` then `create` (a single-balance approach).

---

### Example 3 — Greedy Pool Allocation

**Prompt given to Cursor Agent:**
```
Write a TypeScript function for FuelEU Article 21 pool allocation.
Given an array of { shipId, cb } members:
1. Sort descending by cb
2. For each deficit member, greedily transfer from surplus members
3. Throw if total CB < 0
4. Return { shipId, cb_before, cb_after }[]
Store the pool via a PoolRepository injected in the constructor.
```

**Generated output:** Mostly correct. The greedy transfer logic worked. However, the agent forgot to capture `cb_before` values before mutating the array during sort/transfer. **Fixed** by adding `const originalCBs = new Map(members.map(m => [m.shipId, m.cb]))` before sorting.

---

### Example 4 — React BankingTab Component

**Prompt given to Copilot:**
```
Create a React + TailwindCSS BankingTab component that:
- Has Ship ID and Year inputs
- Fetches CB from /compliance/cb
- Has a "Bank Surplus" button (disabled if CB ≤ 0)
- Has an "Apply Banked" section with deficit and amount inputs
- Shows KPI cards for cb_before, applied, cb_after after applying
```

**Generated output:** Provided a solid structure. **Corrections made:**
- Changed direct `axios` calls to use the infrastructure adapter (`bankingClient`) for proper hexagonal separation
- Added proper TypeScript types for KPI state
- Improved error handling to display `e.response?.data?.error` from the API

---

## Validation / Corrections

| Issue | Detection Method | Fix |
|-------|-----------------|-----|
| `BankRepositoryImpl` double-counting | Manual code review | Changed `saveBanked` to delete+insert |
| `PoolRepositoryImpl` stores `cbBefore: 0` | Manual code review | Threaded `cb_before` through `CreatePool` return type |
| Tests called non-existent function exports | Running `npm test` — all failed | Rewrote tests to use class instantiation + mock repos |
| `Route` domain model missing fields | TypeScript compiler error | Added `vesselType`, `fuelType`, `distance`, `totalEmissions` |
| Missing `/compliance/adjusted-cb` endpoint | Spec review | Created `GetAdjustedCB` use-case, controller handler, route registration |
| No `npm run dev` script | Manual review | Added `ts-node-dev` script to `package.json` |
| `compareRoutes.ts` dead code inconsistency | Code review | Removed the file |

---

## Observations

### Where the Agent Saved Time

- **Schema generation**: Prisma model definitions were produced in seconds and were 90% accurate, saving ~30 minutes of boilerplate writing
- **Use-case scaffolding**: The class-based hexagonal pattern with injected repositories was reproduced correctly for all 7 use-cases with minimal prompt engineering
- **React component structure**: TailwindCSS class suggestions and state hook patterns were consistently good
- **Test structure**: Generating `describe/it` blocks with mock repositories was fast once a good example was given

### Where the Agent Failed or Hallucinated

- **Double-counting in `BankRepositoryImpl`**: The agent implemented `saveBanked` as an append-only operation, inconsistent with the `getBanked` summing all rows. The agent assumed the repository would be an upsert without implementing it that way.
- **`cbBefore` omission in `CreatePool`**: The agent returned only `{ shipId, cb_after }` and never tracked the pre-mutation values, requiring manual intervention.
- **Test export mismatch**: All three initial tests imported named functions that didn't exist (the use-cases were classes). The agent generated tests against a different design than what was implemented.
- **Missing endpoints**: The agent never suggested `GET /compliance/adjusted-cb` or `GET /banking/records` endpoints until explicitly prompted.

### How Tools Were Combined Effectively

- **Claude Code** was used for complex multi-step architectural decisions (hexagonal layers, port/adapter contracts)
- **Copilot inline** was used for quick completions within existing files (controllers, tab components)
- **Cursor Agent** was used in bulk-generation mode when creating multiple files with the same pattern (repository impls)
- Manual review was applied after each generation step before committing
