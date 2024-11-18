-- DropIndex
DROP INDEX "import_receipt_code_key";

-- DropIndex
DROP INDEX "import_request_code_key";

-- DropIndex
DROP INDEX "inspection_report_code_key";

-- DropIndex
DROP INDEX "inventory_report_code_key";

-- DropIndex
DROP INDEX "inventory_report_plan_code_key";

-- DropIndex
DROP INDEX "material_code_key";

-- DropIndex
DROP INDEX "material_inspection_criteria_code_key";

-- DropIndex
DROP INDEX "material_package_code_key";

-- DropIndex
DROP INDEX "material_variant_code_key";

-- DropIndex
DROP INDEX "po_delivery_code_key";

-- DropIndex
DROP INDEX "product_code_key";

-- DropIndex
DROP INDEX "product_inspection_criteria_code_key";

-- DropIndex
DROP INDEX "product_size_code_key";

-- DropIndex
DROP INDEX "product_variant_code_key";

-- DropIndex
DROP INDEX "production_batch_code_key";

-- DropIndex
DROP INDEX "production_plan_code_key";

-- DropIndex
DROP INDEX "supplier_code_key";

-- AlterTable
ALTER TABLE "import_receipt" ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "import_request" ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "inspection_report" ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "inventory_report" ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "inventory_report_plan" ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "material_inspection_criteria" ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "material_package" ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "material_receipt" ALTER COLUMN "code" DROP NOT NULL,
ALTER COLUMN "code" DROP DEFAULT;

-- AlterTable
ALTER TABLE "material_variant" ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "po_delivery" ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_formula" ADD COLUMN     "code" VARCHAR;

-- AlterTable
ALTER TABLE "product_inspection_criteria" ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_receipt" ALTER COLUMN "code" DROP NOT NULL,
ALTER COLUMN "code" DROP DEFAULT;

-- AlterTable
ALTER TABLE "product_size" ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_variant" ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "production_batch" ALTER COLUMN "code" DROP NOT NULL;

-- AlterTable
ALTER TABLE "production_plan" ALTER COLUMN "code" DROP NOT NULL;
