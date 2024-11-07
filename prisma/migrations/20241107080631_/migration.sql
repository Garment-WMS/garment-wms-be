/*
  Warnings:

  - You are about to drop the column `recorded_quantity` on the `inventory_report_detail` table. All the data in the column will be lost.
  - You are about to drop the column `storage_quantity` on the `inventory_report_detail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "inventory_report_detail" DROP COLUMN "recorded_quantity",
DROP COLUMN "storage_quantity",
ALTER COLUMN "actual_quantity" DROP NOT NULL,
ALTER COLUMN "actual_quantity" DROP DEFAULT,
ALTER COLUMN "expected_quantity" DROP DEFAULT;
