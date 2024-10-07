/*
  Warnings:

  - You are about to drop the column `packaging_unit_id` on the `product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `uom_id` on the `product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `uom_per_packaging_unit` on the `product_variant` table. All the data in the column will be lost.
  - Added the required column `size` to the `product_variant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_variant" DROP COLUMN "packaging_unit_id",
DROP COLUMN "uom_id",
DROP COLUMN "uom_per_packaging_unit",
ADD COLUMN     "size" TEXT NOT NULL;
