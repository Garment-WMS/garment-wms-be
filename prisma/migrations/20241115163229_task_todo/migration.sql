-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('IMPORT', 'EXPORT', 'INSPECTION', 'INVENTORY');

-- CreateTable
CREATE TABLE "Task" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR,
    "import_receipt_id" UUID,
    "export_receipt_id" UUID,
    "material_export_receipt_id" UUID,
    "inspection_request_id" UUID,
    "inventory_report_id" UUID,
    "warehouse_staff_id" UUID,
    "inspection_department_id" UUID,
    "task_type_id" "TaskType" NOT NULL,
    "staff_note" TEXT,
    "status" "TaskStatus" NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "todo" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR,
    "title" TEXT NOT NULL,
    "seq_number" INTEGER NOT NULL DEFAULT 0,
    "is_checked" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "todo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_import_receipt_id_fkey" FOREIGN KEY ("import_receipt_id") REFERENCES "import_receipt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_material_export_receipt_id_fkey" FOREIGN KEY ("material_export_receipt_id") REFERENCES "material_export_receipt"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_inspection_request_id_fkey" FOREIGN KEY ("inspection_request_id") REFERENCES "inspection_request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_inventory_report_id_fkey" FOREIGN KEY ("inventory_report_id") REFERENCES "inventory_report"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_warehouse_staff_id_fkey" FOREIGN KEY ("warehouse_staff_id") REFERENCES "warehouse_staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_inspection_department_id_fkey" FOREIGN KEY ("inspection_department_id") REFERENCES "inspection_department"("id") ON DELETE SET NULL ON UPDATE CASCADE;
