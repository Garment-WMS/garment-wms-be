/*
  Warnings:

  - You are about to drop the column `expected_finish_date` on the `production_plan_detail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "production_plan_detail" DROP COLUMN "expected_finish_date",
ALTER COLUMN "start_date" DROP NOT NULL;
