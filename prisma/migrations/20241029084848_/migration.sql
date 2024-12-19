/*
  Warnings:

  - The values [PENDING] on the enum `import_request_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [PRODUCT_BY_MO,PRODUCT_NOT_BY_MO] on the enum `import_request_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "import_request_status_new" AS ENUM ('ARRIVED', 'CANCELED', 'REJECTED', 'APPROVED', 'INSPECTING', 'INSPECTED');
ALTER TABLE "import_request" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "import_request" ALTER COLUMN "status" TYPE "import_request_status_new" USING ("status"::text::"import_request_status_new");
ALTER TYPE "import_request_status" RENAME TO "import_request_status_old";
ALTER TYPE "import_request_status_new" RENAME TO "import_request_status";
DROP TYPE "import_request_status_old";
ALTER TABLE "import_request" ALTER COLUMN "status" SET DEFAULT 'ARRIVED';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "import_request_type_new" AS ENUM ('MATERIAL_BY_PO', 'MATERIAL_RETURN', 'MATERIAL_NOT_BY_PO', 'PRODUCT_BY_BATCH', 'PRODUCT_RETURN', 'PRODUCT_NOT_BY_BATCH');
ALTER TABLE "import_request" ALTER COLUMN "import_request_type" TYPE "import_request_type_new" USING ("import_request_type"::text::"import_request_type_new");
ALTER TYPE "import_request_type" RENAME TO "import_request_type_old";
ALTER TYPE "import_request_type_new" RENAME TO "import_request_type";
DROP TYPE "import_request_type_old";
COMMIT;

-- AlterTable
ALTER TABLE "inspection_request" ADD COLUMN     "warehouse_manager_id" UUID;

-- AddForeignKey
ALTER TABLE "inspection_request" ADD CONSTRAINT "inspection_request_warehouse_manager_id_fkey" FOREIGN KEY ("warehouse_manager_id") REFERENCES "warehouse_manager"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
