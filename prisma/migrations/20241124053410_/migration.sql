-- DropForeignKey
ALTER TABLE "inspection_report_detail_defect" DROP CONSTRAINT "inspection_report_detail_defect_inspection_report_id_fkey";

-- AddForeignKey
ALTER TABLE "inspection_report_detail_defect" ADD CONSTRAINT "inspection_report_detail_defect_inspection_report_id_fkey" FOREIGN KEY ("inspection_report_id") REFERENCES "inspection_report_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
