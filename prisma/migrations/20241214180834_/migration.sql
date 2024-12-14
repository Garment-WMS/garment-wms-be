/*
  Warnings:

  - The values [DISCARDED] on the enum `ProductReceiptStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductReceiptStatus_new" AS ENUM ('IMPORTING', 'AVAILABLE', 'USED', 'DISPOSED');
ALTER TABLE "product_receipt" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "product_receipt" ALTER COLUMN "status" TYPE "ProductReceiptStatus_new" USING ("status"::text::"ProductReceiptStatus_new");
ALTER TYPE "ProductReceiptStatus" RENAME TO "ProductReceiptStatus_old";
ALTER TYPE "ProductReceiptStatus_new" RENAME TO "ProductReceiptStatus";
DROP TYPE "ProductReceiptStatus_old";
ALTER TABLE "product_receipt" ALTER COLUMN "status" SET DEFAULT 'AVAILABLE';
COMMIT;
