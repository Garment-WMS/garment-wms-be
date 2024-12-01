/*
  Warnings:

  - You are about to drop the column `export_expected_finished_at` on the `material_export_request` table. All the data in the column will be lost.
  - You are about to drop the column `export_expected_started_at` on the `material_export_request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "material_export_request" DROP COLUMN "export_expected_finished_at",
DROP COLUMN "export_expected_started_at",
ADD COLUMN     "export_expected_date_time" TIMESTAMP(3);
