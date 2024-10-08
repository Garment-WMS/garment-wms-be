/*
  Warnings:

  - You are about to drop the column `expire_date` on the `po_delivery_detail` table. All the data in the column will be lost.
  - You are about to drop the column `pack_unit` on the `po_delivery_detail` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `po_delivery_detail` table. All the data in the column will be lost.
  - You are about to drop the column `total_ammount` on the `po_delivery_detail` table. All the data in the column will be lost.
  - You are about to drop the column `uom` on the `po_delivery_detail` table. All the data in the column will be lost.
  - You are about to drop the column `uom_per_pack` on the `po_delivery_detail` table. All the data in the column will be lost.
  - Added the required column `import_request_type` to the `import_request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_amount` to the `po_delivery_detail` table without a default value. This is not possible if the table is not empty.
  - Made the column `po_delivery_id` on table `po_delivery_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity_by_pack` on table `po_delivery_detail` required. This step will fail if there are existing NULL values in that column.
  - Made the column `material_variant_id` on table `po_delivery_detail` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "po_delivery_detail" DROP CONSTRAINT "po_delivery_detail_product_id_fkey";

-- AlterTable
ALTER TABLE "import_request" ADD COLUMN     "import_request_type" "import_request_type" NOT NULL;

-- AlterTable
ALTER TABLE "po_delivery_detail" DROP COLUMN "expire_date",
DROP COLUMN "pack_unit",
DROP COLUMN "product_id",
DROP COLUMN "total_ammount",
DROP COLUMN "uom",
DROP COLUMN "uom_per_pack",
ADD COLUMN     "expired_date" TIMESTAMPTZ(6),
ADD COLUMN     "total_amount" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "po_delivery_id" SET NOT NULL,
ALTER COLUMN "quantity_by_pack" SET NOT NULL,
ALTER COLUMN "material_variant_id" SET NOT NULL;
