-- CreateTable
CREATE TABLE "Route" (
    "id" SERIAL NOT NULL,
    "routeId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "ghgIntensity" DOUBLE PRECISION NOT NULL,
    "fuelConsumption" DOUBLE PRECISION NOT NULL,
    "isBaseline" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankEntry" (
    "id" SERIAL NOT NULL,
    "shipId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "BankEntry_pkey" PRIMARY KEY ("id")
);
