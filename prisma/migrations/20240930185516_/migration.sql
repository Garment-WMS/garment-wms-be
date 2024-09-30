/*
  Warnings:

  - The values [NOT_STARTED,PENDING] on the enum `production_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING] on the enum `purchase_order_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `createdAt` on the `export_material_request` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `export_material_request` table. All the data in the column will be lost.
  - You are about to drop the column `deliverDate` on the `export_material_request` table. All the data in the column will be lost.
  - You are about to drop the column `expectedDeliverDate` on the `export_material_request` table. All the data in the column will be lost.
  - You are about to drop the column `productionDepartmentId` on the `export_material_request` table. All the data in the column will be lost.
  - You are about to drop the column `reservePercentId` on the `export_material_request` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `export_material_request` table. All the data in the column will be lost.
  - You are about to drop the column `unit_id` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `material_export` table. All the data in the column will be lost.
  - You are about to drop the column `min_quantity` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `unit_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `shipping_address` on the `purchase_order` table. All the data in the column will be lost.
  - You are about to drop the `unit` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `annual_production_plan_id` on table `annual_production_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `annual_production_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `demand_quantity` on table `annual_production_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity_to_produce` on table `annual_production_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `annual_production_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `factory_director_id` on table `annual_production_plan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `year` on table `annual_production_plan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `annual_production_plan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expected_start_date` on table `annual_production_plan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expected_end_date` on table `annual_production_plan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `annual_production_plan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `black_list_tokens` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `production_department_id` to the `export_material_request` table without a default value. This is not possible if the table is not empty.
  - Made the column `status` on table `export_material_request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `material_id` on table `export_material_request_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity` on table `export_material_request_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `export_material_request_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `factory_director` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `factory_director` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `import_request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `import_request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `po_receipt_id` on table `import_request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `import_request_id` on table `import_request_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `import_request_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `inspection_department` required. This step will fail if there are existing NULL values in that column.
  - Made the column `inspection_department_id` on table `inspection_report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `inspection_report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `inspected_quantity` on table `inspection_report_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `defect_quantity` on table `inspection_report_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `approved_quantity` on table `inspection_report_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `inspection_report_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `purchasing_staff_id` on table `inspection_request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `inspection_department_id` on table `inspection_request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `delivery_note_id` on table `inspection_request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `inspection_request` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `inspection_request` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `uom_id` to the `material` table without a default value. This is not possible if the table is not empty.
  - Made the column `material_type_id` on table `material` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `material` required. This step will fail if there are existing NULL values in that column.
  - Made the column `width` on table `material` required. This step will fail if there are existing NULL values in that column.
  - Made the column `height` on table `material` required. This step will fail if there are existing NULL values in that column.
  - Made the column `length` on table `material` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `material` required. This step will fail if there are existing NULL values in that column.
  - Made the column `material_id` on table `material_attribute` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `material_attribute` required. This step will fail if there are existing NULL values in that column.
  - Made the column `value` on table `material_attribute` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `material_attribute` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `quantity_per_uom` to the `material_export` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `material_export` required. This step will fail if there are existing NULL values in that column.
  - Made the column `material_id` on table `material_inspection_criteria` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `material_inspection_criteria` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `material_inspection_criteria` required. This step will fail if there are existing NULL values in that column.
  - Made the column `criteria` on table `material_inspection_criteria` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `material_inspection_criteria` required. This step will fail if there are existing NULL values in that column.
  - Made the column `material_id` on table `material_receipt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `import_receipt_id` on table `material_receipt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `material_receipt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `material_type` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `material_type` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `otps` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `po_delivery` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `uom_id` to the `product` table without a default value. This is not possible if the table is not empty.
  - Made the column `product_type` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `width` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `height` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `length` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `product_attribute` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `product_attribute` required. This step will fail if there are existing NULL values in that column.
  - Made the column `value` on table `product_attribute` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `product_attribute` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `product_formula` required. This step will fail if there are existing NULL values in that column.
  - Made the column `material_id` on table `product_formula` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity` on table `product_formula` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `product_formula` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `product_inspection_criteria` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `product_inspection_criteria` required. This step will fail if there are existing NULL values in that column.
  - Made the column `criteria` on table `product_inspection_criteria` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `product_inspection_criteria` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `product_receipt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `import_receipt_id` on table `product_receipt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity` on table `product_receipt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `product_receipt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `product_type` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `product_type` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `production_department` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `production_department` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity_to_produce` on table `production_patch_order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expected_start_date` on table `production_patch_order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expected_finish_date` on table `production_patch_order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `production_patch_order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `production_patch_order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `PO_number` on table `purchase_order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `currency` on table `purchase_order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_ammount` on table `purchase_order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tax_amount` on table `purchase_order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `order_date` on table `purchase_order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expected_finish_date` on table `purchase_order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `finish_date` on table `purchase_order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `purchase_order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `purchase_order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `supplier_id` on table `purchase_order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `purchasing_staff` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `purchasing_staff` required. This step will fail if there are existing NULL values in that column.
  - Made the column `storage_quantity` on table `quantity_report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `recorded_quantity` on table `quantity_report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity_disparity` on table `quantity_report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `quantity_report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `quantity_report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `quantity_report_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity_report_id` on table `quantity_report_plan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `quantity_report_plan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `quantity_report_type` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quarterly_production_plan_id` on table `quarterly_production_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `quarterly_production_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `demand_quantity` on table `quarterly_production_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `starting_quantity` on table `quarterly_production_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity_to_produce` on table `quarterly_production_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reserve_percent_id` on table `quarterly_production_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `notation` on table `quarterly_production_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start_date` on table `quarterly_production_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `expected_ship_date` on table `quarterly_production_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `quarterly_production_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `quarterly_production_plan` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `refresh_tokens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `percent` on table `reserve_percent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `reserve_percent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `supplier_name` on table `supplier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `supplier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `representative_name` on table `supplier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `supplier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone_number` on table `supplier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `supplier` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `warehouse_manager` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `warehouse_manager` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `warehouse_staff` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `warehouse_staff` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "production_status_new" AS ENUM ('PLANNING', 'IN_PROGRESS', 'FINISHED');
ALTER TABLE "annual_production_plan" ALTER COLUMN "status" TYPE "production_status_new" USING ("status"::text::"production_status_new");
ALTER TABLE "quarterly_production_plan" ALTER COLUMN "status" TYPE "production_status_new" USING ("status"::text::"production_status_new");
ALTER TYPE "production_status" RENAME TO "production_status_old";
ALTER TYPE "production_status_new" RENAME TO "production_status";
DROP TYPE "production_status_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "purchase_order_status_new" AS ENUM ('IN_PROGESS', 'CANCELLED', 'FINISHED');
ALTER TABLE "purchase_order" ALTER COLUMN "status" TYPE "purchase_order_status_new" USING ("status"::text::"purchase_order_status_new");
ALTER TYPE "purchase_order_status" RENAME TO "purchase_order_status_old";
ALTER TYPE "purchase_order_status_new" RENAME TO "purchase_order_status";
DROP TYPE "purchase_order_status_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "export_material_request" DROP CONSTRAINT "export_material_request_productionDepartmentId_fkey";

-- DropForeignKey
ALTER TABLE "export_material_request" DROP CONSTRAINT "export_material_request_reservePercentId_fkey";

-- DropForeignKey
ALTER TABLE "material" DROP CONSTRAINT "material_unit_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_unit_id_fkey";

-- AlterTable
ALTER TABLE "annual_production_detail" ALTER COLUMN "annual_production_plan_id" SET NOT NULL,
ALTER COLUMN "product_id" SET NOT NULL,
ALTER COLUMN "demand_quantity" SET NOT NULL,
ALTER COLUMN "starting_quantity" SET DEFAULT 0,
ALTER COLUMN "quantity_to_produce" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "annual_production_plan" ALTER COLUMN "factory_director_id" SET NOT NULL,
ALTER COLUMN "year" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PLANNING',
ALTER COLUMN "expected_start_date" SET NOT NULL,
ALTER COLUMN "expected_end_date" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "black_list_tokens" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "export_material_request" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "deliverDate",
DROP COLUMN "expectedDeliverDate",
DROP COLUMN "productionDepartmentId",
DROP COLUMN "reservePercentId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ(6),
ADD COLUMN     "deliver_date" DATE,
ADD COLUMN     "expected_deliver_date" DATE,
ADD COLUMN     "production_department_id" UUID NOT NULL,
ADD COLUMN     "reserve_percent_id" UUID,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6),
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "export_material_request_detail" ALTER COLUMN "material_id" SET NOT NULL,
ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "factory_director" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "import_request" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "po_receipt_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "import_request_detail" ALTER COLUMN "import_request_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "inspection_department" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "inspection_report" ALTER COLUMN "inspection_department_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "inspection_report_detail" ALTER COLUMN "inspected_quantity" SET NOT NULL,
ALTER COLUMN "defect_quantity" SET NOT NULL,
ALTER COLUMN "approved_quantity" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "inspection_request" ALTER COLUMN "purchasing_staff_id" SET NOT NULL,
ALTER COLUMN "inspection_department_id" SET NOT NULL,
ALTER COLUMN "delivery_note_id" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "material" DROP COLUMN "unit_id",
ADD COLUMN     "uom_id" UUID NOT NULL,
ALTER COLUMN "material_type_id" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "width" SET NOT NULL,
ALTER COLUMN "height" SET NOT NULL,
ALTER COLUMN "length" SET NOT NULL,
ALTER COLUMN "min_quantity" SET DEFAULT 0,
ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "material_attribute" ALTER COLUMN "material_id" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "value" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "material_export" DROP COLUMN "quantity",
ADD COLUMN     "quantity_per_uom" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "material_inspection_criteria" ALTER COLUMN "material_id" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "code" SET NOT NULL,
ALTER COLUMN "criteria" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "material_receipt" ADD COLUMN     "import_date" TIMESTAMPTZ(6),
ALTER COLUMN "material_id" SET NOT NULL,
ALTER COLUMN "import_receipt_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "material_type" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "otps" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "po_delivery" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "product" DROP COLUMN "min_quantity",
DROP COLUMN "unit_id",
ADD COLUMN     "uom_id" UUID NOT NULL,
ALTER COLUMN "product_type" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "width" SET NOT NULL,
ALTER COLUMN "height" SET NOT NULL,
ALTER COLUMN "length" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "product_attribute" ALTER COLUMN "product_id" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "value" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "product_formula" ALTER COLUMN "product_id" SET NOT NULL,
ALTER COLUMN "material_id" SET NOT NULL,
ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "product_inspection_criteria" ALTER COLUMN "product_id" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "criteria" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "product_receipt" ADD COLUMN     "import_date" TIMESTAMPTZ(6),
ALTER COLUMN "product_id" SET NOT NULL,
ALTER COLUMN "import_receipt_id" SET NOT NULL,
ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "product_type" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "production_department" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "production_patch_order" ALTER COLUMN "quantity_to_produce" SET NOT NULL,
ALTER COLUMN "expected_start_date" SET NOT NULL,
ALTER COLUMN "expected_finish_date" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS',
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "purchase_order" DROP COLUMN "shipping_address",
ALTER COLUMN "PO_number" SET NOT NULL,
ALTER COLUMN "currency" SET NOT NULL,
ALTER COLUMN "total_ammount" SET NOT NULL,
ALTER COLUMN "tax_amount" SET NOT NULL,
ALTER COLUMN "order_date" SET NOT NULL,
ALTER COLUMN "expected_finish_date" SET NOT NULL,
ALTER COLUMN "finish_date" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'IN_PROGESS',
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "supplier_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "purchasing_staff" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "quantity_report" ALTER COLUMN "storage_quantity" SET NOT NULL,
ALTER COLUMN "recorded_quantity" SET NOT NULL,
ALTER COLUMN "quantity_disparity" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "quantity_report_detail" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "quantity_report_plan" ALTER COLUMN "quantity_report_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "quantity_report_type" ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "quarterly_production_detail" ALTER COLUMN "quarterly_production_plan_id" SET NOT NULL,
ALTER COLUMN "product_id" SET NOT NULL,
ALTER COLUMN "demand_quantity" SET NOT NULL,
ALTER COLUMN "starting_quantity" SET NOT NULL,
ALTER COLUMN "quantity_to_produce" SET NOT NULL,
ALTER COLUMN "reserve_percent_id" SET NOT NULL,
ALTER COLUMN "notation" SET NOT NULL,
ALTER COLUMN "start_date" SET NOT NULL,
ALTER COLUMN "expected_ship_date" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "quarterly_production_plan" ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PLANNING';

-- AlterTable
ALTER TABLE "refresh_tokens" ALTER COLUMN "created_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "reserve_percent" ALTER COLUMN "percent" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "supplier" ALTER COLUMN "supplier_name" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "representative_name" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone_number" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "warehouse_manager" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "warehouse_staff" ALTER COLUMN "user_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6);

-- DropTable
DROP TABLE "unit";

-- CreateTable
CREATE TABLE "material_unit" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_id" UUID NOT NULL,
    "uom_per_packaging_unit" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "material_unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packaging_unit" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "packaging_unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uom" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "uom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MaterialToPackagingUnit" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_PackagingUnitToProduct" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MaterialToPackagingUnit_AB_unique" ON "_MaterialToPackagingUnit"("A", "B");

-- CreateIndex
CREATE INDEX "_MaterialToPackagingUnit_B_index" ON "_MaterialToPackagingUnit"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PackagingUnitToProduct_AB_unique" ON "_PackagingUnitToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_PackagingUnitToProduct_B_index" ON "_PackagingUnitToProduct"("B");

-- AddForeignKey
ALTER TABLE "export_material_request" ADD CONSTRAINT "export_material_request_production_department_id_fkey" FOREIGN KEY ("production_department_id") REFERENCES "production_department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "export_material_request" ADD CONSTRAINT "export_material_request_reserve_percent_id_fkey" FOREIGN KEY ("reserve_percent_id") REFERENCES "reserve_percent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_unit" ADD CONSTRAINT "material_unit_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_uom_id_fkey" FOREIGN KEY ("uom_id") REFERENCES "uom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_uom_id_fkey" FOREIGN KEY ("uom_id") REFERENCES "uom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_MaterialToPackagingUnit" ADD CONSTRAINT "_MaterialToPackagingUnit_A_fkey" FOREIGN KEY ("A") REFERENCES "material"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialToPackagingUnit" ADD CONSTRAINT "_MaterialToPackagingUnit_B_fkey" FOREIGN KEY ("B") REFERENCES "packaging_unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackagingUnitToProduct" ADD CONSTRAINT "_PackagingUnitToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "packaging_unit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackagingUnitToProduct" ADD CONSTRAINT "_PackagingUnitToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
