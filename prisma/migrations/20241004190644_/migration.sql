/*
  Warnings:

  - You are about to drop the column `uom` on the `import_request_detail` table. All the data in the column will be lost.
  - You are about to drop the column `uom_per_pack` on the `import_request_detail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "import_request_detail" DROP COLUMN "uom",
DROP COLUMN "uom_per_pack";
