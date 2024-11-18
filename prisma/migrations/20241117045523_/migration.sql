/*
  Warnings:

  - The values [PENDING] on the enum `inventory_report_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `status` on the `inventory_report_detail` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "inventory_report_status_new" AS ENUM ('NOT_YET', 'EXECUTING', 'FINISHED', 'CANCELLED');
ALTER TABLE "inventory_report" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "inventory_report" ALTER COLUMN "status" TYPE "inventory_report_status_new" USING ("status"::text::"inventory_report_status_new");
ALTER TYPE "inventory_report_status" RENAME TO "inventory_report_status_old";
ALTER TYPE "inventory_report_status_new" RENAME TO "inventory_report_status";
DROP TYPE "inventory_report_status_old";
ALTER TABLE "inventory_report" ALTER COLUMN "status" SET DEFAULT 'NOT_YET';
COMMIT;

-- AlterTable
ALTER TABLE "inventory_report" ALTER COLUMN "status" SET DEFAULT 'NOT_YET';

-- AlterTable
ALTER TABLE "inventory_report_detail" DROP COLUMN "status";
