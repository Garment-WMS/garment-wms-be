/*
  Warnings:

  - The values [DISCHARGED] on the enum `material_export_receipt_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "material_export_receipt_type_new" AS ENUM ('PRODUCTION', 'DISPOSED');
ALTER TABLE "material_export_receipt" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "material_export_receipt" ALTER COLUMN "type" TYPE "material_export_receipt_type_new" USING ("type"::text::"material_export_receipt_type_new");
ALTER TYPE "material_export_receipt_type" RENAME TO "material_export_receipt_type_old";
ALTER TYPE "material_export_receipt_type_new" RENAME TO "material_export_receipt_type";
DROP TYPE "material_export_receipt_type_old";
ALTER TABLE "material_export_receipt" ALTER COLUMN "type" SET DEFAULT 'PRODUCTION';
COMMIT;
