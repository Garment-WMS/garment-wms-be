-- CreateEnum
CREATE TYPE "export_material_request_status" AS ENUM ('PENDING', 'REJECTED', 'APPROVED', 'IN_PROGRESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "import_request_status" AS ENUM ('PENDING', 'REJECTED', 'APPROVED', 'INSPECTING', 'INSPECTED', 'IMPORTING', 'IMPORTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "import_request_type" AS ENUM ('MATERIAL_BY_PO', 'MATERIAL_RETURN', 'MATERIAL_NOT_BY_PO', 'PRODUCT_BY_MO', 'PRODUCT_RETURN', 'PRODUCT_NOT_BY_MO');

-- CreateEnum
CREATE TYPE "inspection_request_status" AS ENUM ('PENDING', 'CANCELLED', 'IN_PROGESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "ManufactureOrderStatus" AS ENUM ('EXECUTING', 'FINISHED', 'CANCELED');

-- CreateEnum
CREATE TYPE "AttributeType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'DATETIME');

-- CreateEnum
CREATE TYPE "MaterialExportRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'EXPORTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "po_delivery_status" AS ENUM ('PENDING', 'FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "purchase_order_status" AS ENUM ('IN_PROGESS', 'CANCELLED', 'FINISHED');

-- CreateEnum
CREATE TYPE "InventoryReportStatus" AS ENUM ('PLANNING', 'EXECUTING', 'FINISHED');

-- CreateEnum
CREATE TYPE "production_status" AS ENUM ('PLANNING', 'IN_PROGRESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "role_codes" AS ENUM ('RENTER', 'LANDLORD', 'STAFF', 'TECHNICAL_STAFF', 'ADMIN', 'MANAGER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateTable
CREATE TABLE "annual_production_plan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "factory_director_id" UUID NOT NULL,
    "year" INTEGER NOT NULL,
    "code" VARCHAR,
    "status" "production_status" NOT NULL DEFAULT 'PLANNING',
    "expected_start_date" DATE NOT NULL,
    "expected_end_date" DATE NOT NULL,
    "start_date" DATE,
    "finish_date" DATE,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "annual_production_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "black_list_tokens" (
    "token" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "expired_at" TIMESTAMPTZ(6) NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "black_list_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "export_material_request_detail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_id" UUID NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "export_material_request_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "export_material_request" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "status" "export_material_request_status" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "deliver_date" DATE,
    "expected_deliver_date" DATE,
    "production_department_id" UUID NOT NULL,
    "reserve_percent_id" UUID,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "export_material_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factory_director" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "factory_director_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_receipt" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "warehouse_staff_id" UUID,
    "start_at" TIMESTAMPTZ(6),
    "finish_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "inspection_report_id" UUID,

    CONSTRAINT "import_receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_request_detail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "import_request_id" UUID NOT NULL,
    "material_variant_id" UUID,
    "product_id" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "pack_unit" TEXT,
    "quantity_by_pack" DOUBLE PRECISION,
    "uom" TEXT,
    "uom_per_pack" DOUBLE PRECISION,

    CONSTRAINT "import_request_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_request" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "warehouse_staff_id" UUID,
    "status" "import_request_status" NOT NULL DEFAULT 'PENDING',
    "from" VARCHAR,
    "to" VARCHAR,
    "start_at" TIMESTAMPTZ(6),
    "finish_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "cancel_at" TIMESTAMPTZ(6),
    "cancel_reason" VARCHAR,
    "description" VARCHAR,
    "po_delivery_id" UUID NOT NULL,
    "purchasing_staff_id" UUID,
    "reject_at" TIMESTAMPTZ(6),
    "reject_reason" VARCHAR,
    "warehouse_manager_id" UUID,

    CONSTRAINT "import_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_department" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "inspection_department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_report_detail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_id" UUID,
    "product_id" UUID,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "approved_quantity_by_pack" DOUBLE PRECISION NOT NULL,
    "defect_quantity_by_pack" DOUBLE PRECISION NOT NULL,
    "inspection_report_id" UUID NOT NULL,
    "pack_unit" TEXT,
    "quantity_by_pack" DOUBLE PRECISION,
    "uom" TEXT,
    "uom_per_pack" DOUBLE PRECISION,

    CONSTRAINT "inspection_report_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_report" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "inspection_department_id" UUID NOT NULL,
    "code" VARCHAR,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "inspection_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_request" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "purchasing_staff_id" UUID NOT NULL,
    "inspection_department_id" UUID NOT NULL,
    "delivery_note_id" UUID NOT NULL,
    "notation" TEXT,
    "status" "inspection_request_status" NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "inspection_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manufacture_order" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "code" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR,
    "quantity" DOUBLE PRECISION NOT NULL,
    "uom_id" UUID NOT NULL,
    "canceled_at" TIMESTAMPTZ(6),
    "canceled_by" UUID,
    "canceled_reason" VARCHAR,
    "status" "ManufactureOrderStatus" NOT NULL DEFAULT 'EXECUTING',
    "start_time" TIME(6),
    "end_time" TIME(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "manufacture_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_attribute" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "value" VARCHAR NOT NULL,
    "type" "AttributeType" DEFAULT 'STRING',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "material_attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_export_detail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_export_request_id" UUID,
    "material_id" UUID NOT NULL,
    "quantity_by_uom" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "material_export_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_export_receipt" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_export_detail_id" UUID NOT NULL,
    "material_receipt_id" UUID,
    "quantity_by_pack" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "material_export_receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_export_request" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "manufacturer_order_id" UUID,
    "status" "MaterialExportRequestStatus" NOT NULL DEFAULT 'PENDING',
    "description" VARCHAR,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "material_export_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_inspection_criteria" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "code" VARCHAR NOT NULL,
    "criteria" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "material_inspection_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_receipt" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_id" UUID NOT NULL,
    "import_receipt_id" UUID NOT NULL,
    "expire_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "import_date" TIMESTAMPTZ(6),
    "pack_unit" TEXT,
    "quantity_by_pack" DOUBLE PRECISION,
    "uom" TEXT NOT NULL,
    "uomId" UUID,
    "uom_per_pack" DOUBLE PRECISION,

    CONSTRAINT "material_receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_type" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "code" VARCHAR,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "material_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_variant" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "code" VARCHAR NOT NULL,
    "pack_unit" VARCHAR NOT NULL,
    "uom_per_pack_unit" DOUBLE PRECISION NOT NULL,
    "packed_width" DOUBLE PRECISION NOT NULL,
    "packed_length" DOUBLE PRECISION NOT NULL,
    "packed_height" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "packed_weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "material_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "material_type_id" UUID NOT NULL,
    "uom_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "code" VARCHAR,
    "reorder_level" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otps" (
    "otp" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expired_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "po_delivery_detail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "po_delivery_id" UUID,
    "product_id" UUID,
    "total_ammount" DOUBLE PRECISION,
    "expire_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "pack_unit" TEXT,
    "quantity_by_pack" DOUBLE PRECISION,
    "uom" TEXT,
    "uom_per_pack" DOUBLE PRECISION,
    "material_variant_id" UUID,

    CONSTRAINT "po_delivery_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "po_delivery" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "purchase_order_id" UUID,
    "total_ammount" DOUBLE PRECISION,
    "tax_amount" DOUBLE PRECISION,
    "order_date" DATE,
    "expected_deliver_date" DATE,
    "deliver_date" DATE,
    "status" "po_delivery_status" NOT NULL DEFAULT 'PENDING',
    "is_extra" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "po_delivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attribute" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "value" VARCHAR NOT NULL,
    "type" "AttributeType" DEFAULT 'STRING',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "product_attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_formula" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "material_id" UUID NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "product_formula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_inspection_criteria" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "code" VARCHAR,
    "criteria" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "product_inspection_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_receipt" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "import_receipt_id" UUID NOT NULL,
    "expire_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "import_date" TIMESTAMPTZ(6),
    "quantity_by_uom" DOUBLE PRECISION,
    "uomId" UUID,

    CONSTRAINT "product_receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_type" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "code" VARCHAR,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "product_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_type" UUID NOT NULL,
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

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_department" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "production_department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "PO_number" VARCHAR NOT NULL,
    "quarterly_production_plan_id" UUID,
    "purchasing_staff_id" UUID,
    "currency" VARCHAR NOT NULL,
    "total_ammount" DOUBLE PRECISION NOT NULL,
    "tax_amount" DOUBLE PRECISION NOT NULL,
    "order_date" DATE NOT NULL,
    "expected_finish_date" DATE NOT NULL,
    "finish_date" DATE,
    "status" "purchase_order_status" NOT NULL DEFAULT 'IN_PROGESS',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "supplier_id" UUID NOT NULL,

    CONSTRAINT "purchase_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchasing_staff" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "purchasing_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_report_detail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "inventory_report_id" UUID,
    "storage_quantity" DOUBLE PRECISION,
    "recorded_quantity" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "inventory_report_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_report_plan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "end_time" TIME(6),
    "plan_end_time" TIME(6) NOT NULL,
    "plan_start_time" TIME(6) NOT NULL,
    "start_time" TIME(6),
    "status" "InventoryReportStatus" NOT NULL DEFAULT 'PLANNING',

    CONSTRAINT "inventory_report_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_report_type" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "inventory_report_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_report" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "inventory_report_type_id" UUID,
    "storage_quantity" DOUBLE PRECISION NOT NULL,
    "recorded_quantity" DOUBLE PRECISION NOT NULL,
    "quantity_disparity" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "inventory_report_plan_id" UUID,

    CONSTRAINT "inventory_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quarterly_production_detail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "quarterly_production_plan_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,
    "demand_quantity" DOUBLE PRECISION NOT NULL,
    "starting_quantity" DOUBLE PRECISION NOT NULL,
    "quantity_to_produce" DOUBLE PRECISION NOT NULL,
    "reserve_percent_id" UUID NOT NULL,
    "notation" VARCHAR NOT NULL,
    "start_date" DATE NOT NULL,
    "finish_date" DATE,
    "expected_ship_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "quarterly_production_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quarterly_production_plan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "quarter" VARCHAR,
    "code" VARCHAR,
    "annual_production_plan_id" UUID,
    "status" "production_status" NOT NULL DEFAULT 'PLANNING',
    "start_date" DATE,
    "finish_date" DATE,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "quarterly_production_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "status" BOOLEAN NOT NULL DEFAULT true,
    "expired_at" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),
    "refresh_token" TEXT NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("refresh_token")
);

-- CreateTable
CREATE TABLE "supplier" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "supplier_name" VARCHAR NOT NULL,
    "supplier_code" VARCHAR,
    "address" VARCHAR NOT NULL,
    "representative_name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "phone_number" VARCHAR NOT NULL,
    "fax" VARCHAR,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temp" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role" "role_codes",

    CONSTRAINT "temp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uom" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "uom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatar_url" TEXT,
    "cid_id" UUID,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "first_name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "is_deleted" BOOLEAN DEFAULT false,
    "is_verified" BOOLEAN DEFAULT false,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "status" TEXT DEFAULT 'active',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_manager" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "warehouse_manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_staff" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "warehouse_staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "annual_production_plan_code_key" ON "annual_production_plan"("code");

-- CreateIndex
CREATE UNIQUE INDEX "black_list_tokens_token_key" ON "black_list_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "import_receipt_inspection_report_id_key" ON "import_receipt"("inspection_report_id");

-- CreateIndex
CREATE UNIQUE INDEX "inspection_report_code_key" ON "inspection_report"("code");

-- CreateIndex
CREATE UNIQUE INDEX "material_attribute_material_id_name_key" ON "material_attribute"("material_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "material_inspection_criteria_code_key" ON "material_inspection_criteria"("code");

-- CreateIndex
CREATE UNIQUE INDEX "material_type_code_key" ON "material_type"("code");

-- CreateIndex
CREATE UNIQUE INDEX "material_code_key" ON "material"("code");

-- CreateIndex
CREATE UNIQUE INDEX "product_inspection_criteria_code_key" ON "product_inspection_criteria"("code");

-- CreateIndex
CREATE UNIQUE INDEX "product_type_code_key" ON "product_type"("code");

-- CreateIndex
CREATE UNIQUE INDEX "product_code_key" ON "product"("code");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_report_inventory_report_plan_id_key" ON "inventory_report"("inventory_report_plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "quarterly_production_plan_code_key" ON "quarterly_production_plan"("code");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_refresh_token_key" ON "refresh_tokens"("refresh_token");

-- CreateIndex
CREATE UNIQUE INDEX "supplier_supplier_code_key" ON "supplier"("supplier_code");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- AddForeignKey
ALTER TABLE "annual_production_plan" ADD CONSTRAINT "annual_production_plan_factory_director_id_fkey" FOREIGN KEY ("factory_director_id") REFERENCES "factory_director"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "export_material_request_detail" ADD CONSTRAINT "export_material_request_detail_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "export_material_request" ADD CONSTRAINT "export_material_request_production_department_id_fkey" FOREIGN KEY ("production_department_id") REFERENCES "production_department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "factory_director" ADD CONSTRAINT "factory_director_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_receipt" ADD CONSTRAINT "import_receipt_inspection_report_id_fkey" FOREIGN KEY ("inspection_report_id") REFERENCES "inspection_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_receipt" ADD CONSTRAINT "import_receipt_warehouse_staff_id_fkey" FOREIGN KEY ("warehouse_staff_id") REFERENCES "warehouse_staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request_detail" ADD CONSTRAINT "import_request_detail_import_request_id_fkey" FOREIGN KEY ("import_request_id") REFERENCES "import_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request_detail" ADD CONSTRAINT "import_request_detail_material_variant_id_fkey" FOREIGN KEY ("material_variant_id") REFERENCES "material_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request_detail" ADD CONSTRAINT "import_request_detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request" ADD CONSTRAINT "import_request_po_delivery_id_fkey" FOREIGN KEY ("po_delivery_id") REFERENCES "po_delivery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request" ADD CONSTRAINT "import_request_purchasing_staff_id_fkey" FOREIGN KEY ("purchasing_staff_id") REFERENCES "purchasing_staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request" ADD CONSTRAINT "import_request_warehouse_manager_id_fkey" FOREIGN KEY ("warehouse_manager_id") REFERENCES "warehouse_manager"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request" ADD CONSTRAINT "import_request_warehouse_staff_id_fkey" FOREIGN KEY ("warehouse_staff_id") REFERENCES "warehouse_staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_department" ADD CONSTRAINT "inspection_department_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_report_detail" ADD CONSTRAINT "inspection_report_detail_inspection_report_id_fkey" FOREIGN KEY ("inspection_report_id") REFERENCES "inspection_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_report_detail" ADD CONSTRAINT "inspection_report_detail_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_report_detail" ADD CONSTRAINT "inspection_report_detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_report" ADD CONSTRAINT "inspection_report_inspection_department_id_fkey" FOREIGN KEY ("inspection_department_id") REFERENCES "inspection_department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_request" ADD CONSTRAINT "inspection_request_inspection_department_id_fkey" FOREIGN KEY ("inspection_department_id") REFERENCES "inspection_department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_request" ADD CONSTRAINT "inspection_request_purchasing_staff_id_fkey" FOREIGN KEY ("purchasing_staff_id") REFERENCES "purchasing_staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "manufacture_order" ADD CONSTRAINT "manufacture_order_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_attribute" ADD CONSTRAINT "material_attribute_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_export_detail" ADD CONSTRAINT "material_export_detail_material_export_request_id_fkey" FOREIGN KEY ("material_export_request_id") REFERENCES "material_export_request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_export_detail" ADD CONSTRAINT "material_export_detail_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_export_receipt" ADD CONSTRAINT "material_export_receipt_material_export_detail_id_fkey" FOREIGN KEY ("material_export_detail_id") REFERENCES "material_export_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_export_receipt" ADD CONSTRAINT "material_export_receipt_material_receipt_id_fkey" FOREIGN KEY ("material_receipt_id") REFERENCES "material_receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_export_request" ADD CONSTRAINT "material_export_request_manufacturer_order_id_fkey" FOREIGN KEY ("manufacturer_order_id") REFERENCES "manufacture_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_inspection_criteria" ADD CONSTRAINT "material_inspection_criteria_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_receipt" ADD CONSTRAINT "material_receipt_import_receipt_id_fkey" FOREIGN KEY ("import_receipt_id") REFERENCES "import_receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_receipt" ADD CONSTRAINT "material_receipt_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_receipt" ADD CONSTRAINT "material_receipt_uomId_fkey" FOREIGN KEY ("uomId") REFERENCES "uom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "material_variant" ADD CONSTRAINT "material_variant_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_material_type_id_fkey" FOREIGN KEY ("material_type_id") REFERENCES "material_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_uom_id_fkey" FOREIGN KEY ("uom_id") REFERENCES "uom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "po_delivery_detail" ADD CONSTRAINT "po_delivery_detail_material_variant_id_fkey" FOREIGN KEY ("material_variant_id") REFERENCES "material_variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "po_delivery_detail" ADD CONSTRAINT "po_delivery_detail_po_delivery_id_fkey" FOREIGN KEY ("po_delivery_id") REFERENCES "po_delivery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "po_delivery_detail" ADD CONSTRAINT "po_delivery_detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "po_delivery" ADD CONSTRAINT "po_delivery_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_attribute" ADD CONSTRAINT "product_attribute_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_formula" ADD CONSTRAINT "product_formula_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_formula" ADD CONSTRAINT "product_formula_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_inspection_criteria" ADD CONSTRAINT "product_inspection_criteria_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_receipt" ADD CONSTRAINT "product_receipt_import_receipt_id_fkey" FOREIGN KEY ("import_receipt_id") REFERENCES "import_receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_receipt" ADD CONSTRAINT "product_receipt_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_receipt" ADD CONSTRAINT "product_receipt_uomId_fkey" FOREIGN KEY ("uomId") REFERENCES "uom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_product_type_fkey" FOREIGN KEY ("product_type") REFERENCES "product_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_uom_id_fkey" FOREIGN KEY ("uom_id") REFERENCES "uom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_department" ADD CONSTRAINT "production_department_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_order" ADD CONSTRAINT "purchase_order_purchasing_staff_id_fkey" FOREIGN KEY ("purchasing_staff_id") REFERENCES "purchasing_staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_order" ADD CONSTRAINT "purchase_order_quarterly_production_plan_id_fkey" FOREIGN KEY ("quarterly_production_plan_id") REFERENCES "quarterly_production_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_order" ADD CONSTRAINT "purchase_order_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchasing_staff" ADD CONSTRAINT "purchasing_staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_report_detail" ADD CONSTRAINT "inventory_report_detail_inventory_report_id_fkey" FOREIGN KEY ("inventory_report_id") REFERENCES "inventory_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_report" ADD CONSTRAINT "inventory_report_inventory_report_plan_id_fkey" FOREIGN KEY ("inventory_report_plan_id") REFERENCES "inventory_report_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_report" ADD CONSTRAINT "inventory_report_inventory_report_type_id_fkey" FOREIGN KEY ("inventory_report_type_id") REFERENCES "inventory_report_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quarterly_production_detail" ADD CONSTRAINT "quarterly_production_detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quarterly_production_detail" ADD CONSTRAINT "quarterly_production_detail_quarterly_production_plan_id_fkey" FOREIGN KEY ("quarterly_production_plan_id") REFERENCES "quarterly_production_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quarterly_production_plan" ADD CONSTRAINT "quarterly_production_plan_annual_production_plan_id_fkey" FOREIGN KEY ("annual_production_plan_id") REFERENCES "annual_production_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warehouse_manager" ADD CONSTRAINT "warehouse_manager_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warehouse_staff" ADD CONSTRAINT "warehouse_staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
