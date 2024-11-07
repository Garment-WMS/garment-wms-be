-- AlterTable
ALTER TABLE "inventory_report_detail" ADD COLUMN     "actual_quantity" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "expected_quantity" DOUBLE PRECISION NOT NULL DEFAULT 0;
