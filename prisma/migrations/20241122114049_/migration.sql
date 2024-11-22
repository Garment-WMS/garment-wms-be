-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "production_batch_status" ADD VALUE 'WAITING_FOR_EXPORTING_MATERIAL';
ALTER TYPE "production_batch_status" ADD VALUE 'WAITING_FOR_EXPORTED_MATERIAL';
ALTER TYPE "production_batch_status" ADD VALUE 'MANUFACTURING';
ALTER TYPE "production_batch_status" ADD VALUE 'MANUFACTURED';
