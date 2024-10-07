/*
  Warnings:

  - You are about to drop the column `product_id` on the `product_formula` table. All the data in the column will be lost.
  - Added the required column `product_variant_id` to the `product_formula` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product_formula" DROP CONSTRAINT "product_formula_product_id_fkey";

-- AlterTable
ALTER TABLE "product_formula" DROP COLUMN "product_id",
ADD COLUMN     "product_variant_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "product_formula" ADD CONSTRAINT "product_formula_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
