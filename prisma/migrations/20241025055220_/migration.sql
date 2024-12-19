/*
  Warnings:

  - Added the required column `material_variant_id` to the `material_export_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_variant_id` to the `product_receipt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "material_export_detail" ADD COLUMN     "material_variant_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "product_receipt" ADD COLUMN     "product_variant_id" UUID NOT NULL;
