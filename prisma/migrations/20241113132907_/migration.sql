/*
  Warnings:

  - The values [PARTIAL_USED,DISPOSED] on the enum `MaterialReceiptStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MaterialReceiptStatus_new" AS ENUM ('IMPORTING', 'AVAILABLE', 'USED');
ALTER TABLE "material_receipt" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "material_receipt" ALTER COLUMN "status" TYPE "MaterialReceiptStatus_new" USING ("status"::text::"MaterialReceiptStatus_new");
ALTER TYPE "MaterialReceiptStatus" RENAME TO "MaterialReceiptStatus_old";
ALTER TYPE "MaterialReceiptStatus_new" RENAME TO "MaterialReceiptStatus";
DROP TYPE "MaterialReceiptStatus_old";
ALTER TABLE "material_receipt" ALTER COLUMN "status" SET DEFAULT 'IMPORTING';
COMMIT;
