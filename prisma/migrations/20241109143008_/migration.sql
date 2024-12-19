/*
  Warnings:

  - You are about to drop the `material_export_detail` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "MaterialExportRequestStatus" ADD VALUE 'DELIVERED';
ALTER TYPE "MaterialExportRequestStatus" ADD VALUE 'PRODUCTION_APPROVED';
ALTER TYPE "MaterialExportRequestStatus" ADD VALUE 'PRODUCTION_REJECTED';
ALTER TYPE "MaterialExportRequestStatus" ADD VALUE 'RETURNED';

-- DropForeignKey
ALTER TABLE "material_export_detail" DROP CONSTRAINT "material_export_detail_material_export_request_id_fkey";

-- DropForeignKey
ALTER TABLE "material_export_detail" DROP CONSTRAINT "material_export_detail_material_package_id_fkey";

-- DropForeignKey
ALTER TABLE "material_export_receipt" DROP CONSTRAINT "material_export_receipt_material_export_detail_id_fkey";

-- AlterTable
ALTER TABLE "import_request" ADD COLUMN     "appove_note" VARCHAR;

-- AlterTable
ALTER TABLE "material_export_request" ADD COLUMN     "appove_note" VARCHAR,
ADD COLUMN     "product_formula_id" UUID,
ADD COLUMN     "reject_at" TIMESTAMPTZ(6),
ADD COLUMN     "reject_reason" VARCHAR;

-- DropTable
DROP TABLE "material_export_detail";

-- CreateTable
CREATE TABLE "material_export_receipt_detail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_export_receipt_id" UUID NOT NULL,
    "material_receipt_id" UUID NOT NULL,
    "quantity_by_pack" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "material_export_receipt_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_export_request_detail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_export_request_id" UUID NOT NULL,
    "material_variant_id" UUID,
    "quantity_by_uom" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "material_export_request_detail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "material_export_receipt_detail" ADD CONSTRAINT "material_export_receipt_detail_material_export_receipt_id_fkey" FOREIGN KEY ("material_export_receipt_id") REFERENCES "material_export_receipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_export_receipt_detail" ADD CONSTRAINT "material_export_receipt_detail_material_receipt_id_fkey" FOREIGN KEY ("material_receipt_id") REFERENCES "material_receipt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_export_request_detail" ADD CONSTRAINT "material_export_request_detail_material_export_request_id_fkey" FOREIGN KEY ("material_export_request_id") REFERENCES "material_export_request"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_export_request_detail" ADD CONSTRAINT "material_export_request_detail_material_variant_id_fkey" FOREIGN KEY ("material_variant_id") REFERENCES "material_variant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_export_request" ADD CONSTRAINT "material_export_request_product_formula_id_fkey" FOREIGN KEY ("product_formula_id") REFERENCES "product_formula"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
