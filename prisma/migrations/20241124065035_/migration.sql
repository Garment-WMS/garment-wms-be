/*
  Warnings:

  - You are about to drop the column `inspection_report_id` on the `inspection_report_detail_defect` table. All the data in the column will be lost.
  - Added the required column `inspection_report_detail_id` to the `inspection_report_detail_defect` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "inspection_report_detail_defect" DROP CONSTRAINT "inspection_report_detail_defect_inspection_report_id_fkey";

-- AlterTable
ALTER TABLE "inspection_report_detail_defect" DROP COLUMN "inspection_report_id",
ADD COLUMN     "inspection_report_detail_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "inspection_report_detail_defect" ADD CONSTRAINT "inspection_report_detail_defect_inspection_report_detail_i_fkey" FOREIGN KEY ("inspection_report_detail_id") REFERENCES "inspection_report_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
