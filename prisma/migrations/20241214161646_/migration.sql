/*
  Warnings:

  - The `start_date` column on the `production_batch` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `finished_date` column on the `production_batch` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `expected_finish_date` column on the `production_batch` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `expected_start_date` column on the `production_batch` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "production_batch" DROP COLUMN "start_date",
ADD COLUMN     "start_date" TIMESTAMPTZ(6),
DROP COLUMN "finished_date",
ADD COLUMN     "finished_date" TIMESTAMPTZ(6),
DROP COLUMN "expected_finish_date",
ADD COLUMN     "expected_finish_date" TIMESTAMPTZ(6),
DROP COLUMN "expected_start_date",
ADD COLUMN     "expected_start_date" TIMESTAMPTZ(6);
