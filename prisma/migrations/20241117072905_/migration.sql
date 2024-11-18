/*
  Warnings:

  - The values [NOT_YET,EXECUTING] on the enum `inventory_report_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `inventory_report_type` on the `inventory_report` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "inventory_report_status_new" AS ENUM ('IN_PROGRESS', 'REPORTED', 'FINISHED', 'CANCELLED');
ALTER TABLE "inventory_report" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "inventory_report" ALTER COLUMN "status" TYPE "inventory_report_status_new" USING ("status"::text::"inventory_report_status_new");
ALTER TYPE "inventory_report_status" RENAME TO "inventory_report_status_old";
ALTER TYPE "inventory_report_status_new" RENAME TO "inventory_report_status";
DROP TYPE "inventory_report_status_old";
ALTER TABLE "inventory_report" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';
COMMIT;

-- AlterTable
ALTER TABLE "inventory_report" DROP COLUMN "inventory_report_type",
ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';

-- DropEnum
DROP TYPE "inventory_report_type_enum";
