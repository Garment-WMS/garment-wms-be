-- AlterTable
ALTER TABLE "material_export_receipt" ALTER COLUMN "warehouse_staff_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "production_batch" ALTER COLUMN "start_date" SET DATA TYPE TIME(6),
ALTER COLUMN "finished_date" SET DATA TYPE TIME(6),
ALTER COLUMN "expected_finish_date" SET DATA TYPE TIME(6),
ALTER COLUMN "expected_start_date" SET DATA TYPE TIME(6);
