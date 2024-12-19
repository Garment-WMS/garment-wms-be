-- CreateEnum
CREATE TYPE "MaterialReceiptStatus" AS ENUM ('IMPORTING', 'AVAILABLE', 'PARTIAL_USED', 'USED', 'DISPOSED');

-- AlterTable
ALTER TABLE "material_receipt" ADD COLUMN     "status" "MaterialReceiptStatus" NOT NULL DEFAULT 'IMPORTING';
