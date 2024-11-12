/*
  Warnings:

  - You are about to drop the column `material_export_detail_id` on the `material_export_receipt` table. All the data in the column will be lost.
  - You are about to drop the column `material_receipt_id` on the `material_export_receipt` table. All the data in the column will be lost.
  - You are about to drop the column `quantity_by_pack` on the `material_export_receipt` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "material_export_receipt_type" AS ENUM ('PRODUCTION', 'DISCHARGED', 'TRANSFERRED', 'RETURNED');

-- DropForeignKey
ALTER TABLE "material_export_receipt" DROP CONSTRAINT "material_export_receipt_material_receipt_id_fkey";

-- AlterTable
ALTER TABLE "import_receipt" ALTER COLUMN "started_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "material_export_receipt" DROP COLUMN "material_export_detail_id",
DROP COLUMN "material_receipt_id",
DROP COLUMN "quantity_by_pack",
ADD COLUMN     "code" VARCHAR(255),
ADD COLUMN     "finish_at" TIMESTAMPTZ(6),
ADD COLUMN     "note" TEXT,
ADD COLUMN     "start_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "type" "material_export_receipt_type" NOT NULL DEFAULT 'PRODUCTION';
