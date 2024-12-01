-- AlterTable
ALTER TABLE "material_export_request" ADD COLUMN     "export_expected_finished_at" TIMESTAMPTZ(6),
ADD COLUMN     "export_expected_started_at" TIMESTAMPTZ(6);
