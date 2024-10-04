/*
  Warnings:

  - You are about to drop the column `packaging_unit_id` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `packed_height` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `packed_length` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `packed_width` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `uom_per_packaging_unit` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `material` table. All the data in the column will be lost.
  - You are about to drop the column `material_id` on the `po_delivery_detail` table. All the data in the column will be lost.
  - You are about to drop the `annual_production_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `production_patch_order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reserve_percent` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[material_id,name]` on the table `material_attribute` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `import_request` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "import_type" AS ENUM ('MATERIAL_IMPORT_BY_PO', 'PRODUCT_IMPORT_BY_MANUFACTURE_ORDER', 'MATERIAL_IMPORT_BY_REQUEST', 'PRODUCT_IMPORT_BY_REQUEST');

-- CreateEnum
CREATE TYPE "type_enum" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'DATETIME');

-- DropForeignKey
ALTER TABLE "annual_production_detail" DROP CONSTRAINT "annual_production_detail_annual_production_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "annual_production_detail" DROP CONSTRAINT "annual_production_detail_product_id_fkey";

-- DropForeignKey
ALTER TABLE "export_material_request" DROP CONSTRAINT "export_material_request_reserve_percent_id_fkey";

-- DropForeignKey
ALTER TABLE "po_delivery_detail" DROP CONSTRAINT "po_delivery_detail_material_id_fkey";

-- DropForeignKey
ALTER TABLE "production_patch_order" DROP CONSTRAINT "production_patch_order_quarterly_production_detail_id_fkey";

-- DropForeignKey
ALTER TABLE "quarterly_production_detail" DROP CONSTRAINT "quarterly_production_detail_reserve_percent_id_fkey";

-- AlterTable
ALTER TABLE "import_request" ADD COLUMN     "type" "import_type" NOT NULL;

-- AlterTable
ALTER TABLE "material" DROP COLUMN "packaging_unit_id",
DROP COLUMN "packed_height",
DROP COLUMN "packed_length",
DROP COLUMN "packed_width",
DROP COLUMN "uom_per_packaging_unit",
DROP COLUMN "weight",
ALTER COLUMN "created_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "material_attribute" ADD COLUMN     "type" "type_enum" NOT NULL DEFAULT 'STRING';

-- AlterTable
ALTER TABLE "po_delivery_detail" DROP COLUMN "material_id",
ADD COLUMN     "material_variant_id" UUID;

-- AlterTable
ALTER TABLE "product_attribute" ADD COLUMN     "type" "type_enum" NOT NULL DEFAULT 'STRING';

-- AlterTable
ALTER TABLE "purchase_order" ALTER COLUMN "finish_date" DROP NOT NULL;

-- DropTable
DROP TABLE "annual_production_detail";

-- DropTable
DROP TABLE "production_patch_order";

-- DropTable
DROP TABLE "reserve_percent";

-- DropEnum
DROP TYPE "production_patch_order_status";

-- CreateTable
CREATE TABLE "material_variant" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_id" UUID NOT NULL,
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

    CONSTRAINT "material_variant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "material_attribute_material_id_name_key" ON "material_attribute"("material_id", "name");

-- AddForeignKey
ALTER TABLE "material_variant" ADD CONSTRAINT "material_variant_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "po_delivery_detail" ADD CONSTRAINT "po_delivery_detail_material_variant_id_fkey" FOREIGN KEY ("material_variant_id") REFERENCES "material_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
