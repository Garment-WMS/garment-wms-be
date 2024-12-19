-- CreateEnum
CREATE TYPE "receipt_status" AS ENUM ('IMPORTING', 'REJECTED', 'IMPORTED');

-- AlterTable
ALTER TABLE "import_receipt" ADD COLUMN     "status" "receipt_status" NOT NULL DEFAULT 'IMPORTING';
