/*
  Warnings:

  - You are about to drop the column `inspection_expected_finished_at` on the `import_request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "import_request" DROP COLUMN "inspection_expected_finished_at",
ADD COLUMN     "inspect_expected_finished_at" TIMESTAMPTZ(6);
