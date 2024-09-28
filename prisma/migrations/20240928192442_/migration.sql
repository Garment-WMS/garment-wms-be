/*
  Warnings:

  - You are about to drop the column `delivery_note_id` on the `import_request` table. All the data in the column will be lost.
  - You are about to drop the column `height_per_store_unit` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `length_per_store_unit` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `quantity_per_store_unit` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `store_unit_id` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `store_unit_per_cell` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `unit_per_store_unit` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `weight_per_store_unit` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `width_per_store_unit` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `height_per_store_unit` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `length_per_store_unit` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `quantity_per_store_unit` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `store_unit_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `store_unit_per_cell` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `unit_per_store_unit` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `weight_per_store_unit` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `width_per_store_unit` on the `product` table. All the data in the column will be lost.
  - You are about to drop the `delivery_note` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `delivery_note_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `material_supplier` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `store_unit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "delivery_note" DROP CONSTRAINT "delivery_note_po_receipt_id_fkey";

-- DropForeignKey
ALTER TABLE "delivery_note" DROP CONSTRAINT "delivery_note_warehouse_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "delivery_note_detail" DROP CONSTRAINT "delivery_note_detail_delivery_note_id_fkey";

-- DropForeignKey
ALTER TABLE "delivery_note_detail" DROP CONSTRAINT "delivery_note_detail_material_id_fkey";

-- DropForeignKey
ALTER TABLE "delivery_note_detail" DROP CONSTRAINT "delivery_note_detail_product_id_fkey";

-- DropForeignKey
ALTER TABLE "import_request" DROP CONSTRAINT "import_request_delivery_note_id_fkey";

-- DropForeignKey
ALTER TABLE "inspection_request" DROP CONSTRAINT "inspection_request_delivery_note_id_fkey";

-- DropForeignKey
ALTER TABLE "material" DROP CONSTRAINT "material_store_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "material_supplier" DROP CONSTRAINT "material_supplier_material_id_fkey";

-- DropForeignKey
ALTER TABLE "material_supplier" DROP CONSTRAINT "material_supplier_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_store_unit_id_fkey";

-- AlterTable
ALTER TABLE "import_receipt" ADD COLUMN     "po_receipt_id" UUID;

-- AlterTable
ALTER TABLE "import_request" DROP COLUMN "delivery_note_id",
ADD COLUMN     "po_receipt_id" UUID;

-- AlterTable
ALTER TABLE "material" DROP COLUMN "height_per_store_unit",
DROP COLUMN "length_per_store_unit",
DROP COLUMN "quantity_per_store_unit",
DROP COLUMN "store_unit_id",
DROP COLUMN "store_unit_per_cell",
DROP COLUMN "unit_per_store_unit",
DROP COLUMN "weight_per_store_unit",
DROP COLUMN "width_per_store_unit";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "height_per_store_unit",
DROP COLUMN "length_per_store_unit",
DROP COLUMN "quantity_per_store_unit",
DROP COLUMN "store_unit_id",
DROP COLUMN "store_unit_per_cell",
DROP COLUMN "unit_per_store_unit",
DROP COLUMN "weight_per_store_unit",
DROP COLUMN "width_per_store_unit";

-- AlterTable
ALTER TABLE "purchase_order" ADD COLUMN     "supplier_id" UUID;

-- DropTable
DROP TABLE "delivery_note";

-- DropTable
DROP TABLE "delivery_note_detail";

-- DropTable
DROP TABLE "material_supplier";

-- DropTable
DROP TABLE "store_unit";

-- AddForeignKey
ALTER TABLE "import_request" ADD CONSTRAINT "import_request_po_receipt_id_fkey" FOREIGN KEY ("po_receipt_id") REFERENCES "po_receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_order" ADD CONSTRAINT "purchase_order_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
