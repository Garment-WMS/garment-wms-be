-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "export_material_request_status" AS ENUM ('PENDING', 'REJECTED', 'APPROVED', 'IN_PROGRESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "import_request_status" AS ENUM ('PENDING', 'REJECTED', 'APPROVED', 'IN_PROGRESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "inspection_request_status" AS ENUM ('PENDING', 'CANCELLED', 'IN_PROGESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "po_receipt_status" AS ENUM ('PENDING', 'FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "production_patch_order_status" AS ENUM ('IN_PROGRESS', 'CANCELLED', 'FINISHED');

-- CreateEnum
CREATE TYPE "purchase_order_status" AS ENUM ('PENDING', 'FINISHED');

-- CreateEnum
CREATE TYPE "production_status" AS ENUM ('NOT_STARTED', 'IN_PROGESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "role_codes" AS ENUM ('RENTER', 'LANDLORD', 'STAFF', 'TECHNICAL_STAFF', 'ADMIN', 'MANAGER');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateTable
CREATE TABLE "annual_production_detail" (
    "id" UUID NOT NULL,
    "annual_production_plan_id" UUID,
    "product_id" UUID,
    "demand_quantity" DOUBLE PRECISION,
    "starting_quantity" DOUBLE PRECISION,
    "quantity_to_produce" DOUBLE PRECISION,
    "note" VARCHAR,
    "start_date" DATE,
    "finish_date" DATE,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "annual_production_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "annual_production_plan" (
    "id" UUID NOT NULL,
    "factory_director_id" UUID,
    "year" INTEGER,
    "code" VARCHAR,
    "status" "production_status",
    "expected_start_date" DATE,
    "expected_end_date" DATE,
    "start_date" DATE,
    "finish_date" DATE,
    "created_at" TIMESTAMPTZ(6),
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
CREATE TABLE "delivery_note_detail" (
    "id" UUID NOT NULL,
    "delivery_note_id" UUID,
    "material_id" UUID,
    "product_id" UUID,
    "quantity" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "delivery_note_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delivery_note" (
    "id" UUID NOT NULL,
    "po_receipt_id" UUID,
    "warehouse_staff_id" UUID,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "delivery_note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "export_material_request_detail" (
    "id" UUID NOT NULL,
    "material_id" UUID,
    "quantity" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "export_material_request_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "export_material_request" (
    "id" UUID NOT NULL,
    "production_department_id" UUID,
    "status" "export_material_request_status",
    "expected_deliver_date" DATE,
    "deliver_date" DATE,
    "reserve_percent_id" UUID,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "export_material_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "factory_director" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "factory_director_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_receipt" (
    "id" UUID NOT NULL,
    "warehouse_staff_id" UUID,
    "start_at" TIMESTAMPTZ(6),
    "finish_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "import_receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_request_detail" (
    "id" UUID NOT NULL,
    "import_request_id" UUID,
    "material_id" UUID,
    "product_id" UUID,
    "quantity" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "import_request_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "import_request" (
    "id" UUID NOT NULL,
    "delivery_note_id" UUID,
    "warehouse_staff_id" UUID,
    "status" "import_request_status",
    "from" VARCHAR,
    "to" VARCHAR,
    "start_at" TIMESTAMPTZ(6),
    "finish_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "import_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_department" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "inspection_department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_report_detail" (
    "id" UUID NOT NULL,
    "material_id" UUID,
    "product_id" UUID,
    "inspected_quantity" DOUBLE PRECISION,
    "defect_quantity" DOUBLE PRECISION,
    "approved_quantity" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "inspection_report_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_report" (
    "id" UUID NOT NULL,
    "inspection_department_id" UUID,
    "code" VARCHAR,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "inspection_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inspection_request" (
    "id" UUID NOT NULL,
    "purchasing_staff_id" UUID,
    "inspection_department_id" UUID,
    "delivery_note_id" UUID,
    "notation" TEXT,
    "status" "inspection_request_status",
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "inspection_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_attribute" (
    "id" UUID NOT NULL,
    "material_id" UUID,
    "name" VARCHAR,
    "value" VARCHAR,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "material_attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_export" (
    "id" UUID NOT NULL,
    "quantity" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "material_export_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_inspection_criteria" (
    "id" UUID NOT NULL,
    "material_id" UUID,
    "name" VARCHAR,
    "code" VARCHAR,
    "criteria" VARCHAR,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "material_inspection_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_supplier" (
    "id" UUID NOT NULL,
    "material_id" UUID,
    "supplier_id" UUID,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "material_supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_type" (
    "id" UUID NOT NULL,
    "name" VARCHAR,
    "code" VARCHAR,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "material_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material" (
    "id" UUID NOT NULL,
    "material_type_id" UUID,
    "name" VARCHAR,
    "code" VARCHAR,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "length" DOUBLE PRECISION,
    "min_quantity" DOUBLE PRECISION,
    "unit_id" UUID,
    "store_unit_id" UUID,
    "unit_per_store_unit" DOUBLE PRECISION,
    "store_unit_per_cell" DOUBLE PRECISION,
    "quantity_per_store_unit" DOUBLE PRECISION,
    "width_per_store_unit" DOUBLE PRECISION,
    "height_per_store_unit" DOUBLE PRECISION,
    "length_per_store_unit" DOUBLE PRECISION,
    "weight_per_store_unit" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "material_receipt" (
    "id" UUID NOT NULL,
    "material_id" UUID,
    "import_receipt_id" UUID,
    "quantity" DOUBLE PRECISION,
    "expire_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "material_receipt_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "po_receipt_detail" (
    "id" UUID NOT NULL,
    "po_receipt_id" UUID,
    "material_id" UUID,
    "product_id" UUID,
    "quantity" DOUBLE PRECISION,
    "total_ammount" DOUBLE PRECISION,
    "expire_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "po_receipt_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "po_receipt" (
    "id" UUID NOT NULL,
    "purchase_order_id" UUID,
    "total_ammount" DOUBLE PRECISION,
    "tax_amount" DOUBLE PRECISION,
    "order_date" DATE,
    "expected_deliver_date" DATE,
    "deliver_date" DATE,
    "status" "po_receipt_status",
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "po_receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_formula" (
    "id" UUID NOT NULL,
    "product_id" UUID,
    "material_id" UUID,
    "quantity" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "product_formula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_inspection_criteria" (
    "id" UUID NOT NULL,
    "product_id" UUID,
    "name" VARCHAR,
    "code" VARCHAR,
    "criteria" VARCHAR,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "product_inspection_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_receipt" (
    "id" UUID NOT NULL,
    "product_id" UUID,
    "import_receipt_id" UUID,
    "quantity" DOUBLE PRECISION,
    "expire_date" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "product_receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_type" (
    "id" UUID NOT NULL,
    "name" VARCHAR,
    "code" VARCHAR,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "product_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" UUID NOT NULL,
    "product_type" UUID,
    "name" VARCHAR,
    "code" VARCHAR,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "length" DOUBLE PRECISION,
    "min_quantity" DOUBLE PRECISION,
    "unit_id" UUID,
    "store_unit_id" UUID,
    "unit_per_store_unit" DOUBLE PRECISION,
    "store_unit_per_cell" DOUBLE PRECISION,
    "quantity_per_store_unit" DOUBLE PRECISION,
    "width_per_store_unit" DOUBLE PRECISION,
    "height_per_store_unit" DOUBLE PRECISION,
    "length_per_store_unit" DOUBLE PRECISION,
    "weight_per_store_unit" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_attribute" (
    "id" UUID NOT NULL,
    "product_id" UUID,
    "name" VARCHAR,
    "value" VARCHAR,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "product_attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_department" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "production_department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "production_patch_order" (
    "id" UUID NOT NULL,
    "quarterly_production_detail_id" UUID,
    "quantity_to_produce" DOUBLE PRECISION,
    "expected_start_date" DATE,
    "expected_finish_date" DATE,
    "status" "production_patch_order_status",
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "production_patch_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order" (
    "id" UUID NOT NULL,
    "PO_number" VARCHAR,
    "quarterly_production_plan_id" UUID,
    "purchasing_staff_id" UUID,
    "shipping_address" VARCHAR,
    "currency" VARCHAR,
    "total_ammount" DOUBLE PRECISION,
    "tax_amount" DOUBLE PRECISION,
    "order_date" DATE,
    "expected_finish_date" DATE,
    "finish_date" DATE,
    "status" "purchase_order_status",
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "purchase_order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchasing_staff" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "purchasing_staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quantity_report_detail" (
    "id" UUID NOT NULL,
    "quantity_report_id" UUID,
    "storage_quantity" DOUBLE PRECISION,
    "recorded_quantity" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "quantity_report_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quantity_report_plan" (
    "id" UUID NOT NULL,
    "quantity_report_id" UUID,
    "date" DATE,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "quantity_report_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quantity_report_type" (
    "id" UUID NOT NULL,
    "name" VARCHAR,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "quantity_report_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quantity_report" (
    "id" UUID NOT NULL,
    "quantity_report_type_id" UUID,
    "storage_quantity" DOUBLE PRECISION,
    "recorded_quantity" DOUBLE PRECISION,
    "quantity_disparity" DOUBLE PRECISION,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "quantity_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quarterly_production_detail" (
    "id" UUID NOT NULL,
    "quarterly_production_plan_id" UUID,
    "product_id" UUID,
    "demand_quantity" DOUBLE PRECISION,
    "starting_quantity" DOUBLE PRECISION,
    "quantity_to_produce" DOUBLE PRECISION,
    "reserve_percent_id" UUID,
    "notation" VARCHAR,
    "start_date" DATE,
    "finish_date" DATE,
    "expected_ship_date" DATE,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "quarterly_production_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quarterly_production_plan" (
    "id" UUID NOT NULL,
    "quarter" VARCHAR,
    "code" VARCHAR,
    "annual_production_plan_id" UUID,
    "status" "production_status",
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
CREATE TABLE "reserve_percent" (
    "id" UUID NOT NULL,
    "percent" DOUBLE PRECISION,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "reserve_percent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_unit" (
    "id" UUID NOT NULL,
    "name" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "store_unit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supplier" (
    "id" UUID NOT NULL,
    "supplier_name" VARCHAR,
    "supplier_code" VARCHAR,
    "address" VARCHAR,
    "representative_name" VARCHAR,
    "email" VARCHAR,
    "phone_number" VARCHAR,
    "fax" VARCHAR,
    "created_at" TIMESTAMPTZ(6),
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
CREATE TABLE "unit" (
    "id" UUID NOT NULL,
    "name" VARCHAR,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "unit_pkey" PRIMARY KEY ("id")
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
    "id" UUID NOT NULL,
    "user_id" UUID,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "warehouse_manager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_staff" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "created_at" TIMESTAMP(6),
    "updated_at" TIMESTAMP(6),
    "deleted_at" TIMESTAMP(6),

    CONSTRAINT "warehouse_staff_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "annual_production_plan_code_key" ON "annual_production_plan"("code");

-- CreateIndex
CREATE UNIQUE INDEX "black_list_tokens_token_key" ON "black_list_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "inspection_report_code_key" ON "inspection_report"("code");

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
ALTER TABLE "annual_production_detail" ADD CONSTRAINT "annual_production_detail_annual_production_plan_id_fkey" FOREIGN KEY ("annual_production_plan_id") REFERENCES "annual_production_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "annual_production_detail" ADD CONSTRAINT "annual_production_detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "annual_production_plan" ADD CONSTRAINT "annual_production_plan_factory_director_id_fkey" FOREIGN KEY ("factory_director_id") REFERENCES "factory_director"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery_note_detail" ADD CONSTRAINT "delivery_note_detail_delivery_note_id_fkey" FOREIGN KEY ("delivery_note_id") REFERENCES "delivery_note"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery_note_detail" ADD CONSTRAINT "delivery_note_detail_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery_note_detail" ADD CONSTRAINT "delivery_note_detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery_note" ADD CONSTRAINT "delivery_note_po_receipt_id_fkey" FOREIGN KEY ("po_receipt_id") REFERENCES "po_receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "delivery_note" ADD CONSTRAINT "delivery_note_warehouse_staff_id_fkey" FOREIGN KEY ("warehouse_staff_id") REFERENCES "warehouse_staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "export_material_request_detail" ADD CONSTRAINT "export_material_request_detail_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "export_material_request" ADD CONSTRAINT "export_material_request_production_department_id_fkey" FOREIGN KEY ("production_department_id") REFERENCES "production_department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "export_material_request" ADD CONSTRAINT "export_material_request_reserve_percent_id_fkey" FOREIGN KEY ("reserve_percent_id") REFERENCES "reserve_percent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "factory_director" ADD CONSTRAINT "factory_director_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_receipt" ADD CONSTRAINT "import_receipt_warehouse_staff_id_fkey" FOREIGN KEY ("warehouse_staff_id") REFERENCES "warehouse_staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request_detail" ADD CONSTRAINT "import_request_detail_import_request_id_fkey" FOREIGN KEY ("import_request_id") REFERENCES "import_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request_detail" ADD CONSTRAINT "import_request_detail_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request_detail" ADD CONSTRAINT "import_request_detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request" ADD CONSTRAINT "import_request_delivery_note_id_fkey" FOREIGN KEY ("delivery_note_id") REFERENCES "delivery_note"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "import_request" ADD CONSTRAINT "import_request_warehouse_staff_id_fkey" FOREIGN KEY ("warehouse_staff_id") REFERENCES "warehouse_staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_department" ADD CONSTRAINT "inspection_department_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_report_detail" ADD CONSTRAINT "inspection_report_detail_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_report_detail" ADD CONSTRAINT "inspection_report_detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_report" ADD CONSTRAINT "inspection_report_inspection_department_id_fkey" FOREIGN KEY ("inspection_department_id") REFERENCES "inspection_department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_request" ADD CONSTRAINT "inspection_request_delivery_note_id_fkey" FOREIGN KEY ("delivery_note_id") REFERENCES "delivery_note"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_request" ADD CONSTRAINT "inspection_request_inspection_department_id_fkey" FOREIGN KEY ("inspection_department_id") REFERENCES "inspection_department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inspection_request" ADD CONSTRAINT "inspection_request_purchasing_staff_id_fkey" FOREIGN KEY ("purchasing_staff_id") REFERENCES "purchasing_staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_attribute" ADD CONSTRAINT "material_attribute_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_inspection_criteria" ADD CONSTRAINT "material_inspection_criteria_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_supplier" ADD CONSTRAINT "material_supplier_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_supplier" ADD CONSTRAINT "material_supplier_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_material_type_id_fkey" FOREIGN KEY ("material_type_id") REFERENCES "material_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_store_unit_id_fkey" FOREIGN KEY ("store_unit_id") REFERENCES "store_unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material" ADD CONSTRAINT "material_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_receipt" ADD CONSTRAINT "material_receipt_import_receipt_id_fkey" FOREIGN KEY ("import_receipt_id") REFERENCES "import_receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "material_receipt" ADD CONSTRAINT "material_receipt_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "po_receipt_detail" ADD CONSTRAINT "po_receipt_detail_material_id_fkey" FOREIGN KEY ("material_id") REFERENCES "material"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "po_receipt_detail" ADD CONSTRAINT "po_receipt_detail_po_receipt_id_fkey" FOREIGN KEY ("po_receipt_id") REFERENCES "po_receipt"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "po_receipt_detail" ADD CONSTRAINT "po_receipt_detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "po_receipt" ADD CONSTRAINT "po_receipt_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

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
ALTER TABLE "product" ADD CONSTRAINT "product_product_type_fkey" FOREIGN KEY ("product_type") REFERENCES "product_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_store_unit_id_fkey" FOREIGN KEY ("store_unit_id") REFERENCES "store_unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "unit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_attribute" ADD CONSTRAINT "product_attribute_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_department" ADD CONSTRAINT "production_department_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "production_patch_order" ADD CONSTRAINT "production_patch_order_quarterly_production_detail_id_fkey" FOREIGN KEY ("quarterly_production_detail_id") REFERENCES "quarterly_production_detail"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_order" ADD CONSTRAINT "purchase_order_purchasing_staff_id_fkey" FOREIGN KEY ("purchasing_staff_id") REFERENCES "purchasing_staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchase_order" ADD CONSTRAINT "purchase_order_quarterly_production_plan_id_fkey" FOREIGN KEY ("quarterly_production_plan_id") REFERENCES "quarterly_production_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "purchasing_staff" ADD CONSTRAINT "purchasing_staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quantity_report_detail" ADD CONSTRAINT "quantity_report_detail_quantity_report_id_fkey" FOREIGN KEY ("quantity_report_id") REFERENCES "quantity_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quantity_report" ADD CONSTRAINT "quantity_report_quantity_report_type_id_fkey" FOREIGN KEY ("quantity_report_type_id") REFERENCES "quantity_report_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quarterly_production_detail" ADD CONSTRAINT "quarterly_production_detail_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quarterly_production_detail" ADD CONSTRAINT "quarterly_production_detail_quarterly_production_plan_id_fkey" FOREIGN KEY ("quarterly_production_plan_id") REFERENCES "quarterly_production_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quarterly_production_detail" ADD CONSTRAINT "quarterly_production_detail_reserve_percent_id_fkey" FOREIGN KEY ("reserve_percent_id") REFERENCES "reserve_percent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "quarterly_production_plan" ADD CONSTRAINT "quarterly_production_plan_annual_production_plan_id_fkey" FOREIGN KEY ("annual_production_plan_id") REFERENCES "annual_production_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warehouse_manager" ADD CONSTRAINT "warehouse_manager_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "warehouse_staff" ADD CONSTRAINT "warehouse_staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
