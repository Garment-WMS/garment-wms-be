/*
  Warnings:

  - You are about to drop the `_MaterialReceiptToMaterialUom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductReceiptToProductUom` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MaterialReceiptToMaterialUom" DROP CONSTRAINT "_MaterialReceiptToMaterialUom_A_fkey";

-- DropForeignKey
ALTER TABLE "_MaterialReceiptToMaterialUom" DROP CONSTRAINT "_MaterialReceiptToMaterialUom_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductReceiptToProductUom" DROP CONSTRAINT "_ProductReceiptToProductUom_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductReceiptToProductUom" DROP CONSTRAINT "_ProductReceiptToProductUom_B_fkey";

-- DropTable
DROP TABLE "_MaterialReceiptToMaterialUom";

-- DropTable
DROP TABLE "_ProductReceiptToProductUom";
