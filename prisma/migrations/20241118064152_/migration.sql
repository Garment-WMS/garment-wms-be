/*
  Warnings:

  - You are about to drop the column `note` on the `inventory_report_plan_detail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "inventory_report_plan_detail" DROP COLUMN "note",
ADD COLUMN     "warehouse_manager_note" VARCHAR,
ADD COLUMN     "warehouse_staff_note" VARCHAR;
