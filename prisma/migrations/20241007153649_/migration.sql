/*
  Warnings:

  - You are about to drop the column `materialId` on the `product_formula` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "product_formula" DROP CONSTRAINT "product_formula_materialId_fkey";

-- AlterTable
ALTER TABLE "product_formula" DROP COLUMN "materialId";
