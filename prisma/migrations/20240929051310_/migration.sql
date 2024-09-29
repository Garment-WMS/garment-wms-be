/*
  Warnings:

  - You are about to drop the `po_receipt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `po_receipt_detail` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "po_delivery_status" AS ENUM ('PENDING', 'FINISHED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "import_request" DROP CONSTRAINT "import_request_po_receipt_id_fkey";

-- DropForeignKey
ALTER TABLE "po_receipt" DROP CONSTRAINT "po_receipt_purchase_order_id_fkey";

-- DropForeignKey
ALTER TABLE "po_receipt_detail" DROP CONSTRAINT "po_receipt_detail_material_id_fkey";

-- DropForeignKey
ALTER TABLE "po_receipt_detail" DROP CONSTRAINT "po_receipt_detail_po_receipt_id_fkey";

-- DropForeignKey
ALTER TABLE "po_receipt_detail" DROP CONSTRAINT "po_receipt_detail_product_id_fkey";

-- DropTable
DROP TABLE "po_receipt";

-- DropTable
DROP TABLE "po_receipt_detail";

-- DropEnum
DROP TYPE "po_receipt_status";

-- CreateTable
CREATE TABLE "po_delivery_detail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "po_delivery_id" UUID,
    "material_id" UUID,
    "product_id" UUID,
    "quantity" DOUBLE PRECISION,
    "total_ammount" DOUBLE PRECISION,
    "expire_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "po_delivery_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "po_delivery" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "purchase_order_id" UUID,
    "total_ammount" DOUBLE PRECISION,
    "tax_amount" DOUBLE PRECISION,
    "order_date" DATE,
    "expected_deliver_date" DATE,
    "deliver_date" DATE,
    "status" "po_delivery_status",
    "is_extra" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "po_delivery_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "import_request" ADD CONSTRAINT "import_request_po_receipt_id_fkey" FOREIGN KEY ("po_receipt_id") REFERENCES "po_delivery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "po_delivery_detail" ADD CONSTRAINT "po_delivery_detail_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "po_delivery_detail" ADD CONSTRAINT "po_delivery_detail_po_delivery_id_fkey" FOREIGN KEY ("po_delivery_id") REFERENCES "po_delivery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "po_delivery_detail" ADD CONSTRAINT "po_delivery_detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "po_delivery" ADD CONSTRAINT "po_delivery_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
