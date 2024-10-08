/*
  Warnings:

  - You are about to drop the column `packaging_unit_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `uom_per_packaging_unit` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `material_id` on the `product_formula` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `product_formula` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `product_uom` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `product_formula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity_range_end` to the `product_formula` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity_range_start` to the `product_formula` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product_formula" DROP CONSTRAINT "product_formula_material_id_fkey";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "packaging_unit_id",
DROP COLUMN "uom_per_packaging_unit",
DROP COLUMN "weight";

-- AlterTable
ALTER TABLE "product_formula" DROP COLUMN "material_id",
DROP COLUMN "quantity",
ADD COLUMN     "materialId" UUID,
ADD COLUMN     "name" UUID NOT NULL,
ADD COLUMN     "quantity_range_end" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quantity_range_start" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_uom_name_key" ON "product_uom"("name");

-- AddForeignKey
ALTER TABLE "product_formula" ADD CONSTRAINT "product_formula_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "material"("id") ON DELETE SET NULL ON UPDATE CASCADE;
