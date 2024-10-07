/*
  Warnings:

  - You are about to drop the column `material_id` on the `export_material_request_detail` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `import_request_detail` table. All the data in the column will be lost.
  - You are about to drop the column `material_id` on the `inspection_report_detail` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `inspection_report_detail` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `manufacture_order` table. All the data in the column will be lost.
  - You are about to drop the column `material_id` on the `material_export_detail` table. All the data in the column will be lost.
  - You are about to drop the column `material_id` on the `material_receipt` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `product_receipt` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `quarterly_production_detail` table. All the data in the column will be lost.
  - Added the required column `material_variant_id` to the `export_material_request_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material_variant_id` to the `inspection_report_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_variant_id` to the `inspection_report_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_variant_id` to the `manufacture_order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material_variant_id` to the `material_export_detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material_variant_id` to the `material_receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_variant_id` to the `product_receipt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_variant_id` to the `quarterly_production_detail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "export_material_request_detail" DROP CONSTRAINT "export_material_request_detail_material_id_fkey";

-- DropForeignKey
ALTER TABLE "import_request_detail" DROP CONSTRAINT "import_request_detail_product_id_fkey";

-- DropForeignKey
ALTER TABLE "inspection_report_detail" DROP CONSTRAINT "inspection_report_detail_material_id_fkey";

-- DropForeignKey
ALTER TABLE "inspection_report_detail" DROP CONSTRAINT "inspection_report_detail_product_id_fkey";

-- DropForeignKey
ALTER TABLE "manufacture_order" DROP CONSTRAINT "manufacture_order_product_id_fkey";

-- DropForeignKey
ALTER TABLE "material_export_detail" DROP CONSTRAINT "material_export_detail_material_id_fkey";

-- DropForeignKey
ALTER TABLE "material_receipt" DROP CONSTRAINT "material_receipt_material_id_fkey";

-- DropForeignKey
ALTER TABLE "product_receipt" DROP CONSTRAINT "product_receipt_product_id_fkey";

-- DropForeignKey
ALTER TABLE "quarterly_production_detail" DROP CONSTRAINT "quarterly_production_detail_product_id_fkey";

-- AlterTable
ALTER TABLE "export_material_request_detail" DROP COLUMN "material_id",
ADD COLUMN     "material_variant_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "import_request_detail" DROP COLUMN "product_id",
ADD COLUMN     "product_variant_id" UUID;

-- AlterTable
ALTER TABLE "inspection_report_detail" DROP COLUMN "material_id",
DROP COLUMN "product_id",
ADD COLUMN     "material_variant_id" UUID NOT NULL,
ADD COLUMN     "product_variant_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "manufacture_order" DROP COLUMN "product_id",
ADD COLUMN     "product_variant_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "material_export_detail" DROP COLUMN "material_id",
ADD COLUMN     "material_variant_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "material_receipt" DROP COLUMN "material_id",
ADD COLUMN     "material_variant_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "product_receipt" DROP COLUMN "product_id",
ADD COLUMN     "product_variant_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "quarterly_production_detail" DROP COLUMN "product_id",
ADD COLUMN     "product_variant_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "export_material_request_detail" ADD CONSTRAINT "export_material_request_detail_material_variant_id_fkey" FOREIGN KEY ("material_variant_id") REFERENCES "material_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request_detail" ADD CONSTRAINT "import_request_detail_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_report_detail" ADD CONSTRAINT "inspection_report_detail_material_variant_id_fkey" FOREIGN KEY ("material_variant_id") REFERENCES "material_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_report_detail" ADD CONSTRAINT "inspection_report_detail_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "manufacture_order" ADD CONSTRAINT "manufacture_order_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_export_detail" ADD CONSTRAINT "material_export_detail_material_variant_id_fkey" FOREIGN KEY ("material_variant_id") REFERENCES "material_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_receipt" ADD CONSTRAINT "material_receipt_material_variant_id_fkey" FOREIGN KEY ("material_variant_id") REFERENCES "material_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_receipt" ADD CONSTRAINT "product_receipt_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quarterly_production_detail" ADD CONSTRAINT "quarterly_production_detail_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
