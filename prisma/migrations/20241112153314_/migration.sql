/*
  Warnings:

  - You are about to drop the column `appove_note` on the `import_request` table. All the data in the column will be lost.
  - You are about to drop the column `reject_reason` on the `import_request` table. All the data in the column will be lost.
  - You are about to drop the column `appove_note` on the `material_export_request` table. All the data in the column will be lost.
  - You are about to drop the column `reject_reason` on the `material_export_request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "import_request" DROP COLUMN "appove_note",
DROP COLUMN "reject_reason",
ADD COLUMN     "manager_note" VARCHAR;

-- AlterTable
ALTER TABLE "material_export_request" DROP COLUMN "appove_note",
DROP COLUMN "reject_reason",
ADD COLUMN     "manager_note" VARCHAR;
