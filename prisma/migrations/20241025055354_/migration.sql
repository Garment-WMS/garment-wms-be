/*
  Warnings:

  - You are about to drop the column `material_variant_id` on the `material_export_detail` table. All the data in the column will be lost.
  - You are about to drop the column `product_variant_id` on the `product_receipt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "material_export_detail" DROP COLUMN "material_variant_id";

-- AlterTable
ALTER TABLE "product_receipt" DROP COLUMN "product_variant_id";
