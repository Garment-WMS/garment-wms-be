/*
  Warnings:

  - You are about to drop the column `material_receipt_id` on the `receipt_adjustment` table. All the data in the column will be lost.
  - You are about to drop the column `product_receipt_id` on the `receipt_adjustment` table. All the data in the column will be lost.
  - Made the column `created_at` on table `inventory_report_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `inventory_report_detail` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ReceiptAdjustmentStatus" AS ENUM ('ADJUSTING', 'ADJUSTED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "receipt_adjustment" DROP CONSTRAINT "receipt_adjustment_material_receipt_id_fkey";

-- DropForeignKey
ALTER TABLE "receipt_adjustment" DROP CONSTRAINT "receipt_adjustment_product_receipt_id_fkey";

-- AlterTable
ALTER TABLE "inventory_report_detail" ADD COLUMN     "recored_at" TIMESTAMPTZ(6),
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "receipt_adjustment" DROP COLUMN "material_receipt_id",
DROP COLUMN "product_receipt_id",
ADD COLUMN     "status" "ReceiptAdjustmentStatus" NOT NULL DEFAULT 'ADJUSTING';
