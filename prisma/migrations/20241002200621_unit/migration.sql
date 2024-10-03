/*
  Warnings:

  - The values [IN_PROGRESS,FINISHED] on the enum `import_request_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `po_receipt_id` on the `import_receipt` table. All the data in the column will be lost.
  - You are about to drop the column `po_receipt_id` on the `import_request` table. All the data in the column will be lost.
  - You are about to drop the column `quantity_by_uom` on the `import_request_detail` table. All the data in the column will be lost.
  - You are about to drop the column `approved_quantity` on the `inspection_report_detail` table. All the data in the column will be lost.
  - You are about to drop the column `defect_quantity` on the `inspection_report_detail` table. All the data in the column will be lost.
  - You are about to drop the column `inspected_quantity` on the `inspection_report_detail` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `min_quantity` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `quantity_by_uom` on the `material_receipt` table. All the data in the column will be lost.
  - You are about to drop the column `quantity_by_packaging` on the `po_delivery_detail` table. All the data in the column will be lost.
  - You are about to drop the column `quantity_by_uom` on the `po_delivery_detail` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `quantity_report_plan` table. All the data in the column will be lost.
  - You are about to drop the column `quantity_report_id` on the `quantity_report_plan` table. All the data in the column will be lost.
  - You are about to drop the `material_export` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `packaging_unit` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[inspection_report_id]` on the table `import_receipt` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[quantity_report_plan_id]` on the table `quantity_report` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `po_delivery_id` to the `import_request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `approved_quantity_by_pack` to the `inspection_report_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defect_quantity_by_pack` to the `inspection_report_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inspection_report_id` to the `inspection_report_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packed_height` to the `material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packed_length` to the `material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packed_weight` to the `material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packed_width` to the `material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reorder_level` to the `material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uom` to the `material_receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plan_end_time` to the `quantity_report_plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plan_start_time` to the `quantity_report_plan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ManufactureOrderStatus" AS ENUM ('EXECUTING', 'FINISHED', 'CANCELED');

-- CreateEnum
CREATE TYPE "MaterialExportRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'EXPORTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "QuantityReportStatus" AS ENUM ('PLANNING', 'EXECUTING', 'FINISHED');

-- AlterEnum
BEGIN;
CREATE TYPE "import_request_status_new" AS ENUM ('PENDING', 'REJECTED', 'APPROVED', 'INSPECTING', 'INSPECTED', 'IMPORTING', 'IMPORTED', 'CANCELED');
ALTER TABLE "import_request" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "import_request" ALTER COLUMN "status" TYPE "import_request_status_new" USING ("status"::text::"import_request_status_new");
ALTER TYPE "import_request_status" RENAME TO "import_request_status_old";
ALTER TYPE "import_request_status_new" RENAME TO "import_request_status";
DROP TYPE "import_request_status_old";
ALTER TABLE "import_request" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "import_request" DROP CONSTRAINT "import_request_po_receipt_id_fkey";

-- DropForeignKey
ALTER TABLE "material" DROP CONSTRAINT "material_packaging_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_packaging_unit_id_fkey";

-- AlterTable
ALTER TABLE "import_receipt" DROP COLUMN "po_receipt_id",
ADD COLUMN     "inspection_report_id" UUID;

-- AlterTable
ALTER TABLE "import_request" DROP COLUMN "po_receipt_id",
ADD COLUMN     "cancel_at" TIMESTAMPTZ(6),
ADD COLUMN     "cancel_reason" VARCHAR,
ADD COLUMN     "description" VARCHAR,
ADD COLUMN     "po_delivery_id" UUID NOT NULL,
ADD COLUMN     "purchasing_staff_id" UUID,
ADD COLUMN     "reject_at" TIMESTAMPTZ(6),
ADD COLUMN     "reject_reason" VARCHAR,
ADD COLUMN     "warehouse_manager_id" UUID;

-- AlterTable
ALTER TABLE "import_request_detail" DROP COLUMN "quantity_by_uom",
ADD COLUMN     "pack_unit" TEXT,
ADD COLUMN     "quantity_by_pack" DOUBLE PRECISION,
ADD COLUMN     "uom" TEXT,
ADD COLUMN     "uom_per_pack" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "inspection_report_detail" DROP COLUMN "approved_quantity",
DROP COLUMN "defect_quantity",
DROP COLUMN "inspected_quantity",
ADD COLUMN     "approved_quantity_by_pack" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "defect_quantity_by_pack" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "inspection_report_id" UUID NOT NULL,
ADD COLUMN     "pack_unit" TEXT,
ADD COLUMN     "quantity_by_pack" DOUBLE PRECISION,
ADD COLUMN     "uom" TEXT,
ADD COLUMN     "uom_per_pack" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "material" DROP COLUMN "height",
DROP COLUMN "length",
DROP COLUMN "min_quantity",
DROP COLUMN "width",
ADD COLUMN     "packed_height" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "packed_length" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "packed_weight" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "packed_width" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "reorder_level" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "material_receipt" DROP COLUMN "quantity_by_uom",
ADD COLUMN     "pack_unit" TEXT,
ADD COLUMN     "quantity_by_pack" DOUBLE PRECISION,
ADD COLUMN     "uom" TEXT NOT NULL,
ADD COLUMN     "uomId" UUID,
ADD COLUMN     "uom_per_pack" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "po_delivery_detail" DROP COLUMN "quantity_by_packaging",
DROP COLUMN "quantity_by_uom",
ADD COLUMN     "pack_unit" TEXT,
ADD COLUMN     "quantity_by_pack" DOUBLE PRECISION,
ADD COLUMN     "uom" TEXT,
ADD COLUMN     "uom_per_pack" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "product_receipt" ADD COLUMN     "uomId" UUID;

-- AlterTable
ALTER TABLE "quantity_report" ADD COLUMN     "quantity_report_plan_id" UUID;

-- AlterTable
ALTER TABLE "quantity_report_plan" DROP COLUMN "date",
DROP COLUMN "quantity_report_id",
ADD COLUMN     "end_time" TIME,
ADD COLUMN     "plan_end_time" TIME NOT NULL,
ADD COLUMN     "plan_start_time" TIME NOT NULL,
ADD COLUMN     "start_time" TIME,
ADD COLUMN     "status" "QuantityReportStatus" NOT NULL DEFAULT 'PLANNING';

-- DropTable
DROP TABLE "material_export";

-- DropTable
DROP TABLE "packaging_unit";

-- CreateTable
CREATE TABLE "manufacture_order" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "code" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR,
    "quantity" DOUBLE PRECISION NOT NULL,
    "uom_id" UUID NOT NULL,
    "canceled_at" TIMESTAMPTZ(6),
    "canceled_by" UUID,
    "canceled_reason" VARCHAR,
    "status" "ManufactureOrderStatus" NOT NULL DEFAULT 'EXECUTING',
    "start_time" TIME,
    "end_time" TIME,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "manufacture_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_export_detail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_export_request_id" UUID,
    "material_id" UUID NOT NULL,
    "quantity_by_uom" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "material_export_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_export_receipt" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_export_detail_id" UUID NOT NULL,
    "material_receipt_id" UUID,
    "quantity_by_pack" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "material_export_receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_export_request" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "manufacturer_order_id" UUID,
    "status" "MaterialExportRequestStatus" NOT NULL DEFAULT 'PENDING',
    "description" VARCHAR,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "material_export_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "import_receipt_inspection_report_id_key" ON "import_receipt"("inspection_report_id");

-- CreateIndex
CREATE UNIQUE INDEX "quantity_report_quantity_report_plan_id_key" ON "quantity_report"("quantity_report_plan_id");

-- AddForeignKey
ALTER TABLE "import_receipt" ADD CONSTRAINT "import_receipt_inspection_report_id_fkey" FOREIGN KEY ("inspection_report_id") REFERENCES "inspection_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request" ADD CONSTRAINT "import_request_po_delivery_id_fkey" FOREIGN KEY ("po_delivery_id") REFERENCES "po_delivery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request" ADD CONSTRAINT "import_request_warehouse_manager_id_fkey" FOREIGN KEY ("warehouse_manager_id") REFERENCES "warehouse_manager"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request" ADD CONSTRAINT "import_request_purchasing_staff_id_fkey" FOREIGN KEY ("purchasing_staff_id") REFERENCES "purchasing_staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_report_detail" ADD CONSTRAINT "inspection_report_detail_inspection_report_id_fkey" FOREIGN KEY ("inspection_report_id") REFERENCES "inspection_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "manufacture_order" ADD CONSTRAINT "manufacture_order_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_export_detail" ADD CONSTRAINT "material_export_detail_material_export_request_id_fkey" FOREIGN KEY ("material_export_request_id") REFERENCES "material_export_request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_export_detail" ADD CONSTRAINT "material_export_detail_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_export_receipt" ADD CONSTRAINT "material_export_receipt_material_export_detail_id_fkey" FOREIGN KEY ("material_export_detail_id") REFERENCES "material_export_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_export_receipt" ADD CONSTRAINT "material_export_receipt_material_receipt_id_fkey" FOREIGN KEY ("material_receipt_id") REFERENCES "material_receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_export_request" ADD CONSTRAINT "material_export_request_manufacturer_order_id_fkey" FOREIGN KEY ("manufacturer_order_id") REFERENCES "manufacture_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_receipt" ADD CONSTRAINT "material_receipt_uomId_fkey" FOREIGN KEY ("uomId") REFERENCES "uom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_receipt" ADD CONSTRAINT "product_receipt_uomId_fkey" FOREIGN KEY ("uomId") REFERENCES "uom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quantity_report" ADD CONSTRAINT "quantity_report_quantity_report_plan_id_fkey" FOREIGN KEY ("quantity_report_plan_id") REFERENCES "quantity_report_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
