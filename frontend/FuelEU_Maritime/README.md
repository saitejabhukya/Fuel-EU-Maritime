# Fuel EU Maritime — Frontend

React + TypeScript + TailwindCSS dashboard implementing a FuelEU Maritime compliance UI with hexagonal architecture.

## Stack

- **React 19** + **TypeScript** (strict mode)
- **TailwindCSS** for styling
- **Recharts** for data visualisation
- **Axios** for HTTP calls
- **Vitest** for unit testing

## Architecture (Hexagonal)

```
src/
  core/
    domain/types.ts         – Domain entity types
    application/compliance.ts – Pure use-case functions (CB formula, pool validation)
    ports/apiPorts.ts       – Outbound port interfaces (RoutePort, BankingPort…)
  adapters/
    infrastructure/apiClient.ts – Axios implementation of all ports
    ui/                     – (tabs serve as UI adapters)
  shared/
    constants.ts            – TARGET_GHG_INTENSITY, ENERGY_CONVERSION_FACTOR
  tabs/                     – React components (RoutesTab, CompareTab, BankingTab, PoolingTab)
```

## Setup & Run

```bash
cd frontend/FuelEU_Maritime
npm install
npm run dev        # starts on http://localhost:5173
```

> Requires the backend running on `http://localhost:3000`

## Tests

```bash
npm test
```

15 unit tests covering CB formula, compliance checks, percent diff, pool sum, and pool validity.

## Tabs

| Tab | Description |
|-----|-------------|
| Routes | All routes with filters by vessel/fuel/year; Set Baseline action |
| Compare | GHG intensity vs baseline; % diff; compliance status; bar chart with target reference line |
| Banking | Get CB, Bank Surplus, Apply Banked credits; KPI display (cb_before/applied/cb_after) |
| Pooling | Fetch adjusted CB per ship, edit CBs, create pool with sum validation indicator |

