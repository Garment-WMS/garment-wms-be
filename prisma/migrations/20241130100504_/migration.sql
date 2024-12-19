/*
  Warnings:

  - You are about to drop the column `finish_at` on the `material_export_receipt` table. All the data in the column will be lost.
  - You are about to drop the column `start_at` on the `material_export_receipt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "import_receipt" ADD COLUMN     "expect_finished_at" TIMESTAMPTZ(6),
ADD COLUMN     "expected_started_at" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "inspection_request" ADD COLUMN     "expect_finished_at" TIMESTAMPTZ(6),
ADD COLUMN     "expected_started_at" TIMESTAMPTZ(6),
ADD COLUMN     "finished_at" TIMESTAMPTZ(6),
ADD COLUMN     "started_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "material_export_receipt" DROP COLUMN "finish_at",
DROP COLUMN "start_at",
ADD COLUMN     "expect_finished_at" TIMESTAMPTZ(6),
ADD COLUMN     "expected_started_at" TIMESTAMPTZ(6),
ADD COLUMN     "finished_at" TIMESTAMPTZ(6),
ADD COLUMN     "started_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;
