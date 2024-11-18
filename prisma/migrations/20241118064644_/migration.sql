/*
  Warnings:

  - You are about to drop the column `note` on the `inventory_report_detail` table. All the data in the column will be lost.
  - You are about to drop the column `warehouse_manager_note` on the `inventory_report_plan_detail` table. All the data in the column will be lost.
  - You are about to drop the column `warehouse_staff_note` on the `inventory_report_plan_detail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "inventory_report_detail" DROP COLUMN "note",
ADD COLUMN     "warehouse_manager_note" VARCHAR,
ADD COLUMN     "warehouse_staff_note" VARCHAR;

-- AlterTable
ALTER TABLE "inventory_report_plan_detail" DROP COLUMN "warehouse_manager_note",
DROP COLUMN "warehouse_staff_note",
ADD COLUMN     "note" VARCHAR;
