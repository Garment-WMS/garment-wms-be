-- CreateEnum
CREATE TYPE "InventoryReportDetailStatus" AS ENUM ('IN_PROGRESS', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "inventory_report_detail" ADD COLUMN     "status" "InventoryReportDetailStatus" NOT NULL DEFAULT 'IN_PROGRESS';
