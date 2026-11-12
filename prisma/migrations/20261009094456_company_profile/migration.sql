/*
  Warnings:

  - Added the required column `operatingMode` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productType` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "budgetLkr" INTEGER,
ADD COLUMN     "geographicFocus" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "operatingMode" TEXT NOT NULL,
ADD COLUMN     "productType" TEXT NOT NULL;
