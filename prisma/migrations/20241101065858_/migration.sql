-- CreateEnum
CREATE TYPE "inventory_report_plan_status" AS ENUM ('PENDING', 'IN_PROGRESS', 'DONE', 'CANCELLED');

-- CreateTable
CREATE TABLE "inventory_report_plan_detail" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "inventory_report_plan_id" UUID NOT NULL,
    "product_size_id" UUID,
    "material_package_id" UUID,
    "warehouse_staff_id" UUID NOT NULL,
    "code" VARCHAR NOT NULL,
    "note" VARCHAR,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "inventory_report_plan_detail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_report_plan" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "warehouse_manager_id" UUID NOT NULL,
    "code" VARCHAR NOT NULL,
    "status" "inventory_report_plan_status" NOT NULL DEFAULT 'PENDING',
    "note" VARCHAR,
    "from" TIMESTAMPTZ(6) NOT NULL,
    "to" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "inventory_report_plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inventory_report_plan_code_key" ON "inventory_report_plan"("code");

-- AddForeignKey
ALTER TABLE "inventory_report_plan_detail" ADD CONSTRAINT "inventory_report_plan_detail_inventory_report_plan_id_fkey" FOREIGN KEY ("inventory_report_plan_id") REFERENCES "inventory_report_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_report_plan_detail" ADD CONSTRAINT "inventory_report_plan_detail_product_size_id_fkey" FOREIGN KEY ("product_size_id") REFERENCES "product_size"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_report_plan_detail" ADD CONSTRAINT "inventory_report_plan_detail_material_package_id_fkey" FOREIGN KEY ("material_package_id") REFERENCES "material_package"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_report_plan_detail" ADD CONSTRAINT "inventory_report_plan_detail_warehouse_staff_id_fkey" FOREIGN KEY ("warehouse_staff_id") REFERENCES "warehouse_staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_report_plan" ADD CONSTRAINT "inventory_report_plan_warehouse_manager_id_fkey" FOREIGN KEY ("warehouse_manager_id") REFERENCES "warehouse_manager"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
