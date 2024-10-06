/*
  Warnings:

  - You are about to drop the column `uom` on the `material_receipt` table. All the data in the column will be lost.
  - You are about to drop the column `uomId` on the `material_receipt` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `length` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `uom_id` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `uomId` on the `product_receipt` table. All the data in the column will be lost.
  - You are about to drop the `uom` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `product_uom_id` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "material" DROP CONSTRAINT "material_uom_id_fkey";

-- DropForeignKey
ALTER TABLE "material_receipt" DROP CONSTRAINT "material_receipt_uomId_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_uom_id_fkey";

-- DropForeignKey
ALTER TABLE "product_receipt" DROP CONSTRAINT "product_receipt_uomId_fkey";

-- AlterTable
ALTER TABLE "material" ADD COLUMN     "materialUomId" UUID;

-- AlterTable
ALTER TABLE "material_receipt" DROP COLUMN "uom",
DROP COLUMN "uomId",
ADD COLUMN     "material_uom_id" UUID;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "height",
DROP COLUMN "length",
DROP COLUMN "uom_id",
DROP COLUMN "width",
ADD COLUMN     "product_uom_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "product_receipt" DROP COLUMN "uomId",
ADD COLUMN     "material_uom_id" UUID;

-- DropTable
DROP TABLE "uom";

-- CreateTable
CREATE TABLE "material_uom" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "material_uom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_formula_material" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_formula_id" UUID NOT NULL,
    "material_id" UUID NOT NULL,
    "quantit_by_uom" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "product_formula_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_uom" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "product_uom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variant" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "code" VARCHAR,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "length" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "uom_id" UUID NOT NULL,
    "packaging_unit_id" UUID NOT NULL,
    "uom_per_packaging_unit" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "product_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MaterialReceiptToMaterialUom" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "product_variant_code_key" ON "product_variant"("code");

-- CreateIndex
CREATE UNIQUE INDEX "_MaterialReceiptToMaterialUom_AB_unique" ON "_MaterialReceiptToMaterialUom"("A", "B");

-- CreateIndex
CREATE INDEX "_MaterialReceiptToMaterialUom_B_index" ON "_MaterialReceiptToMaterialUom"("B");

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_materialUomId_fkey" FOREIGN KEY ("materialUomId") REFERENCES "material_uom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_formula_material" ADD CONSTRAINT "product_formula_material_product_formula_id_fkey" FOREIGN KEY ("product_formula_id") REFERENCES "product_formula"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_formula_material" ADD CONSTRAINT "product_formula_material_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_receipt" ADD CONSTRAINT "product_receipt_material_uom_id_fkey" FOREIGN KEY ("material_uom_id") REFERENCES "material_uom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_product_uom_id_fkey" FOREIGN KEY ("product_uom_id") REFERENCES "product_uom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "_MaterialReceiptToMaterialUom" ADD CONSTRAINT "_MaterialReceiptToMaterialUom_A_fkey" FOREIGN KEY ("A") REFERENCES "material_receipt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MaterialReceiptToMaterialUom" ADD CONSTRAINT "_MaterialReceiptToMaterialUom_B_fkey" FOREIGN KEY ("B") REFERENCES "material_uom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
