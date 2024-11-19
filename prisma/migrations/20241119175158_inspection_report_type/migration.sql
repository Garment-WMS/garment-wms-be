-- CreateEnum
CREATE TYPE "InspectionReportType" AS ENUM ('MATERIAL', 'PRODUCT');

-- AlterTable
ALTER TABLE "inspection_report" ADD COLUMN     "type" "InspectionReportType" NOT NULL DEFAULT 'MATERIAL';
