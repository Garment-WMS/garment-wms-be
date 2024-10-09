/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `material_uom` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "po_delivery" DROP CONSTRAINT "po_delivery_purchase_order_id_fkey";

-- DropForeignKey
ALTER TABLE "po_delivery_detail" DROP CONSTRAINT "po_delivery_detail_po_delivery_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "material_uom_name_key" ON "material_uom"("name");

-- AddForeignKey
ALTER TABLE "po_delivery_detail" ADD CONSTRAINT "po_delivery_detail_po_delivery_id_fkey" FOREIGN KEY ("po_delivery_id") REFERENCES "po_delivery"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "po_delivery" ADD CONSTRAINT "po_delivery_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_order"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
