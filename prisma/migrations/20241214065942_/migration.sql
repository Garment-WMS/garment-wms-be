/*
  Warnings:

  - The values [MATERIAL_FABRIC,MATERIAL_ACCESSORIES] on the enum `DefectType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DefectType_new" AS ENUM ('MATERIAL', 'PRODUCT');
ALTER TABLE "defect" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "defect" ALTER COLUMN "type" TYPE "DefectType_new" USING ("type"::text::"DefectType_new");
ALTER TYPE "DefectType" RENAME TO "DefectType_old";
ALTER TYPE "DefectType_new" RENAME TO "DefectType";
DROP TYPE "DefectType_old";
ALTER TABLE "defect" ALTER COLUMN "type" SET DEFAULT 'MATERIAL';
COMMIT;

-- AlterTable
ALTER TABLE "defect" ALTER COLUMN "type" SET DEFAULT 'MATERIAL';
