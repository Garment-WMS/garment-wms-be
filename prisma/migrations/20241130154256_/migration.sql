/*
  Warnings:

  - You are about to drop the column `materialId` on the `product_formula_material` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "product_formula_material" DROP CONSTRAINT "product_formula_material_materialId_fkey";

-- AlterTable
ALTER TABLE "import_request" ADD COLUMN     "expected_finished_at" TIMESTAMPTZ(6),
ADD COLUMN     "expected_started_at" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "product_formula_material" DROP COLUMN "materialId";
