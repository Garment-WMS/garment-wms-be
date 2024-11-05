/*
  Warnings:

  - The `inventory_report` column on the `inventory_report_plan_detail` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "inventory_report_plan_detail" DROP CONSTRAINT "inventory_report_plan_detail_inventory_report_fkey";

-- AlterTable
ALTER TABLE "inventory_report_plan_detail" DROP COLUMN "inventory_report",
ADD COLUMN     "inventory_report" UUID;

-- AddForeignKey
ALTER TABLE "inventory_report_plan_detail" ADD CONSTRAINT "inventory_report_plan_detail_inventory_report_fkey" FOREIGN KEY ("inventory_report") REFERENCES "inventory_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
