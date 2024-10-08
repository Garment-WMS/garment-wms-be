/*
  Warnings:

  - A unique constraint covering the columns `[product_formula_id,material_id]` on the table `product_formula_material` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[PO_number]` on the table `purchase_order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "product_formula_material" DROP CONSTRAINT "product_formula_material_product_formula_id_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "product_formula_material_product_formula_id_material_id_key" ON "product_formula_material"("product_formula_id", "material_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_order_PO_number_key" ON "purchase_order"("PO_number");

-- AddForeignKey
ALTER TABLE "product_formula_material" ADD CONSTRAINT "product_formula_material_product_formula_id_fkey" FOREIGN KEY ("product_formula_id") REFERENCES "product_formula"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
