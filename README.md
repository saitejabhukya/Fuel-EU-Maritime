# Fuel EU Maritime — Compliance Platform

A full-stack Fuel EU Maritime compliance dashboard implementing Articles 20–21 of Regulation (EU) 2023/1805.

---

## Overview

This platform lets vessel operators:

- View and filter routes and their GHG intensity data
- Compare routes against the 2025 FuelEU target (89.3368 gCO₂e/MJ)
- Compute Compliance Balance (CB) per ship/year
- **Bank** surplus CB credits (Article 20)
- **Apply** banked credits to deficits (Article 20)
- **Pool** compliance credits across ships (Article 21)

---

## Architecture Summary (Hexagonal / Ports & Adapters)

Both backend and frontend follow the hexagonal architecture pattern — the domain core has no dependency on frameworks.

### Backend (`/backend`)

```
src/
  core/
    domain/               – Route, Compliance, BankEntry, Pool, PoolMember interfaces
    application/          – Use-cases: ComputeCB, GetComplianceCB, GetAdjustedCB,
                            BankSurplus, ApplyBanked, CreatePool, GetRoutes,
                            SetBaseline, GetComparison
    ports/                – Repository interfaces (RouteRepository, ComplianceRepository,
                            BankRepository, PoolRepository)
  adapters/
    inbound/http/         – Express controllers (routesController, complianceController,
                            bankingController, poolController)
    outbound/postgres/    – Prisma-backed repository implementations
  infrastructure/
    db/                   – PrismaClient setup
    server/               – Express server + route registration
```

### Frontend (`/frontend/FuelEU_Maritime`)

```
src/
  core/
    domain/types.ts               – Domain entity types
    application/compliance.ts     – Pure use-case functions (CB formula, pool validation)
    ports/apiPorts.ts             – Outbound port interfaces
  adapters/
    infrastructure/apiClient.ts   – Axios API client implementing all ports
  shared/constants.ts             – TARGET_GHG_INTENSITY, ENERGY_CONVERSION_FACTOR
  tabs/                            – React UI components (one per dashboard tab)
```

### Key Constants

| Constant | Value | Source |
|----------|-------|--------|
| Target GHG Intensity (2025) | 89.3368 gCO₂e/MJ | 2% below 91.16 |
| Energy conversion factor | 41,000 MJ/t | FuelEU Annex IV |
| CB formula | `(Target − Actual) × (fuelConsumption × 41000)` | Article 4 |

---

## Setup & Run

### Prerequisites

- Node.js ≥ 18
- PostgreSQL running locally
- Create `.env` file in `/backend` and paste this line `DATABASE_URL = "postgresql://postgres:your_password@localhost:5432/database_name"` , change the password and the database name you have created in PostgreSQL

### Backend

```bash
cd backend
npm install
npx prisma migrate dev      # runs migrations
npx ts-node prisma/seed.ts          # seeds 5 sample routes
npm run dev                  # starts on http://localhost:3000
```

### Frontend

```bash
cd frontend/FuelEU_Maritime
npm install
npm run dev                  # starts on http://localhost:5173
```

---

## Running Tests

### Backend (Jest — 15 tests)

```bash
cd backend
npm test
```

Tests cover: `ComputeCB`, `BankSurplus`, `ApplyBanked`, `CreatePool` with mock repositories.

### Frontend (Vitest — 15 tests)

```bash
cd frontend/FuelEU_Maritime
npm test
```

Tests cover: CB formula, compliance check, percent diff, pool sum, pool validity.

---

## API Endpoints

### Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/routes` | All routes |
| POST | `/routes/:id/baseline` | Set a route as baseline |
| GET | `/routes/comparison` | Baseline vs all routes with % diff and compliance |

### Compliance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/compliance/cb?shipId&year` | Compute & store CB snapshot |
| GET | `/compliance/adjusted-cb?shipId&year` | CB after bank applications |

### Banking

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/banking/records?shipId&year` | Bank entry records |
| POST | `/banking/bank` | Bank positive CB `{ shipId, cb }` |
| POST | `/banking/apply` | Apply banked to deficit `{ shipId, deficit, amount }` |

### Pooling

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/pools` | Create pool `{ members: [{ shipId, cb }] }` |

---

## Sample Requests & Responses

### Get Compliance Balance

```
GET /compliance/cb?shipId=S1&year=2024
```

```json
{ "shipId": "S1", "year": 2024, "cb": -136136800 }
```

### Bank Surplus

```
POST /banking/bank
{ "shipId": "S2", "cb": 26568000 }
```

```json
{ "banked": 26568000 }
```

### Apply Banked

```
POST /banking/apply
{ "shipId": "S2", "deficit": -50000000, "amount": 26568000 }
```

```json
{ "cb_before": -50000000, "applied": 26568000, "cb_after": -23432000 }
```

### Create Pool

```
POST /pools
{ "members": [{ "shipId": "S2", "cb": 26568000 }, { "shipId": "S1", "cb": -10000000 }] }
```

```json
[
  { "shipId": "S2", "cb_before": 26568000, "cb_after": 16568000 },
  { "shipId": "S1", "cb_before": -10000000, "cb_after": 0 }
]
```

---

## Seed Data

| routeId | vesselType | fuelType | year | ghgIntensity | fuelConsumption (t) | distance (km) | totalEmissions (t) |
|---------|------------|----------|------|--------------|---------------------|---------------|--------------------|
| R001 | Container | HFO | 2024 | 91.0 | 5000 | 12000 | 4500 |
| R002 | BulkCarrier | LNG | 2024 | 88.0 | 4800 | 11500 | 4200 |
| R003 | Tanker | MGO | 2024 | 93.5 | 5100 | 12500 | 4700 |
| R004 | RoRo | HFO | 2025 | 89.2 | 4900 | 11800 | 4300 |
| R005 | Container | LNG | 2025 | 90.5 | 4950 | 11900 | 4400 |

R001 is initially seeded as the baseline route. You can change it later.
