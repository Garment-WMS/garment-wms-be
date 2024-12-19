-- AlterEnum
ALTER TYPE "inspection_request_status" ADD VALUE 'AWAIT_TO_INSPECT';

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "expected_started_at" TIMESTAMPTZ(6),
ADD COLUMN     "import_requestId" UUID;

-- AlterTable
ALTER TABLE "material_export_request" ADD COLUMN     "production_reject_at" TIMESTAMPTZ(6),
ADD COLUMN     "production_reject_reason" TEXT;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_import_requestId_fkey" FOREIGN KEY ("import_requestId") REFERENCES "import_request"("id") ON DELETE SET NULL ON UPDATE CASCADE;
