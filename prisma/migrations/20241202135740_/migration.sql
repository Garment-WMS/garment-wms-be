/*
  Warnings:

  - You are about to drop the column `product_formula_id` on the `material_export_request` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "material_export_request" DROP CONSTRAINT "material_export_request_product_formula_id_fkey";

-- AlterTable
ALTER TABLE "material_export_request" DROP COLUMN "product_formula_id";
