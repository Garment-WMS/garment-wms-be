/*
  Warnings:

  - You are about to drop the column `pack_unit` on the `import_request_detail` table. All the data in the column will be lost.
  - You are about to drop the column `pack_unit` on the `inspection_report_detail` table. All the data in the column will be lost.
  - You are about to drop the column `uom` on the `inspection_report_detail` table. All the data in the column will be lost.
  - You are about to drop the column `uom_per_pack` on the `inspection_report_detail` table. All the data in the column will be lost.
  - You are about to drop the column `uom_id` on the `manufacture_order` table. All the data in the column will be lost.
  - You are about to drop the column `material_uom_id` on the `material_receipt` table. All the data in the column will be lost.
  - You are about to drop the column `product_uom_id` on the `product_receipt` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "product_receipt" DROP CONSTRAINT "product_receipt_product_uom_id_fkey";

-- AlterTable
ALTER TABLE "import_request_detail" DROP COLUMN "pack_unit";

-- AlterTable
ALTER TABLE "inspection_report_detail" DROP COLUMN "pack_unit",
DROP COLUMN "uom",
DROP COLUMN "uom_per_pack";

-- AlterTable
ALTER TABLE "manufacture_order" DROP COLUMN "uom_id";

-- AlterTable
ALTER TABLE "material_receipt" DROP COLUMN "material_uom_id";

-- AlterTable
ALTER TABLE "product_receipt" DROP COLUMN "product_uom_id";

-- CreateTable
CREATE TABLE "_ProductReceiptToProductUom" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductReceiptToProductUom_AB_unique" ON "_ProductReceiptToProductUom"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductReceiptToProductUom_B_index" ON "_ProductReceiptToProductUom"("B");

-- AddForeignKey
ALTER TABLE "_ProductReceiptToProductUom" ADD CONSTRAINT "_ProductReceiptToProductUom_A_fkey" FOREIGN KEY ("A") REFERENCES "product_receipt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductReceiptToProductUom" ADD CONSTRAINT "_ProductReceiptToProductUom_B_fkey" FOREIGN KEY ("B") REFERENCES "product_uom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
