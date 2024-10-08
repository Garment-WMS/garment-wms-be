/*
  Warnings:

  - Made the column `inventory_report_id` on table `inventory_report_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `storage_quantity` on table `inventory_report_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `recorded_quantity` on table `inventory_report_detail` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "inventory_report_detail" ADD COLUMN     "material_receipt_id" UUID,
ADD COLUMN     "product_receipt_id" UUID,
ALTER COLUMN "inventory_report_id" SET NOT NULL,
ALTER COLUMN "storage_quantity" SET NOT NULL,
ALTER COLUMN "recorded_quantity" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "inventory_report_detail" ADD CONSTRAINT "inventory_report_detail_material_receipt_id_fkey" FOREIGN KEY ("material_receipt_id") REFERENCES "material_receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_report_detail" ADD CONSTRAINT "inventory_report_detail_product_receipt_id_fkey" FOREIGN KEY ("product_receipt_id") REFERENCES "product_receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
