-- AlterTable
ALTER TABLE "import_request" ADD COLUMN     "material_export_request_id" UUID;

-- AlterTable
ALTER TABLE "material_export_receipt" ALTER COLUMN "status" SET DEFAULT 'AWAIT_TO_EXPORT';

-- AddForeignKey
ALTER TABLE "import_request" ADD CONSTRAINT "import_request_material_export_request_id_fkey" FOREIGN KEY ("material_export_request_id") REFERENCES "material_export_request"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
