/*
  Warnings:

  - Added the required column `distance` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fuelType` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalEmissions` to the `Route` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vesselType` to the `Route` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "distance" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "fuelType" TEXT NOT NULL,
ADD COLUMN     "totalEmissions" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "vesselType" TEXT NOT NULL;
