/*
  Warnings:

  - You are about to drop the column `material_package_id` on the `inventory_report_plan_detail` table. All the data in the column will be lost.
  - You are about to drop the column `product_size_id` on the `inventory_report_plan_detail` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "inventory_report_plan_detail" DROP CONSTRAINT "inventory_report_plan_detail_material_package_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_report_plan_detail" DROP CONSTRAINT "inventory_report_plan_detail_product_size_id_fkey";

-- AlterTable
ALTER TABLE "inventory_report_plan_detail" DROP COLUMN "material_package_id",
DROP COLUMN "product_size_id",
ADD COLUMN     "material_variant_id" UUID,
ADD COLUMN     "product_variant_id" UUID;

-- AddForeignKey
ALTER TABLE "inventory_report_plan_detail" ADD CONSTRAINT "inventory_report_plan_detail_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_report_plan_detail" ADD CONSTRAINT "inventory_report_plan_detail_material_variant_id_fkey" FOREIGN KEY ("material_variant_id") REFERENCES "material_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
