/*
  Warnings:

  - You are about to drop the column `expect_finished_at` on the `material_export_receipt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "material_export_receipt" DROP COLUMN "expect_finished_at",
ADD COLUMN     "expected_finished_at" TIMESTAMPTZ(6);
