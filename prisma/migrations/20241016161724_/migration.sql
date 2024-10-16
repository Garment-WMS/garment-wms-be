/*
  Warnings:

  - A unique constraint covering the columns `[material_variant_id]` on the table `inventory_stock` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_variant_id]` on the table `inventory_stock` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "inventory_stock_material_variant_id_key" ON "inventory_stock"("material_variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_stock_product_variant_id_key" ON "inventory_stock"("product_variant_id");
