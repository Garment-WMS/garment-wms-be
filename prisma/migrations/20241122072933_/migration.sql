/*
  Warnings:

  - Made the column `warehouse_staff_id` on table `material_export_receipt` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UomDataType" AS ENUM ('FLOAT', 'INT');

-- AlterTable
ALTER TABLE "material_export_receipt" ALTER COLUMN "warehouse_staff_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "material_uom" ADD COLUMN     "uom_data_type" "UomDataType" DEFAULT 'FLOAT';
