/*
  Warnings:

  - You are about to drop the column `materialUomId` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `uom_id` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `material_uom_id` on the `product_receipt` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "material" DROP CONSTRAINT "material_materialUomId_fkey";

-- DropForeignKey
ALTER TABLE "product_receipt" DROP CONSTRAINT "product_receipt_material_uom_id_fkey";

-- AlterTable
ALTER TABLE "material" DROP COLUMN "materialUomId",
DROP COLUMN "uom_id",
ADD COLUMN     "material_uom_id" UUID;

-- AlterTable
ALTER TABLE "product_receipt" DROP COLUMN "material_uom_id",
ADD COLUMN     "product_uom_id" UUID;

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_material_uom_id_fkey" FOREIGN KEY ("material_uom_id") REFERENCES "material_uom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_receipt" ADD CONSTRAINT "product_receipt_product_uom_id_fkey" FOREIGN KEY ("product_uom_id") REFERENCES "product_uom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
