/*
  Warnings:

  - The values [TRANSFERRED,RETURNED] on the enum `material_export_receipt_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `description` on the `inspection_report_detail_defect` table. All the data in the column will be lost.
  - Added the required column `quantity_by_pack` to the `inspection_report_detail_defect` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "material_export_receipt_type_new" AS ENUM ('PRODUCTION', 'DISCHARGED');
ALTER TABLE "material_export_receipt" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "material_export_receipt" ALTER COLUMN "type" TYPE "material_export_receipt_type_new" USING ("type"::text::"material_export_receipt_type_new");
ALTER TYPE "material_export_receipt_type" RENAME TO "material_export_receipt_type_old";
ALTER TYPE "material_export_receipt_type_new" RENAME TO "material_export_receipt_type";
DROP TYPE "material_export_receipt_type_old";
ALTER TABLE "material_export_receipt" ALTER COLUMN "type" SET DEFAULT 'PRODUCTION';
COMMIT;

-- AlterTable
ALTER TABLE "inspection_report_detail_defect" DROP COLUMN "description",
ADD COLUMN     "quantity_by_pack" INTEGER NOT NULL;
