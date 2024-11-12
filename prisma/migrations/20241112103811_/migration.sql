/*
  Warnings:

  - The `status` column on the `production_batch` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[po_delivery_id,material_package_id]` on the table `po_delivery_detail` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "inspection_request_type" AS ENUM ('MATERIAL', 'PRODUCT');

-- CreateEnum
CREATE TYPE "production_batch_status" AS ENUM ('EXECUTING', 'FINISHED', 'CANCELED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "import_request_status" ADD VALUE 'IMPORTING';
ALTER TYPE "import_request_status" ADD VALUE 'IMPORTED';

-- AlterTable
ALTER TABLE "inspection_request" ADD COLUMN     "type" "inspection_request_type" NOT NULL DEFAULT 'MATERIAL';

-- AlterTable
ALTER TABLE "material_export_request" ADD COLUMN     "warehouse_staff_id" UUID;

-- AlterTable
ALTER TABLE "material_receipt" ADD COLUMN     "code" VARCHAR(255) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "product_receipt" ADD COLUMN     "code" VARCHAR(255) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "production_batch" DROP COLUMN "status",
ADD COLUMN     "status" "production_batch_status" NOT NULL DEFAULT 'EXECUTING';

-- DropEnum
DROP TYPE "ManufactureOrderStatus";

-- CreateIndex
CREATE UNIQUE INDEX "po_delivery_detail_po_delivery_id_material_package_id_key" ON "po_delivery_detail"("po_delivery_id", "material_package_id");

-- AddForeignKey
ALTER TABLE "material_export_request" ADD CONSTRAINT "material_export_request_warehouse_staff_id_fkey" FOREIGN KEY ("warehouse_staff_id") REFERENCES "warehouse_staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
