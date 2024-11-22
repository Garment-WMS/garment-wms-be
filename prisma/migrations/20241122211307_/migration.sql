/*
  Warnings:

  - A unique constraint covering the columns `[material_export_request_id]` on the table `material_export_receipt` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "MaterialExportRequestStatus" ADD VALUE 'DELIVERING';

-- AlterTable
ALTER TABLE "material_export_receipt" ADD COLUMN     "material_export_request_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "material_export_receipt_material_export_request_id_key" ON "material_export_receipt"("material_export_request_id");

-- AddForeignKey
ALTER TABLE "material_export_receipt" ADD CONSTRAINT "material_export_receipt_material_export_request_id_fkey" FOREIGN KEY ("material_export_request_id") REFERENCES "material_export_request"("id") ON DELETE SET NULL ON UPDATE CASCADE;
