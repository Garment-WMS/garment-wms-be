/*
  Warnings:

  - You are about to drop the column `materialPackageId` on the `inventory_report` table. All the data in the column will be lost.
  - You are about to drop the column `material_variant_id` on the `inventory_report` table. All the data in the column will be lost.
  - You are about to drop the column `productSizeId` on the `inventory_report` table. All the data in the column will be lost.
  - You are about to drop the column `product_variant_id` on the `inventory_report` table. All the data in the column will be lost.
  - Added the required column `title` to the `inventory_report_plan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "inventory_report" DROP CONSTRAINT "inventory_report_material_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory_report" DROP CONSTRAINT "inventory_report_product_variant_id_fkey";

-- AlterTable
ALTER TABLE "inventory_report" DROP COLUMN "materialPackageId",
DROP COLUMN "material_variant_id",
DROP COLUMN "productSizeId",
DROP COLUMN "product_variant_id";

-- AlterTable
ALTER TABLE "inventory_report_plan" ADD COLUMN     "title" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "inventory_report_plan_detail" ADD COLUMN     "inventory_report" VARCHAR;

-- AddForeignKey
ALTER TABLE "inventory_report_plan_detail" ADD CONSTRAINT "inventory_report_plan_detail_inventory_report_fkey" FOREIGN KEY ("inventory_report") REFERENCES "inventory_report"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;
