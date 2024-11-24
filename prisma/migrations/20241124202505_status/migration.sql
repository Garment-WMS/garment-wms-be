-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "MaterialExportRequestStatus" ADD VALUE 'AWAIT_TO_EXPORT';
ALTER TYPE "MaterialExportRequestStatus" ADD VALUE 'EXPORTING';
ALTER TYPE "MaterialExportRequestStatus" ADD VALUE 'EXPORTED';

-- AlterEnum
ALTER TYPE "export_receipt_status" ADD VALUE 'AWAIT_TO_EXPORT';

-- AlterEnum
ALTER TYPE "import_request_status" ADD VALUE 'AWAIT_TO_IMPORT';

-- AlterEnum
ALTER TYPE "receipt_status" ADD VALUE 'AWAIT_TO_IMPORT';
