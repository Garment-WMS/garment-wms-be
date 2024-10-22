/*
  Warnings:

  - The values [EXPORTED] on the enum `MaterialExportRequestStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MaterialExportRequestStatus_new" AS ENUM ('PENDING', 'APPROVED', 'CANCELLED');
ALTER TABLE "material_export_request" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "material_export_request" ALTER COLUMN "status" TYPE "MaterialExportRequestStatus_new" USING ("status"::text::"MaterialExportRequestStatus_new");
ALTER TYPE "MaterialExportRequestStatus" RENAME TO "MaterialExportRequestStatus_old";
ALTER TYPE "MaterialExportRequestStatus_new" RENAME TO "MaterialExportRequestStatus";
DROP TYPE "MaterialExportRequestStatus_old";
ALTER TABLE "material_export_request" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;
