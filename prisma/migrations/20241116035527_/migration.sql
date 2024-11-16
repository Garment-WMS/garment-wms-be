/*
  Warnings:

  - The values [DONE] on the enum `inventory_report_plan_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "inventory_report_plan_status_new" AS ENUM ('PENDING', 'IN_PROGRESS', 'FINISHED', 'CANCELLED');
ALTER TABLE "inventory_report_plan" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "inventory_report_plan" ALTER COLUMN "status" TYPE "inventory_report_plan_status_new" USING ("status"::text::"inventory_report_plan_status_new");
ALTER TYPE "inventory_report_plan_status" RENAME TO "inventory_report_plan_status_old";
ALTER TYPE "inventory_report_plan_status_new" RENAME TO "inventory_report_plan_status";
DROP TYPE "inventory_report_plan_status_old";
ALTER TABLE "inventory_report_plan" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
