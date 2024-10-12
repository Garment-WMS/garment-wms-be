/*
  Warnings:

  - You are about to drop the column `supplier_code` on the `supplier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `import_receipt` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `manufacture_order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `supplier` will be added. If there are existing duplicate values, this will fail.
  - Made the column `warehouse_staff_id` on table `import_receipt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `import_receipt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `import_receipt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `warehouse_manager_id` on table `import_receipt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `inspection_report` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `material` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `product_inspection_criteria` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `product_type` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `product_variant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `code` on table `quarterly_production_plan` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "supplier_supplier_code_key";

-- AlterTable
ALTER TABLE "import_receipt" ALTER COLUMN "warehouse_staff_id" SET NOT NULL,
ALTER COLUMN "code" SET NOT NULL,
ALTER COLUMN "code" SET DATA TYPE VARCHAR,
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "warehouse_manager_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "inspection_report" ALTER COLUMN "code" SET NOT NULL;

-- AlterTable
ALTER TABLE "material" ALTER COLUMN "code" SET NOT NULL;

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "code" SET NOT NULL;

-- AlterTable
ALTER TABLE "product_inspection_criteria" ALTER COLUMN "code" SET NOT NULL;

-- AlterTable
ALTER TABLE "product_type" ALTER COLUMN "code" SET NOT NULL;

-- AlterTable
ALTER TABLE "product_variant" ALTER COLUMN "code" SET NOT NULL;

-- AlterTable
ALTER TABLE "quarterly_production_plan" ALTER COLUMN "code" SET NOT NULL;

-- AlterTable
ALTER TABLE "supplier" DROP COLUMN "supplier_code",
ADD COLUMN     "code" VARCHAR;

-- CreateIndex
CREATE UNIQUE INDEX "import_receipt_code_key" ON "import_receipt"("code");

-- CreateIndex
CREATE UNIQUE INDEX "manufacture_order_code_key" ON "manufacture_order"("code");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_code_key" ON "supplier"("code");
