/*
  Warnings:

  - You are about to drop the column `pack_unit` on the `material_receipt` table. All the data in the column will be lost.
  - You are about to drop the column `uom_per_pack` on the `material_receipt` table. All the data in the column will be lost.
  - Made the column `quantity_by_pack` on table `material_receipt` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "inspection_report_inspection_department_id_key";

-- AlterTable
ALTER TABLE "material_receipt" DROP COLUMN "pack_unit",
DROP COLUMN "uom_per_pack",
ALTER COLUMN "quantity_by_pack" SET NOT NULL;
