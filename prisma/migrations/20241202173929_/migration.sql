/*
  Warnings:

  - The values [DELIVERED,DELIVERING] on the enum `MaterialExportRequestStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [DELIVERING,DELIVERED] on the enum `export_receipt_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MaterialExportRequestStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED', 'AWAIT_TO_EXPORT', 'EXPORTING', 'EXPORTED', 'PRODUCTION_APPROVED', 'PRODUCTION_REJECTED', 'RETURNED');
ALTER TABLE "material_export_request" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "material_export_request" ALTER COLUMN "status" TYPE "MaterialExportRequestStatus_new" USING ("status"::text::"MaterialExportRequestStatus_new");
ALTER TYPE "MaterialExportRequestStatus" RENAME TO "MaterialExportRequestStatus_old";
ALTER TYPE "MaterialExportRequestStatus_new" RENAME TO "MaterialExportRequestStatus";
DROP TYPE "MaterialExportRequestStatus_old";
ALTER TABLE "material_export_request" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "export_receipt_status_new" AS ENUM ('AWAIT_TO_EXPORT', 'EXPORTING', 'EXPORTED', 'CANCELLED');
ALTER TABLE "material_export_receipt" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "material_export_receipt" ALTER COLUMN "status" TYPE "export_receipt_status_new" USING ("status"::text::"export_receipt_status_new");
ALTER TYPE "export_receipt_status" RENAME TO "export_receipt_status_old";
ALTER TYPE "export_receipt_status_new" RENAME TO "export_receipt_status";
DROP TYPE "export_receipt_status_old";
ALTER TABLE "material_export_receipt" ALTER COLUMN "status" SET DEFAULT 'EXPORTING';
COMMIT;
