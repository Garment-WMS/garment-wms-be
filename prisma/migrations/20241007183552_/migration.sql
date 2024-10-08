/*
  Warnings:

  - You are about to drop the column `from` on the `import_request` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `import_request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "import_request" DROP COLUMN "from",
DROP COLUMN "to";
