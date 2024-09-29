/*
  Warnings:

  - The values [IN_PROGESS] on the enum `production_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `created_at` on the `export_material_request` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `export_material_request` table. All the data in the column will be lost.
  - You are about to drop the column `deliver_date` on the `export_material_request` table. All the data in the column will be lost.
  - You are about to drop the column `expected_deliver_date` on the `export_material_request` table. All the data in the column will be lost.
  - You are about to drop the column `production_department_id` on the `export_material_request` table. All the data in the column will be lost.
  - You are about to drop the column `reserve_percent_id` on the `export_material_request` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `export_material_request` table. All the data in the column will be lost.
  - You are about to drop the `supplier` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `created_at` on table `quarterly_production_plan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `quarterly_production_plan` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "production_status_new" AS ENUM ('NOT_STARTED', 'PENDING', 'IN_PROGRESS', 'FINISHED');
ALTER TABLE "annual_production_plan" ALTER COLUMN "status" TYPE "production_status_new" USING ("status"::text::"production_status_new");
ALTER TABLE "quarterly_production_plan" ALTER COLUMN "status" TYPE "production_status_new" USING ("status"::text::"production_status_new");
ALTER TYPE "production_status" RENAME TO "production_status_old";
ALTER TYPE "production_status_new" RENAME TO "production_status";
DROP TYPE "production_status_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "export_material_request" DROP CONSTRAINT "export_material_request_production_department_id_fkey";

-- DropForeignKey
ALTER TABLE "export_material_request" DROP CONSTRAINT "export_material_request_reserve_percent_id_fkey";

-- DropForeignKey
ALTER TABLE "material_supplier" DROP CONSTRAINT "material_supplier_supplier_id_fkey";

-- AlterTable
ALTER TABLE "annual_production_detail" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "annual_production_plan" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "delivery_note" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "delivery_note_detail" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "export_material_request" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "deliver_date",
DROP COLUMN "expected_deliver_date",
DROP COLUMN "production_department_id",
DROP COLUMN "reserve_percent_id",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMPTZ(6),
ADD COLUMN     "deletedAt" TIMESTAMPTZ(6),
ADD COLUMN     "deliverDate" DATE,
ADD COLUMN     "expectedDeliverDate" DATE,
ADD COLUMN     "productionDepartmentId" UUID,
ADD COLUMN     "reservePercentId" UUID,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6),
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "export_material_request_detail" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "factory_director" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "import_receipt" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "import_request" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "import_request_detail" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "inspection_department" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "inspection_report" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "inspection_report_detail" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "inspection_request" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "material" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "material_attribute" ADD COLUMN     "deleted_at" TIMESTAMPTZ(6),
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "material_export" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "material_inspection_criteria" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "material_receipt" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "material_supplier" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "material_type" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "po_receipt" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "po_receipt_detail" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "product_attribute" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "product_formula" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "product_inspection_criteria" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "product_receipt" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "product_type" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "production_department" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "production_patch_order" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "purchase_order" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "purchasing_staff" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "quantity_report" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "quantity_report_detail" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "quantity_report_plan" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "quantity_report_type" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "quarterly_production_detail" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "quarterly_production_plan" ALTER COLUMN "id" SET DEFAULT gen_random_uuid(),
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "reserve_percent" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "store_unit" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "unit" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "warehouse_manager" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "warehouse_staff" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- DropTable
DROP TABLE "supplier";

-- CreateTable
CREATE TABLE "Supplier" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "supplier_name" VARCHAR,
    "supplier_code" VARCHAR,
    "address" VARCHAR,
    "representative_name" VARCHAR,
    "email" VARCHAR,
    "phone_number" VARCHAR,
    "fax" VARCHAR,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_supplier_code_key" ON "Supplier"("supplier_code");

-- AddForeignKey
ALTER TABLE "export_material_request" ADD CONSTRAINT "export_material_request_productionDepartmentId_fkey" FOREIGN KEY ("productionDepartmentId") REFERENCES "production_department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "export_material_request" ADD CONSTRAINT "export_material_request_reservePercentId_fkey" FOREIGN KEY ("reservePercentId") REFERENCES "reserve_percent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_supplier" ADD CONSTRAINT "material_supplier_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
