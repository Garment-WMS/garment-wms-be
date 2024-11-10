/*
  Warnings:

  - Added the required column `warehouse_manager_id` to the `receipt_adjustment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "receipt_adjustment" ADD COLUMN     "material_receipt_id" UUID,
ADD COLUMN     "product_receipt_id" UUID,
ADD COLUMN     "warehouse_manager_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "receipt_adjustment" ADD CONSTRAINT "receipt_adjustment_warehouse_manager_id_fkey" FOREIGN KEY ("warehouse_manager_id") REFERENCES "warehouse_manager"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "receipt_adjustment" ADD CONSTRAINT "receipt_adjustment_material_receipt_id_fkey" FOREIGN KEY ("material_receipt_id") REFERENCES "material_receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "receipt_adjustment" ADD CONSTRAINT "receipt_adjustment_product_receipt_id_fkey" FOREIGN KEY ("product_receipt_id") REFERENCES "product_receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
