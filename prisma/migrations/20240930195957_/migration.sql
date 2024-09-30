/*
  Warnings:

  - You are about to drop the column `import_request_id` on the `import_receipt` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `import_request_detail` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `material_receipt` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `po_delivery_detail` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `product_receipt` table. All the data in the column will be lost.
  - You are about to drop the `_MaterialToPackagingUnit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PackagingUnitToProduct` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `material_unit` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `packaging_unit_id` to the `material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uom_per_packaging_unit` to the `material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `packaging_unit_id` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uom_per_packaging_unit` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MaterialToPackagingUnit" DROP CONSTRAINT "_MaterialToPackagingUnit_A_fkey";

-- DropForeignKey
ALTER TABLE "_MaterialToPackagingUnit" DROP CONSTRAINT "_MaterialToPackagingUnit_B_fkey";

-- DropForeignKey
ALTER TABLE "_PackagingUnitToProduct" DROP CONSTRAINT "_PackagingUnitToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_PackagingUnitToProduct" DROP CONSTRAINT "_PackagingUnitToProduct_B_fkey";

-- DropForeignKey
ALTER TABLE "material_unit" DROP CONSTRAINT "material_unit_material_id_fkey";

-- AlterTable
ALTER TABLE "import_receipt" DROP COLUMN "import_request_id",
ADD COLUMN     "po_receipt_id" UUID;

-- AlterTable
ALTER TABLE "import_request_detail" DROP COLUMN "quantity",
ADD COLUMN     "quantity_by_uom" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "material" ADD COLUMN     "packaging_unit_id" UUID NOT NULL,
ADD COLUMN     "uom_per_packaging_unit" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "material_receipt" DROP COLUMN "quantity",
ADD COLUMN     "quantity_by_uom" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "po_delivery_detail" DROP COLUMN "quantity",
ADD COLUMN     "quantity_by_packaging" DOUBLE PRECISION,
ADD COLUMN     "quantity_by_uom" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "product" ADD COLUMN     "packaging_unit_id" UUID NOT NULL,
ADD COLUMN     "uom_per_packaging_unit" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "product_receipt" DROP COLUMN "quantity",
ADD COLUMN     "quantity_by_uom" DOUBLE PRECISION;

-- DropTable
DROP TABLE "_MaterialToPackagingUnit";

-- DropTable
DROP TABLE "_PackagingUnitToProduct";

-- DropTable
DROP TABLE "material_unit";

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_packaging_unit_id_fkey" FOREIGN KEY ("packaging_unit_id") REFERENCES "packaging_unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_packaging_unit_id_fkey" FOREIGN KEY ("packaging_unit_id") REFERENCES "packaging_unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
