/*
  Warnings:

  - You are about to drop the column `user_id` on the `factory_director` table. All the data in the column will be lost.
  - You are about to drop the column `material_variant_id` on the `import_request_detail` table. All the data in the column will be lost.
  - You are about to drop the column `product_variant_id` on the `import_request_detail` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `inspection_department` table. All the data in the column will be lost.
  - You are about to drop the column `inspection_department_id` on the `inspection_report` table. All the data in the column will be lost.
  - You are about to drop the column `material_variant_id` on the `inspection_report_detail` table. All the data in the column will be lost.
  - You are about to drop the column `product_variant_id` on the `inspection_report_detail` table. All the data in the column will be lost.
  - You are about to drop the column `inventory_report_plan_id` on the `inventory_report` table. All the data in the column will be lost.
  - You are about to drop the column `material_variant_id` on the `inventory_report` table. All the data in the column will be lost.
  - You are about to drop the column `product_variant_id` on the `inventory_report` table. All the data in the column will be lost.
  - You are about to drop the column `material_variant_id` on the `inventory_stock` table. All the data in the column will be lost.
  - You are about to drop the column `product_variant_id` on the `inventory_stock` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `material_type_id` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `reorder_level` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `material_id` on the `material_attribute` table. All the data in the column will be lost.
  - You are about to drop the column `material_variant_id` on the `material_export_detail` table. All the data in the column will be lost.
  - You are about to drop the column `material_id` on the `material_inspection_criteria` table. All the data in the column will be lost.
  - You are about to drop the column `material_variant_id` on the `material_receipt` table. All the data in the column will be lost.
  - You are about to drop the column `pack_unit` on the `material_variant` table. All the data in the column will be lost.
  - You are about to drop the column `packed_height` on the `material_variant` table. All the data in the column will be lost.
  - You are about to drop the column `packed_length` on the `material_variant` table. All the data in the column will be lost.
  - You are about to drop the column `packed_weight` on the `material_variant` table. All the data in the column will be lost.
  - You are about to drop the column `packed_width` on the `material_variant` table. All the data in the column will be lost.
  - You are about to drop the column `uom_per_pack_unit` on the `material_variant` table. All the data in the column will be lost.
  - You are about to drop the column `material_variant_id` on the `po_delivery_detail` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `product_type` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `product_attribute` table. All the data in the column will be lost.
  - You are about to drop the column `product_variant_id` on the `product_formula` table. All the data in the column will be lost.
  - You are about to drop the column `material_id` on the `product_formula_material` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `product_inspection_criteria` table. All the data in the column will be lost.
  - You are about to drop the column `product_variant_id` on the `product_receipt` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `product_variant_id` on the `production_batch` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `production_batch` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `production_department` table. All the data in the column will be lost.
  - You are about to drop the column `expected_ship_date` on the `production_plan_detail` table. All the data in the column will be lost.
  - You are about to drop the column `product_variant_id` on the `production_plan_detail` table. All the data in the column will be lost.
  - You are about to drop the column `quarterly_production_plan_id` on the `production_plan_detail` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `purchasing_staff` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `warehouse_manager` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `warehouse_staff` table. All the data in the column will be lost.
  - You are about to drop the `export_material_request` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `export_material_request_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory_report_plan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inventory_report_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `material_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[account_id]` on the table `factory_director` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `import_request` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[account_id]` on the table `inspection_department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_size_id]` on the table `inventory_stock` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[material_package_id]` on the table `inventory_stock` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[material_variant_id,name]` on the table `material_attribute` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sku]` on the table `material_receipt` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_formula_id,material_variant_id]` on the table `product_formula_material` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[account_id]` on the table `production_department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[account_id]` on the table `purchasing_staff` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[account_id]` on the table `warehouse_manager` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[account_id]` on the table `warehouse_staff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `account_id` to the `factory_director` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `import_request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material_variant_id` to the `material_attribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material_package_id` to the `material_export_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `production_department_id` to the `material_export_request` table without a default value. This is not possible if the table is not empty.
  - Made the column `production_batch_id` on table `material_export_request` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `material_variant_id` to the `material_inspection_criteria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material_package_id` to the `material_receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remain_quantity_by_pack` to the `material_receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `material_receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material_package_id` to the `po_delivery_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_variant_id` to the `product_attribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_size_id` to the `product_formula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material_variant_id` to the `product_formula_material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_variant_id` to the `product_inspection_criteria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_size_id` to the `product_receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_type` to the `product_variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity_to_produce` to the `production_batch` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `production_department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expected_finish_date` to the `production_plan_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_size_id` to the `production_plan_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `production_plan_id` to the `production_plan_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `purchasing_staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `warehouse_manager` table without a default value. This is not possible if the table is not empty.
  - Added the required column `account_id` to the `warehouse_staff` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "inventory_report_type_enum" AS ENUM ('MATERIAL', 'PRODUCT');

-- CreateEnum
CREATE TYPE "inventory_report_status" AS ENUM ('PENDING', 'EXECUTING', 'FINISHED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "export_material_request" DROP CONSTRAINT "export_material_request_production_department_id_fkey";

-- DropForeignKey
ALTER TABLE "export_material_request_detail" DROP CONSTRAINT "export_material_request_detail_material_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "factory_director" DROP CONSTRAINT "factory_director_user_id_fkey";

-- DropForeignKey
ALTER TABLE "import_request_detail" DROP CONSTRAINT "import_request_detail_material_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "import_request_detail" DROP CONSTRAINT "import_request_detail_product_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "inspection_department" DROP CONSTRAINT "inspection_department_user_id_fkey";

-- DropForeignKey
ALTER TABLE "inspection_report" DROP CONSTRAINT "inspection_report_inspection_department_id_fkey";

-- DropForeignKey
ALTER TABLE "inspection_report_detail" DROP CONSTRAINT "inspection_report_detail_material_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "inspection_report_detail" DROP CONSTRAINT "inspection_report_detail_product_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_report" DROP CONSTRAINT "inventory_report_inventory_report_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_report" DROP CONSTRAINT "inventory_report_material_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_report" DROP CONSTRAINT "inventory_report_product_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_stock" DROP CONSTRAINT "inventory_stock_material_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_stock" DROP CONSTRAINT "inventory_stock_product_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "material" DROP CONSTRAINT "material_material_type_id_fkey";

-- DropForeignKey
ALTER TABLE "material" DROP CONSTRAINT "material_material_uom_id_fkey";

-- DropForeignKey
ALTER TABLE "material_attribute" DROP CONSTRAINT "material_attribute_material_id_fkey";

-- DropForeignKey
ALTER TABLE "material_export_detail" DROP CONSTRAINT "material_export_detail_material_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "material_inspection_criteria" DROP CONSTRAINT "material_inspection_criteria_material_id_fkey";

-- DropForeignKey
ALTER TABLE "material_receipt" DROP CONSTRAINT "material_receipt_material_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "po_delivery_detail" DROP CONSTRAINT "po_delivery_detail_material_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_product_type_fkey";

-- DropForeignKey
ALTER TABLE "product_attribute" DROP CONSTRAINT "product_attribute_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product_formula" DROP CONSTRAINT "product_formula_product_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "product_formula_material" DROP CONSTRAINT "product_formula_material_material_id_fkey";

-- DropForeignKey
ALTER TABLE "product_inspection_criteria" DROP CONSTRAINT "product_inspection_criteria_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product_receipt" DROP CONSTRAINT "product_receipt_product_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "product_variant" DROP CONSTRAINT "product_variant_product_id_fkey";

-- DropForeignKey
ALTER TABLE "production_batch" DROP CONSTRAINT "production_batch_product_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "production_department" DROP CONSTRAINT "production_department_user_id_fkey";

-- DropForeignKey
ALTER TABLE "production_plan_detail" DROP CONSTRAINT "production_plan_detail_product_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "production_plan_detail" DROP CONSTRAINT "production_plan_detail_quarterly_production_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "purchasing_staff" DROP CONSTRAINT "purchasing_staff_user_id_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_manager" DROP CONSTRAINT "warehouse_manager_user_id_fkey";

-- DropForeignKey
ALTER TABLE "warehouse_staff" DROP CONSTRAINT "warehouse_staff_user_id_fkey";

-- DropIndex
DROP INDEX "factory_director_user_id_key";

-- DropIndex
DROP INDEX "inspection_department_user_id_key";

-- DropIndex
DROP INDEX "inventory_report_inventory_report_plan_id_key";

-- DropIndex
DROP INDEX "inventory_stock_material_variant_id_key";

-- DropIndex
DROP INDEX "inventory_stock_product_variant_id_key";

-- DropIndex
DROP INDEX "material_attribute_material_id_name_key";

-- DropIndex
DROP INDEX "product_formula_material_product_formula_id_material_id_key";

-- DropIndex
DROP INDEX "production_department_user_id_key";

-- DropIndex
DROP INDEX "purchasing_staff_user_id_key";

-- DropIndex
DROP INDEX "warehouse_manager_user_id_key";

-- DropIndex
DROP INDEX "warehouse_staff_user_id_key";

-- AlterTable
ALTER TABLE "factory_director" DROP COLUMN "user_id",
ADD COLUMN     "account_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "import_request" ADD COLUMN     "code" VARCHAR NOT NULL,
ADD COLUMN     "production_batch_id" UUID,
ADD COLUMN     "production_department_id" UUID;

-- AlterTable
ALTER TABLE "import_request_detail" DROP COLUMN "material_variant_id",
DROP COLUMN "product_variant_id",
ADD COLUMN     "material_package_id" UUID,
ADD COLUMN     "product_size_id" UUID;

-- AlterTable
ALTER TABLE "inspection_department" DROP COLUMN "user_id",
ADD COLUMN     "account_id" UUID;

-- AlterTable
ALTER TABLE "inspection_report" DROP COLUMN "inspection_department_id";

-- AlterTable
ALTER TABLE "inspection_report_detail" DROP COLUMN "material_variant_id",
DROP COLUMN "product_variant_id",
ADD COLUMN     "material_package_id" UUID,
ADD COLUMN     "product_size_id" UUID;

-- AlterTable
ALTER TABLE "inspection_request" ADD COLUMN     "production_deparment_id" UUID,
ALTER COLUMN "purchasing_staff_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "inventory_report" DROP COLUMN "inventory_report_plan_id",
DROP COLUMN "material_variant_id",
DROP COLUMN "product_variant_id",
ADD COLUMN     "inventory_report_type" "inventory_report_type_enum" NOT NULL DEFAULT 'MATERIAL',
ADD COLUMN     "material_package_id" UUID,
ADD COLUMN     "product_size_id" UUID,
ADD COLUMN     "status" "inventory_report_status" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "inventory_stock" DROP COLUMN "material_variant_id",
DROP COLUMN "product_variant_id",
ADD COLUMN     "material_package_id" UUID,
ADD COLUMN     "product_size_id" UUID;

-- AlterTable
ALTER TABLE "material" DROP COLUMN "image",
DROP COLUMN "material_type_id",
DROP COLUMN "reorder_level",
ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "material_attribute" DROP COLUMN "material_id",
ADD COLUMN     "material_variant_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "material_export_detail" DROP COLUMN "material_variant_id",
ADD COLUMN     "material_package_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "material_export_request" ADD COLUMN     "production_department_id" UUID NOT NULL,
ALTER COLUMN "production_batch_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "material_inspection_criteria" DROP COLUMN "material_id",
ADD COLUMN     "material_variant_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "material_receipt" DROP COLUMN "material_variant_id",
ADD COLUMN     "material_package_id" UUID NOT NULL,
ADD COLUMN     "remain_quantity_by_pack" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "sku" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "material_variant" DROP COLUMN "pack_unit",
DROP COLUMN "packed_height",
DROP COLUMN "packed_length",
DROP COLUMN "packed_weight",
DROP COLUMN "packed_width",
DROP COLUMN "uom_per_pack_unit",
ADD COLUMN     "image" VARCHAR,
ADD COLUMN     "reorder_level" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "po_delivery_detail" DROP COLUMN "material_variant_id",
ADD COLUMN     "material_package_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "image",
DROP COLUMN "product_type",
ALTER COLUMN "product_uom_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_attribute" DROP COLUMN "product_id",
ADD COLUMN     "product_variant_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "product_formula" DROP COLUMN "product_variant_id",
ADD COLUMN     "product_size_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "product_formula_material" DROP COLUMN "material_id",
ADD COLUMN     "materialId" UUID,
ADD COLUMN     "material_variant_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "product_inspection_criteria" DROP COLUMN "product_id",
ADD COLUMN     "product_variant_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "product_receipt" DROP COLUMN "product_variant_id",
ADD COLUMN     "product_size_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "product_variant" DROP COLUMN "height",
DROP COLUMN "length",
DROP COLUMN "product_id",
DROP COLUMN "size",
DROP COLUMN "weight",
DROP COLUMN "width",
ADD COLUMN     "image" VARCHAR,
ADD COLUMN     "product_type" UUID NOT NULL;

-- AlterTable
ALTER TABLE "production_batch" DROP COLUMN "product_variant_id",
DROP COLUMN "quantity",
ADD COLUMN     "quantity_to_produce" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "production_department" DROP COLUMN "user_id",
ADD COLUMN     "account_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "production_plan_detail" DROP COLUMN "expected_ship_date",
DROP COLUMN "product_variant_id",
DROP COLUMN "quarterly_production_plan_id",
ADD COLUMN     "expected_finish_date" DATE NOT NULL,
ADD COLUMN     "product_size_id" UUID NOT NULL,
ADD COLUMN     "production_plan_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "purchasing_staff" DROP COLUMN "user_id",
ADD COLUMN     "account_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "refresh_tokens" DROP COLUMN "user_id",
ADD COLUMN     "account_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "warehouse_manager" DROP COLUMN "user_id",
ADD COLUMN     "account_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "warehouse_staff" DROP COLUMN "user_id",
ADD COLUMN     "account_id" UUID NOT NULL;

-- DropTable
DROP TABLE "export_material_request";

-- DropTable
DROP TABLE "export_material_request_detail";

-- DropTable
DROP TABLE "inventory_report_plan";

-- DropTable
DROP TABLE "inventory_report_type";

-- DropTable
DROP TABLE "material_type";

-- DropTable
DROP TABLE "product_type";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "InventoryReportStatus";

-- DropEnum
DROP TYPE "export_material_request_status";

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatar_url" TEXT,
    "cid_id" UUID,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "first_name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "is_deleted" BOOLEAN DEFAULT false,
    "is_verified" BOOLEAN DEFAULT false,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "status" TEXT DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_package" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_variant_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "code" VARCHAR NOT NULL,
    "pack_unit" VARCHAR NOT NULL,
    "uom_per_pack_unit" DOUBLE PRECISION NOT NULL,
    "packed_width" DOUBLE PRECISION NOT NULL,
    "packed_length" DOUBLE PRECISION NOT NULL,
    "packed_height" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "packed_weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "material_package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_size" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_variant_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "code" VARCHAR NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "size" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "product_size_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_phone_number_key" ON "accounts"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "material_package_code_key" ON "material_package"("code");

-- CreateIndex
CREATE UNIQUE INDEX "product_size_code_key" ON "product_size"("code");

-- CreateIndex
CREATE UNIQUE INDEX "factory_director_account_id_key" ON "factory_director"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "import_request_code_key" ON "import_request"("code");

-- CreateIndex
CREATE UNIQUE INDEX "inspection_department_account_id_key" ON "inspection_department"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_stock_product_size_id_key" ON "inventory_stock"("product_size_id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_stock_material_package_id_key" ON "inventory_stock"("material_package_id");

-- CreateIndex
CREATE UNIQUE INDEX "material_attribute_material_variant_id_name_key" ON "material_attribute"("material_variant_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "material_receipt_sku_key" ON "material_receipt"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "product_formula_material_product_formula_id_material_varian_key" ON "product_formula_material"("product_formula_id", "material_variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "production_department_account_id_key" ON "production_department"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchasing_staff_account_id_key" ON "purchasing_staff"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_manager_account_id_key" ON "warehouse_manager"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_staff_account_id_key" ON "warehouse_staff"("account_id");

-- AddForeignKey
ALTER TABLE "factory_director" ADD CONSTRAINT "factory_director_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request_detail" ADD CONSTRAINT "import_request_detail_material_package_id_fkey" FOREIGN KEY ("material_package_id") REFERENCES "material_package"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request_detail" ADD CONSTRAINT "import_request_detail_product_size_id_fkey" FOREIGN KEY ("product_size_id") REFERENCES "product_size"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request" ADD CONSTRAINT "import_request_production_batch_id_fkey" FOREIGN KEY ("production_batch_id") REFERENCES "production_batch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request" ADD CONSTRAINT "import_request_production_department_id_fkey" FOREIGN KEY ("production_department_id") REFERENCES "production_department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_department" ADD CONSTRAINT "inspection_department_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_report_detail" ADD CONSTRAINT "inspection_report_detail_material_package_id_fkey" FOREIGN KEY ("material_package_id") REFERENCES "material_package"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_report_detail" ADD CONSTRAINT "inspection_report_detail_product_size_id_fkey" FOREIGN KEY ("product_size_id") REFERENCES "product_size"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_request" ADD CONSTRAINT "inspection_request_production_deparment_id_fkey" FOREIGN KEY ("production_deparment_id") REFERENCES "production_department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_report" ADD CONSTRAINT "inventory_report_material_package_id_fkey" FOREIGN KEY ("material_package_id") REFERENCES "material_package"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_report" ADD CONSTRAINT "inventory_report_product_size_id_fkey" FOREIGN KEY ("product_size_id") REFERENCES "product_size"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_stock" ADD CONSTRAINT "inventory_stock_material_package_id_fkey" FOREIGN KEY ("material_package_id") REFERENCES "material_package"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_stock" ADD CONSTRAINT "inventory_stock_product_size_id_fkey" FOREIGN KEY ("product_size_id") REFERENCES "product_size"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_attribute" ADD CONSTRAINT "material_attribute_material_variant_id_fkey" FOREIGN KEY ("material_variant_id") REFERENCES "material_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_export_detail" ADD CONSTRAINT "material_export_detail_material_package_id_fkey" FOREIGN KEY ("material_package_id") REFERENCES "material_package"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_export_request" ADD CONSTRAINT "material_export_request_production_department_id_fkey" FOREIGN KEY ("production_department_id") REFERENCES "production_department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_inspection_criteria" ADD CONSTRAINT "material_inspection_criteria_material_variant_id_fkey" FOREIGN KEY ("material_variant_id") REFERENCES "material_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_package" ADD CONSTRAINT "material_package_material_variant_id_fkey" FOREIGN KEY ("material_variant_id") REFERENCES "material_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_receipt" ADD CONSTRAINT "material_receipt_material_package_id_fkey" FOREIGN KEY ("material_package_id") REFERENCES "material_package"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_material_uom_id_fkey" FOREIGN KEY ("material_uom_id") REFERENCES "material_uom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "po_delivery_detail" ADD CONSTRAINT "po_delivery_detail_material_package_id_fkey" FOREIGN KEY ("material_package_id") REFERENCES "material_package"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_attribute" ADD CONSTRAINT "product_attribute_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_formula_material" ADD CONSTRAINT "product_formula_material_material_variant_id_fkey" FOREIGN KEY ("material_variant_id") REFERENCES "material_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_formula_material" ADD CONSTRAINT "product_formula_material_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_formula" ADD CONSTRAINT "product_formula_product_size_id_fkey" FOREIGN KEY ("product_size_id") REFERENCES "product_size"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_inspection_criteria" ADD CONSTRAINT "product_inspection_criteria_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_receipt" ADD CONSTRAINT "product_receipt_product_size_id_fkey" FOREIGN KEY ("product_size_id") REFERENCES "product_size"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_size" ADD CONSTRAINT "product_size_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_product_type_fkey" FOREIGN KEY ("product_type") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_department" ADD CONSTRAINT "production_department_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_plan_detail" ADD CONSTRAINT "production_plan_detail_product_size_id_fkey" FOREIGN KEY ("product_size_id") REFERENCES "product_size"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_plan_detail" ADD CONSTRAINT "production_plan_detail_production_plan_id_fkey" FOREIGN KEY ("production_plan_id") REFERENCES "production_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchasing_staff" ADD CONSTRAINT "purchasing_staff_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warehouse_manager" ADD CONSTRAINT "warehouse_manager_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warehouse_staff" ADD CONSTRAINT "warehouse_staff_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
