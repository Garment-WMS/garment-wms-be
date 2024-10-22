/*
  Warnings:

  - You are about to drop the column `finish_at` on the `import_receipt` table. All the data in the column will be lost.
  - You are about to drop the column `start_at` on the `import_receipt` table. All the data in the column will be lost.
  - You are about to drop the column `cancel_at` on the `import_request` table. All the data in the column will be lost.
  - You are about to drop the column `cancel_reason` on the `import_request` table. All the data in the column will be lost.
  - You are about to drop the column `finish_at` on the `import_request` table. All the data in the column will be lost.
  - You are about to drop the column `start_at` on the `import_request` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `inventory_report` table. All the data in the column will be lost.
  - You are about to drop the column `inventory_report_type_id` on the `inventory_report` table. All the data in the column will be lost.
  - You are about to drop the column `quantity_disparity` on the `inventory_report` table. All the data in the column will be lost.
  - You are about to drop the column `recorded_quantity` on the `inventory_report` table. All the data in the column will be lost.
  - You are about to drop the column `storage_quantity` on the `inventory_report` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturer_order_id` on the `material_export_request` table. All the data in the column will be lost.
  - You are about to drop the column `quarterly_production_plan_id` on the `purchase_order` table. All the data in the column will be lost.
  - You are about to drop the `annual_production_plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `manufacture_order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quarterly_production_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quarterly_production_plan` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `inventory_report` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `po_delivery` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `inventory_report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `note` to the `inventory_report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouse_manager_id` to the `inventory_report` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouse_staff_id` to the `inventory_report` table without a default value. This is not possible if the table is not empty.
  - Made the column `code` on table `po_delivery` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "export_receipt_status" AS ENUM ('EXPORTED', 'EXPORTING', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "annual_production_plan" DROP CONSTRAINT "annual_production_plan_factory_director_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_report" DROP CONSTRAINT "inventory_report_inventory_report_type_id_fkey";

-- DropForeignKey
ALTER TABLE "manufacture_order" DROP CONSTRAINT "manufacture_order_product_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "material_export_request" DROP CONSTRAINT "material_export_request_manufacturer_order_id_fkey";

-- DropForeignKey
ALTER TABLE "purchase_order" DROP CONSTRAINT "purchase_order_quarterly_production_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "quarterly_production_detail" DROP CONSTRAINT "quarterly_production_detail_product_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "quarterly_production_detail" DROP CONSTRAINT "quarterly_production_detail_quarterly_production_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "quarterly_production_plan" DROP CONSTRAINT "quarterly_production_plan_annual_production_plan_id_fkey";

-- AlterTable
ALTER TABLE "import_receipt" DROP COLUMN "finish_at",
DROP COLUMN "start_at",
ADD COLUMN     "finished_at" TIMESTAMPTZ(6),
ADD COLUMN     "started_at" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "import_request" DROP COLUMN "cancel_at",
DROP COLUMN "cancel_reason",
DROP COLUMN "finish_at",
DROP COLUMN "start_at",
ADD COLUMN     "cancelled_at" TIMESTAMPTZ(6),
ADD COLUMN     "cancelled_reason" VARCHAR,
ADD COLUMN     "finished_at" TIMESTAMPTZ(6),
ADD COLUMN     "started_at" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "inventory_report" DROP COLUMN "description",
DROP COLUMN "inventory_report_type_id",
DROP COLUMN "quantity_disparity",
DROP COLUMN "recorded_quantity",
DROP COLUMN "storage_quantity",
ADD COLUMN     "code" VARCHAR NOT NULL,
ADD COLUMN     "material_variant_id" UUID,
ADD COLUMN     "note" TEXT NOT NULL,
ADD COLUMN     "product_variant_id" UUID,
ADD COLUMN     "warehouse_manager_id" UUID NOT NULL,
ADD COLUMN     "warehouse_staff_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "material_export_receipt" ADD COLUMN     "status" "export_receipt_status" NOT NULL DEFAULT 'EXPORTING',
ADD COLUMN     "warehouse_staff_id" UUID;

-- AlterTable
ALTER TABLE "material_export_request" DROP COLUMN "manufacturer_order_id",
ADD COLUMN     "production_batch_id" UUID,
ADD COLUMN     "warehouse_manager_id" UUID;

-- AlterTable
ALTER TABLE "po_delivery" ADD COLUMN     "cancelled_at" TIMESTAMPTZ(6),
ADD COLUMN     "cancelled_by" UUID,
ADD COLUMN     "cancelled_reason" VARCHAR,
ALTER COLUMN "code" SET NOT NULL;

-- AlterTable
ALTER TABLE "po_delivery_detail" ADD COLUMN     "actual_import_quantity" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "purchase_order" DROP COLUMN "quarterly_production_plan_id",
ADD COLUMN     "cancelled_by" UUID,
ADD COLUMN     "note" VARCHAR,
ADD COLUMN     "production_plan_id" UUID;

-- DropTable
DROP TABLE "annual_production_plan";

-- DropTable
DROP TABLE "manufacture_order";

-- DropTable
DROP TABLE "quarterly_production_detail";

-- DropTable
DROP TABLE "quarterly_production_plan";

-- CreateTable
CREATE TABLE "production_batch" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "production_plan_detail_id" UUID,
    "product_variant_id" UUID NOT NULL,
    "code" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR,
    "quantity" DOUBLE PRECISION NOT NULL,
    "canceled_at" TIMESTAMPTZ(6),
    "canceled_by" UUID,
    "canceled_reason" VARCHAR,
    "status" "ManufactureOrderStatus" NOT NULL DEFAULT 'EXECUTING',
    "start_date" TIME(6),
    "finished_date" TIME(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "expected_finish_date" TIME(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "production_batch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_plan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "factory_director_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "code" VARCHAR NOT NULL,
    "note" VARCHAR,
    "status" "production_status" NOT NULL DEFAULT 'PLANNING',
    "expected_start_date" DATE NOT NULL,
    "expected_end_date" DATE NOT NULL,
    "start_date" DATE,
    "finish_date" DATE,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "production_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_plan_detail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "quarterly_production_plan_id" UUID NOT NULL,
    "product_variant_id" UUID NOT NULL,
    "quantity_to_produce" DOUBLE PRECISION NOT NULL,
    "map" VARCHAR,
    "start_date" DATE NOT NULL,
    "finish_date" DATE,
    "expected_ship_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "production_plan_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipt_adjustment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "warehouse_manager_id" UUID NOT NULL,
    "inventory_report_detail_id" UUID NOT NULL,
    "material_receipt_id" UUID,
    "product_receipt_id" UUID,
    "before_adjust_quantity" DOUBLE PRECISION NOT NULL,
    "after_adjust_quantity" DOUBLE PRECISION NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "receipt_adjustment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "production_batch_code_key" ON "production_batch"("code");

-- CreateIndex
CREATE UNIQUE INDEX "production_plan_code_key" ON "production_plan"("code");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_report_code_key" ON "inventory_report"("code");

-- CreateIndex
CREATE UNIQUE INDEX "po_delivery_code_key" ON "po_delivery"("code");

-- AddForeignKey
ALTER TABLE "inventory_report" ADD CONSTRAINT "inventory_report_material_variant_id_fkey" FOREIGN KEY ("material_variant_id") REFERENCES "material_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_report" ADD CONSTRAINT "inventory_report_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_report" ADD CONSTRAINT "inventory_report_warehouse_manager_id_fkey" FOREIGN KEY ("warehouse_manager_id") REFERENCES "warehouse_manager"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_report" ADD CONSTRAINT "inventory_report_warehouse_staff_id_fkey" FOREIGN KEY ("warehouse_staff_id") REFERENCES "warehouse_staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_export_receipt" ADD CONSTRAINT "material_export_receipt_warehouse_staff_id_fkey" FOREIGN KEY ("warehouse_staff_id") REFERENCES "warehouse_staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_export_request" ADD CONSTRAINT "material_export_request_production_batch_id_fkey" FOREIGN KEY ("production_batch_id") REFERENCES "production_batch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_export_request" ADD CONSTRAINT "material_export_request_warehouse_manager_id_fkey" FOREIGN KEY ("warehouse_manager_id") REFERENCES "warehouse_manager"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_batch" ADD CONSTRAINT "production_batch_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_batch" ADD CONSTRAINT "production_batch_production_plan_detail_id_fkey" FOREIGN KEY ("production_plan_detail_id") REFERENCES "production_plan_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_plan" ADD CONSTRAINT "production_plan_factory_director_id_fkey" FOREIGN KEY ("factory_director_id") REFERENCES "factory_director"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_order" ADD CONSTRAINT "purchase_order_production_plan_id_fkey" FOREIGN KEY ("production_plan_id") REFERENCES "production_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_plan_detail" ADD CONSTRAINT "production_plan_detail_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_plan_detail" ADD CONSTRAINT "production_plan_detail_quarterly_production_plan_id_fkey" FOREIGN KEY ("quarterly_production_plan_id") REFERENCES "production_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "receipt_adjustment" ADD CONSTRAINT "receipt_adjustment_warehouse_manager_id_fkey" FOREIGN KEY ("warehouse_manager_id") REFERENCES "warehouse_manager"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "receipt_adjustment" ADD CONSTRAINT "receipt_adjustment_inventory_report_detail_id_fkey" FOREIGN KEY ("inventory_report_detail_id") REFERENCES "inventory_report_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "receipt_adjustment" ADD CONSTRAINT "receipt_adjustment_material_receipt_id_fkey" FOREIGN KEY ("material_receipt_id") REFERENCES "material_receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "receipt_adjustment" ADD CONSTRAINT "receipt_adjustment_product_receipt_id_fkey" FOREIGN KEY ("product_receipt_id") REFERENCES "product_receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
