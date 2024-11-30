/*
  Warnings:

  - You are about to drop the column `expected_finished_at` on the `import_request` table. All the data in the column will be lost.
  - You are about to drop the column `expected_started_at` on the `import_request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "import_request" DROP COLUMN "expected_finished_at",
DROP COLUMN "expected_started_at",
ADD COLUMN     "import_expected_finished_at" TIMESTAMPTZ(6),
ADD COLUMN     "import_expected_started_at" TIMESTAMPTZ(6),
ADD COLUMN     "inspect_expected_started_at" TIMESTAMPTZ(6),
ADD COLUMN     "inspection_expected_finished_at" TIMESTAMPTZ(6);
