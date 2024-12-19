/*
  Warnings:

  - You are about to drop the column `material_package_id` on the `inventory_report` table. All the data in the column will be lost.
  - You are about to drop the column `product_size_id` on the `inventory_report` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "inventory_report" DROP CONSTRAINT "inventory_report_material_package_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_report" DROP CONSTRAINT "inventory_report_product_size_id_fkey";

-- AlterTable
ALTER TABLE "inventory_report" DROP COLUMN "material_package_id",
DROP COLUMN "product_size_id",
ADD COLUMN     "materialPackageId" UUID,
ADD COLUMN     "material_variant_id" UUID,
ADD COLUMN     "productSizeId" UUID,
ADD COLUMN     "product_variant_id" UUID;

-- AddForeignKey
ALTER TABLE "inventory_report" ADD CONSTRAINT "inventory_report_material_variant_id_fkey" FOREIGN KEY ("material_variant_id") REFERENCES "material_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_report" ADD CONSTRAINT "inventory_report_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
