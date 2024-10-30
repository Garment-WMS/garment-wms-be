/*
  Warnings:

  - You are about to drop the column `sku` on the `material_receipt` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "material_receipt_sku_key";

-- AlterTable
ALTER TABLE "material_package" ADD COLUMN     "sku" VARCHAR NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "material_receipt" DROP COLUMN "sku";
