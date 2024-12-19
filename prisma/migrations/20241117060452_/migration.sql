-- CreateEnum
CREATE TYPE "InventoryReportPlanType" AS ENUM ('ALL', 'PARTIAL');

-- AlterTable
ALTER TABLE "inventory_report_plan" ADD COLUMN     "type" "InventoryReportPlanType" DEFAULT 'ALL';
