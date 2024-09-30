-- AlterTable
ALTER TABLE "annual_production_detail" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "annual_production_plan" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "black_list_tokens" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "export_material_request" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "export_material_request_detail" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "factory_director" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "import_request" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "import_request_detail" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "inspection_department" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "inspection_report" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "inspection_report_detail" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "inspection_request" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "material" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "material_attribute" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "material_export" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "material_inspection_criteria" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "material_receipt" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "material_type" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "material_unit" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "otps" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "packaging_unit" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_attribute" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_formula" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_inspection_criteria" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_receipt" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_type" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "production_department" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "production_patch_order" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "purchase_order" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "purchasing_staff" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "quantity_report" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "quantity_report_detail" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "quantity_report_plan" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "quantity_report_type" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "quarterly_production_detail" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "quarterly_production_plan" ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "updated_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "refresh_tokens" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "reserve_percent" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "supplier" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "uom" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "warehouse_manager" ALTER COLUMN "created_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "warehouse_staff" ALTER COLUMN "created_at" DROP NOT NULL;
