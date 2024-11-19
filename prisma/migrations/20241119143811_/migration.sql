/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `material` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `material_package` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `supplier` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ProductReceiptStatus" AS ENUM ('IMPORTING', 'AVAILABLE', 'USED');

-- AlterTable
ALTER TABLE "product_receipt" ADD COLUMN     "status" "ProductReceiptStatus" NOT NULL DEFAULT 'AVAILABLE';

-- CreateIndex
CREATE UNIQUE INDEX "material_code_key" ON "material"("code");

-- CreateIndex
CREATE UNIQUE INDEX "material_package_code_key" ON "material_package"("code");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_code_key" ON "supplier"("code");
