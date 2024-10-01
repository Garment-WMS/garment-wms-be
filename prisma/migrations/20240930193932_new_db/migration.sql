/*
  Warnings:

  - You are about to drop the column `po_receipt_id` on the `import_receipt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "import_receipt" DROP COLUMN "po_receipt_id",
ADD COLUMN     "import_request_id" UUID;
