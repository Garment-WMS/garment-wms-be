/*
  Warnings:

  - The values [ALL] on the enum `InventoryReportPlanType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InventoryReportPlanType_new" AS ENUM ('OVERALL', 'PARTIAL');
ALTER TABLE "inventory_report_plan" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "inventory_report_plan" ALTER COLUMN "type" TYPE "InventoryReportPlanType_new" USING ("type"::text::"InventoryReportPlanType_new");
ALTER TYPE "InventoryReportPlanType" RENAME TO "InventoryReportPlanType_old";
ALTER TYPE "InventoryReportPlanType_new" RENAME TO "InventoryReportPlanType";
DROP TYPE "InventoryReportPlanType_old";
ALTER TABLE "inventory_report_plan" ALTER COLUMN "type" SET DEFAULT 'OVERALL';
COMMIT;

-- AlterTable
ALTER TABLE "inventory_report_plan" ALTER COLUMN "type" SET DEFAULT 'OVERALL';
